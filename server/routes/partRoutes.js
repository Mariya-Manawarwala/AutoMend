import express from "express";
import {
  addPart,
  getAllParts,
  updatePart,
  deletePart,
} from "../controllers/partController.js";
import { protect, forAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, forAdmin, addPart);
router.get("/", getAllParts);
router.put("/:id", protect, forAdmin, updatePart);
router.delete("/:id", protect, forAdmin, deletePart);

export default router;
