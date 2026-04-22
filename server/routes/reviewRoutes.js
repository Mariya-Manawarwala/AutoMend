import express from "express";
import {
  submitReview,
  getGarageReviews,
  getMechanicReviews,
  getAllReviews,
} from "../controllers/reviewController.js";
import {
  protect,
  forCustomer,
  forAdmin,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, forCustomer, submitReview);
router.get("/garage", getGarageReviews);
router.get("/mechanic/:mechanicId", getMechanicReviews);

router.get("/admin", protect, forAdmin, getAllReviews);

export default router;
