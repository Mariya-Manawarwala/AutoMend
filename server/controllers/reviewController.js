import Review from "../models/Review.js";
import RepairJob from "../models/RepairJob.js";
import { notifyAdmins } from "../utils/adminNotifier.js";

export const submitReview = async (req, res) => {
  const {
    jobId,
    garageRating,
    garageComment,
    mechanicRating,
    mechanicComment,
  } = req.body;
  const job = await RepairJob.findById(jobId);

  if (
    !job ||
    job.customerId.toString() !== req.user._id.toString() ||
    job.jobStatus !== "Completed"
  ) {
    res.status(400);
    throw new Error("Invalid job or not completed");
  }

  const existingReview = await Review.findOne({ jobId });
  if (existingReview) {
    res.status(400);
    throw new Error("Review already submitted");
  }

  const review = await Review.create({
    customerId: req.user._id,
    mechanicId: job.mechanicId,
    jobId,
    garageRating,
    garageComment,
    mechanicRating,
    mechanicComment,
  });

  await notifyAdmins(`New review submitted by ${req.user.name}`, "new_review", { reviewId: review._id });

  res.status(201).json(review);
};

export const getGarageReviews = async (req, res) => {
  const reviews = await Review.find({})
    .populate("customerId", "name")
    .sort({ createdAt: -1 });
  const avgRating = reviews.length
    ? (
        reviews.reduce((s, r) => s + r.garageRating, 0) / reviews.length
      ).toFixed(1)
    : 0;
  res.json({
    averageRating: Number(avgRating),
    totalReviews: reviews.length,
    reviews,
  });
};

export const getMechanicReviews = async (req, res) => {
  const reviews = await Review.find({ mechanicId: req.params.mechanicId })
    .populate("customerId", "name")
    .sort({ createdAt: -1 });
  const avgRating = reviews.length
    ? (
        reviews.reduce((s, r) => s + r.mechanicRating, 0) / reviews.length
      ).toFixed(1)
    : 0;
  res.json({
    averageRating: Number(avgRating),
    totalReviews: reviews.length,
    reviews,
  });
};

export const getAllReviews = async (req, res) => {
  const reviews = await Review.find({})
    .populate("customerId")
    .populate("mechanicId")
    .populate("jobId")
    .sort({ createdAt: -1 });
  res.json(reviews);
};

export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }
    // Allow deletion if the user is an admin OR the customer who created it
    if (req.user.role === "admin" || review.customerId.toString() === req.user._id.toString()) {
      const { target } = req.query; // 'garage' or 'mechanic'

      if (target === "garage") {
        review.garageComment = "";
        review.garageRating = 0;
      } else if (target === "mechanic") {
        review.mechanicComment = "";
        review.mechanicRating = 0;
      } else {
        // If no target query parameter is provided, clear/delete the whole document
        await Review.findByIdAndDelete(req.params.id);
        return res.json({ success: true, message: "Review deleted completely" });
      }

      // If after deletion both reviews are reset/empty, delete the whole document
      const isGarageEmpty = !review.garageComment || review.garageComment.trim() === "" || review.garageRating === 0;
      const isMechanicEmpty = !review.mechanicComment || review.mechanicComment.trim() === "" || review.mechanicRating === 0;

      if (isGarageEmpty && isMechanicEmpty) {
        await Review.findByIdAndDelete(req.params.id);
        return res.json({ success: true, message: "Review deleted completely" });
      } else {
        await review.save();
        return res.json({ success: true, message: `${target} review portion cleared successfully` });
      }
    } else {
      return res.status(403).json({ success: false, message: "Unauthorized to delete this review" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
