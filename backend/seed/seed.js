import dotenv from "dotenv";
import { connectDB } from "../config/db.js";
import User from "../models/User.js";
import Request from "../models/Request.js";
import mongoose from "mongoose";

dotenv.config();

const demoUsers = [
  { name: "Juan Dela Cruz", email: "requestor@ncst.edu.ph", password: "password123", role: "requestor", department: "BSCoE 32E1" },
  { name: "Engr. Dela Rosa", email: "depthead@ncst.edu.ph", password: "password123", role: "dept_head", department: "Engineering Department" },
  { name: "Ana Ramos", email: "admin@ncst.edu.ph", password: "password123", role: "admin", department: "OSA" },
  { name: "Mark Villanueva", email: "superuser@ncst.edu.ph", password: "password123", role: "super_user", department: "IT Office" },
];

async function run() {
  await connectDB();

  console.log("Clearing existing demo data...");
  await User.deleteMany({ email: { $in: demoUsers.map((u) => u.email) } });
  await Request.deleteMany({});

  console.log("Creating demo users (password for all: password123)...");
  const created = await User.create(demoUsers);
  const requestor = created.find((u) => u.role === "requestor");

  console.log("Creating sample requests...");
  await Request.create([
    {
      controlNumber: "2026-01001",
      requestor: requestor._id,
      requestorName: requestor.name,
      requestorType: "student",
      department: "BSCoE 32E1",
      contact: "0917 123 4567",
      email: requestor.email,
      eventName: "Freshmen Orientation",
      venue: "Gym",
      date: "2026-09-05",
      time: "08:00",
      urgency: "regular",
      ledTv: true,
      itEquipment: ["Sound system", "Microphone"],
      fmoEquipment: ["Tables", "Chairs"],
      extras: ["pcsa", "related"],
      stage: "approved",
      logs: [{ author: "Super User", note: "LED TV availability confirmed." }],
    },
    {
      controlNumber: "2026-01002",
      requestor: requestor._id,
      requestorName: requestor.name,
      requestorType: "employee",
      department: "ICES",
      contact: "0928 555 2211",
      email: requestor.email,
      eventName: "ICES General Assembly",
      venue: "Multipurpose Hall",
      date: "2026-09-12",
      time: "13:00",
      urgency: "regular",
      ledTv: true,
      itEquipment: ["Projector", "Laptop / PC"],
      fmoEquipment: ["Chairs", "Stage"],
      extras: [],
      stage: "president_approval",
      logs: [],
    },
    {
      controlNumber: "2026-01003",
      requestor: requestor._id,
      requestorName: requestor.name,
      requestorType: "student",
      department: "BSCoE 31E2",
      contact: "0906 888 7712",
      email: requestor.email,
      eventName: "Intramurals Opening",
      venue: "NCST Field",
      date: "2026-09-18",
      time: "07:30",
      urgency: "urgent",
      ledTv: false,
      itEquipment: ["Sound system"],
      fmoEquipment: ["Tent / canopy", "Generator set"],
      extras: ["related"],
      stage: "dept_head",
      logs: [],
    },
  ]);

  console.log("Done. Demo accounts:");
  demoUsers.forEach((u) => console.log(`  ${u.role.padEnd(11)} ${u.email} / password123`));

  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
