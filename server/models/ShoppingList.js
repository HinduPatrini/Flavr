const mongoose = require("mongoose");

const shoppingListSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        name: { type: String, required: true },
        amount: { type: String, default: "" },
        unit: { type: String, default: "" },
        checked: { type: Boolean, default: false },
        recipeName: { type: String, default: "" },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("ShoppingList", shoppingListSchema);