const mongoose = require("mongoose");

const mealPlanSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    week: [
      {
        day: {
          type: String,
          enum: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ],
        },
        meals: {
          breakfast: { type: String, default: "" },
          lunch: { type: String, default: "" },
          dinner: { type: String, default: "" },
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("MealPlan", mealPlanSchema);