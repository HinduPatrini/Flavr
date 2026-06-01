const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const { register, login, getMe, updateProfile } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

const upload = multer({ storage: multer.memoryStorage() });

router.post("/register", upload.single("avatar"), register);
router.post("/login", login);
router.get("/me", protect, getMe);
router.put("/profile", protect, upload.single("avatar"), updateProfile);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  (req, res, next) => {
    const clientUrl = (process.env.CLIENT_URL || "https://flavr-seven.vercel.app").trim().replace(/\/$/, "");
    passport.authenticate("google", {
      session: false,
      failureRedirect: `${clientUrl}/login?error=google_failed`,
    })(req, res, next);
  },
  (req, res) => {
    const clientUrl = (process.env.CLIENT_URL || "https://flavr-seven.vercel.app").trim().replace(/\/$/, "");
    const token = jwt.sign(
      { id: req.user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.redirect(`${clientUrl}/auth/callback?token=${token}`);
  }
);

module.exports = router;