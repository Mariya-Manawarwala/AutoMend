import express from "express";
import {
  addVehicle,
  getMyVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
} from "../controllers/vehicleController.js";
import { protect, forCustomer } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, forCustomer, addVehicle);
router.get("/my", protect, forCustomer, getMyVehicles);
router.get("/:id", protect, getVehicleById);
router.put("/:id", protect, forCustomer, updateVehicle);
router.delete("/:id", protect, forCustomer, deleteVehicle);

export default router;
