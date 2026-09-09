import app from "../app.js";
import { connectDB } from "../config/db.js";

export default async function handler(req, res) {
  try {
    await connectDB();
  } catch (err) {
    res.status(500).json({ message: "Database connection failed", detail: err.message });
    return;
  }
  return app(req, res);
}
