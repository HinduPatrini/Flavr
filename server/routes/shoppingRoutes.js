const express = require("express");
const router = express.Router();
const {
  getShoppingList,
  addItems,
  toggleItem,
  clearList,
} = require("../controllers/shoppingListController");
const { protect } = require("../middleware/authMiddleware");

router.get("/",                protect, getShoppingList);
router.post("/add",            protect, addItems);
router.patch("/check/:itemId", protect, toggleItem);
router.delete("/clear",        protect, clearList);

module.exports = router;