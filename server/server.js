const dotenv = require("dotenv");
dotenv.config();                    // ← must be first

const express = require("express");
const cors = require("cors");
const passport = require("passport");
const connectDB = require("./config/db");
require("./config/passport");       // ← now .env is loaded before this runs

connectDB();

const app = express();

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    // Allow any localhost or 127.0.0.1 origin on any port
    if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
      return callback(null, true);
    }
    // Allow deployed CLIENT_URL (exact match or wildcard subdomain)
    if (process.env.CLIENT_URL && origin === process.env.CLIENT_URL) {
      return callback(null, true);
    }
    console.warn("CORS blocked origin:", origin, "| Expected CLIENT_URL:", process.env.CLIENT_URL);
    return callback(new Error("Not allowed by CORS"), false);
  },
  credentials: true
}));
app.use(express.json());
app.use(passport.initialize());

app.use("/api/auth",     require("./routes/authRoutes"));
app.use("/api/recipes",  require("./routes/recipeRoutes"));
app.use("/api/mealplan", require("./routes/mealPlanRoutes"));
app.use("/api/reviews",  require("./routes/reviewRoutes"));
app.use("/api/shopping", require("./routes/shoppingRoutes"));
app.use("/api/ai",       require("./routes/aiRoutes"));

app.get("/", (req, res) => {
  res.json({ message: "Flavr API is running!" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));