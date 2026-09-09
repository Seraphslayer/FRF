import mongoose from "mongoose";
import dns from "node:dns";

// On some Windows setups, Node's DNS resolver fails to query a router's
// link-local IPv6 address (fe80::...) even though the OS resolver handles it
// fine — this surfaces as "querySrv ECONNREFUSED" on mongodb+srv:// URIs.
// Forcing Node to use public DNS servers directly sidesteps that. Harmless
// in production/Vercel too.
dns.setServers(["8.8.8.8", "1.1.1.1"]);

// Serverless functions can reuse a "warm" container between invocations, so
// we cache the connection on the global object instead of reconnecting every
// request — that's what keeps this safe on Vercel instead of exhausting
// Atlas's connection limit.
let cached = global._mongooseConn;
if (!cached) cached = global._mongooseConn = { conn: null, promise: null };

export async function connectDB() {
  if (cached.conn) return cached.conn;

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error(
      "MONGODB_URI is not set. Locally: add it to .env. On Vercel: add it under Project Settings \u2192 Environment Variables."
    );
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(uri).then((m) => {
      console.log(`MongoDB connected: ${m.connection.host}`);
      return m;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
