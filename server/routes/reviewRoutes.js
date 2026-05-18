import express from "express";
import {
  submitReview,
  getGarageReviews,
  getMechanicReviews,
  getAllReviews,
  deleteReview,
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
router.delete("/:id", protect, deleteReview);

export default router;
