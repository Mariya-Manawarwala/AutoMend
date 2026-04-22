import express from "express";
import {
  getCustomerHistory,
  getMechanicHistory,
  getAdminHistory,
} from "../controllers/historyController.js";
import {
  protect,
  forCustomer,
  forMechanic,
  forAdmin,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/customer", protect, forCustomer, getCustomerHistory);
router.get("/mechanic", protect, forMechanic, getMechanicHistory);
router.get("/admin", protect, forAdmin, getAdminHistory);

export default router;
