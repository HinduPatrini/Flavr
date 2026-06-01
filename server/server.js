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
    // Allow any localhost origin (any port)
    if (/^https?:\/\/localhost(:\d+)?$/.test(origin)) {
      return callback(null, true);
    }
    if (origin === process.env.CLIENT_URL) {
      return callback(null, true);
    }
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