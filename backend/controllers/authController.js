import jwt from "jsonwebtoken";
import User from "../models/User.js";

function signToken(user) {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
}

function toPublicUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    department: user.department,
  };
}

export async function register(req, res) {
  try {
    const { name, email, password, role, department } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(409).json({ message: "An account with that email already exists" });

    const user = await User.create({
      name,
      email,
      password,
      role: role || "requestor",
      department,
    });

    res.status(201).json({ token: signToken(user), user: toPublicUser(user) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({ token: signToken(user), user: toPublicUser(user) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function me(req, res) {
  res.json({ user: toPublicUser(req.user) });
}
