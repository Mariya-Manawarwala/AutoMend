import express from "express";
import {
  addService,
  getAllServices,
  updateService,
  deleteService,
} from "../controllers/serviceController.js";
import { protect, forAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, forAdmin, addService);
router.get("/", getAllServices);
router.put("/:id", protect, forAdmin, updateService);
router.delete("/:id", protect, forAdmin, deleteService);

export default router;
