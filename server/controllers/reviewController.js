const Review = require("../models/Review");

// GET /api/reviews/:recipeId
const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ recipeId: req.params.recipeId })
      .populate("user", "name avatar")
      .sort({ createdAt: -1 });

    const avgRating =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

    res.json({ reviews, avgRating: avgRating.toFixed(1) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/reviews/:recipeId  (protected)
const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const existing = await Review.findOne({
      user: req.user._id,
      recipeId: req.params.recipeId,
    });

    if (existing)
      return res
        .status(400)
        .json({ message: "You already reviewed this recipe" });

    const review = await Review.create({
      user: req.user._id,
      recipeId: req.params.recipeId,
      rating,
      comment,
    });

    const populated = await review.populate("user", "name avatar");
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/reviews/:reviewId  (protected)
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);

    if (!review)
      return res.status(404).json({ message: "Review not found" });

    if (review.user.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not authorized" });

    await review.deleteOne();
    res.json({ message: "Review deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/reviews/user/count (protected)
const getUserReviewsCount = async (req, res) => {
  try {
    const count = await Review.countDocuments({ user: req.user._id });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getReviews, addReview, deleteReview, getUserReviewsCount };