import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import requestRoutes from "./routes/requestRoutes.js";

const app = express();

// CLIENT_ORIGIN can be a comma-separated list — useful once you have both a
// localhost frontend and a deployed Vercel frontend to allow at once.
const allowedOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((s) => s.trim());

app.use(
  cors({
    origin(origin, callback) {
      // Allow no-origin requests (curl, server-to-server, health checks).
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error("Not allowed by CORS"));
    },
  })
);
app.use(express.json());

app.get("/api/health", (req, res) => res.json({ ok: true }));
app.use("/api/auth", authRoutes);
app.use("/api/requests", requestRoutes);

app.use((req, res) => res.status(404).json({ message: "Not found" }));

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Something went wrong on the server" });
});

export default app;
