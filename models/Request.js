import mongoose from "mongoose";

const logSchema = new mongoose.Schema(
  {
    author: { type: String, required: true },
    note: { type: String, required: true },
  },
  { timestamps: { createdAt: "ts", updatedAt: false } }
);

const requestSchema = new mongoose.Schema(
  {
    controlNumber: { type: String, required: true, unique: true },

    requestor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    requestorName: { type: String, required: true },
    requestorType: { type: String, enum: ["student", "employee"], required: true },
    department: { type: String, required: true, trim: true },
    contact: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },

    eventName: { type: String, required: true, trim: true },
    venue: {
      type: String,
      required: true,
      enum: [
        "Gym",
        "NCST Field",
        "HRM Bar",
        "Multipurpose Hall",
        "SH Main Building",
        "NASTECH Gym",
        "Imus Grandstand",
      ],
    },
    date: { type: String, required: true }, // YYYY-MM-DD
    time: { type: String, required: true }, // HH:MM
    urgency: { type: String, enum: ["urgent", "regular"], default: "regular" },

    ledTv: { type: Boolean, default: false },
    itEquipment: [{ type: String }],
    fmoEquipment: [{ type: String }],
    extras: [{ type: String }],

    stage: {
      type: String,
      enum: [
        "submitted",
        "dept_head",
        "fmo_review",
        "president_approval",
        "osa",
        "security",
        "it_office",
        "approved",
        "rejected",
      ],
      default: "submitted",
    },

    logs: [logSchema],
  },
  { timestamps: true }
);

// Speeds up the LED TV availability check (date + ledTv lookups).
requestSchema.index({ date: 1, ledTv: 1, stage: 1 });

export default mongoose.model("Request", requestSchema);
