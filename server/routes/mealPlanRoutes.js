const express = require("express");
const router = express.Router();
const {
  getMealPlan,
  updateMealPlan,
  clearMealPlan,
} = require("../controllers/mealPlanController");
const { protect } = require("../middleware/authMiddleware");

router.get("/",    protect, getMealPlan);
router.put("/",    protect, updateMealPlan);
router.delete("/", protect, clearMealPlan);

module.exports = router;