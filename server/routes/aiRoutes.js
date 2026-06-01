const express = require("express");
const router = express.Router();
const { generateRecipe } = require("../controllers/aiController");
const { protect } = require("../middleware/authMiddleware");

router.post("/generate", protect, generateRecipe);

module.exports = router;