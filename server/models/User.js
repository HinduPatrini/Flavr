const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      default: "",
    },
    googleId: {
      type: String,
      default: "",
    },
    avatar: {
      type: String,
      default: "",
    },
    savedRecipes: [{ type: String }],
    recentlyViewed: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);