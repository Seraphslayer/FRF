import { Router } from "express";
import { protect, authorize } from "../middleware/auth.js";
import {
  createRequest,
  getMyRequests,
  getPendingForReview,
  getAllRequests,
  updateRequest,
  advanceStage,
  addLog,
  deleteRequest,
  checkLedTvAvailability,
  getStageFlowPreview,
} from "../controllers/requestController.js";

const router = Router();

router.use(protect);

// LED TV availability + stage flow preview — any logged-in role can check these
// while filling out or reviewing a request.
router.get("/led-tv-availability", checkLedTvAvailability);
router.get("/stage-flow", getStageFlowPreview);

// Requestor
router.post("/", authorize("requestor"), createRequest);
router.get("/mine", authorize("requestor"), getMyRequests);

// Department Head
router.get("/pending", authorize("dept_head", "super_user"), getPendingForReview);

// Admin + Super User
router.get("/", authorize("admin", "super_user"), getAllRequests);
router.patch("/:id", authorize("admin", "super_user"), updateRequest);
router.post("/:id/advance", authorize("dept_head", "admin", "super_user"), advanceStage);

// Super User only
router.post("/:id/logs", authorize("super_user"), addLog);
router.delete("/:id", authorize("super_user"), deleteRequest);

export default router;
