import Request from "../models/Request.js";
import { buildStageFlow, nextStage } from "../utils/stageFlow.js";

function nextControlNumber() {
  const year = new Date().getFullYear();
  const seq = String(Math.floor(Math.random() * 90000) + 10000);
  return `${year}-${seq}`;
}

// Strips incident logs for roles that shouldn't see them (Admin).
function serialize(reqDoc, role) {
  const obj = reqDoc.toObject();
  if (role === "admin") delete obj.logs;
  return obj;
}

export async function checkLedTvAvailability(req, res) {
  try {
    const { date } = req.query;
    if (!date) return res.status(400).json({ message: "date query param is required" });

    const conflict = await Request.findOne({
      date,
      ledTv: true,
      stage: { $ne: "rejected" },
    }).select("eventName controlNumber");

    if (conflict) {
      return res.json({
        available: false,
        conflict: { eventName: conflict.eventName, controlNumber: conflict.controlNumber },
      });
    }
    res.json({ available: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function createRequest(req, res) {
  try {
    if (req.body.ledTv) {
      const conflict = await Request.findOne({
        date: req.body.date,
        ledTv: true,
        stage: { $ne: "rejected" },
      });
      if (conflict) {
        return res.status(409).json({
          message: `The LED TV is already booked on this date for ${conflict.eventName}.`,
        });
      }
    }

    const doc = await Request.create({
      ...req.body,
      controlNumber: nextControlNumber(),
      requestor: req.user._id,
      requestorName: req.user.name,
      // "submitted" is only the visual first step in the pipeline — the
      // request goes straight into the Department Head's queue, since
      // that's the only stage getPendingForReview() looks for.
      stage: "dept_head",
      logs: [],
    });

    res.status(201).json({ request: doc });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function getMyRequests(req, res) {
  try {
    const docs = await Request.find({ requestor: req.user._id }).sort({ createdAt: -1 });
    res.json({ requests: docs });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function getPendingForReview(req, res) {
  try {
    const docs = await Request.find({ stage: "dept_head" }).sort({ createdAt: -1 });
    res.json({ requests: docs });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function getAllRequests(req, res) {
  try {
    const docs = await Request.find().sort({ createdAt: -1 });
    res.json({ requests: docs.map((d) => serialize(d, req.user.role)) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function updateRequest(req, res) {
  try {
    const allowedFields = ["eventName", "venue", "date", "time", "urgency"];
    const patch = {};
    for (const key of allowedFields) {
      if (key in req.body) patch[key] = req.body[key];
    }

    const doc = await Request.findByIdAndUpdate(req.params.id, patch, { new: true });
    if (!doc) return res.status(404).json({ message: "Request not found" });

    res.json({ request: serialize(doc, req.user.role) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function advanceStage(req, res) {
  try {
    const { action } = req.body; // "approve" | "reject"
    const doc = await Request.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "Request not found" });

    // Only the department head can approve/reject the dept_head gate.
    if (doc.stage === "dept_head" && req.user.role !== "dept_head" && req.user.role !== "super_user") {
      return res.status(403).json({ message: "Only the department head can act on this request" });
    }

    if (action === "reject") {
      doc.stage = "rejected";
    } else {
      doc.stage = nextStage(doc.stage, doc.ledTv);
    }

    await doc.save();
    res.json({ request: serialize(doc, req.user.role) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function addLog(req, res) {
  try {
    const { note } = req.body;
    if (!note || !note.trim()) return res.status(400).json({ message: "note is required" });

    const doc = await Request.findByIdAndUpdate(
      req.params.id,
      { $push: { logs: { author: req.user.name, note: note.trim() } } },
      { new: true }
    );
    if (!doc) return res.status(404).json({ message: "Request not found" });

    res.json({ request: doc });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function deleteRequest(req, res) {
  try {
    const doc = await Request.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ message: "Request not found" });
    res.json({ message: "Request deleted", id: req.params.id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export function getStageFlowPreview(req, res) {
  const ledTv = req.query.ledTv === "true";
  res.json({ flow: buildStageFlow(ledTv) });
}
