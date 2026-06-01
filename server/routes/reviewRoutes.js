const express = require("express");
const router = express.Router();
const {
  getReviews,
  addReview,
  deleteReview,
  getUserReviewsCount,
} = require("../controllers/reviewController");
const { protect } = require("../middleware/authMiddleware");

router.get("/user/count", protect, getUserReviewsCount);
router.get("/:recipeId",    getReviews);
router.post("/:recipeId",   protect, addReview);
router.delete("/:reviewId", protect, deleteReview);

module.exports = router;