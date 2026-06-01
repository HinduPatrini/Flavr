const MealPlan = require("../models/MealPlan");

// GET /api/mealplan
const getMealPlan = async (req, res) => {
  try {
    let plan = await MealPlan.findOne({ user: req.user._id });
    if (!plan) {
      plan = await MealPlan.create({ user: req.user._id, week: [] });
    }
    res.json(plan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/mealplan
const updateMealPlan = async (req, res) => {
  try {
    const { day, mealType, recipeId } = req.body;

    let plan = await MealPlan.findOne({ user: req.user._id });
    if (!plan) {
      plan = await MealPlan.create({ user: req.user._id, week: [] });
    }

    const dayEntry = plan.week.find((d) => d.day === day);
    if (dayEntry) {
      dayEntry.meals[mealType] = recipeId;
    } else {
      plan.week.push({ day, meals: { [mealType]: recipeId } });
    }

    await plan.save();
    res.json(plan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/mealplan
const clearMealPlan = async (req, res) => {
  try {
    await MealPlan.findOneAndDelete({ user: req.user._id });
    res.json({ message: "Meal plan cleared" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getMealPlan, updateMealPlan, clearMealPlan };