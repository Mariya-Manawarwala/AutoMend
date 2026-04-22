import Review from "../models/Review.js";
import RepairJob from "../models/RepairJob.js";

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
