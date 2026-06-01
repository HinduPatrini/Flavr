const ShoppingList = require("../models/ShoppingList");

// GET /api/shopping
const getShoppingList = async (req, res) => {
  try {
    let list = await ShoppingList.findOne({ user: req.user._id });
    if (!list) {
      list = await ShoppingList.create({ user: req.user._id, items: [] });
    }
    res.json(list);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/shopping/add
const addItems = async (req, res) => {
  try {
    const { items } = req.body;

    let list = await ShoppingList.findOne({ user: req.user._id });
    if (!list) {
      list = await ShoppingList.create({ user: req.user._id, items: [] });
    }

    list.items.push(...items);
    await list.save();
    res.json(list);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PATCH /api/shopping/check/:itemId
const toggleItem = async (req, res) => {
  try {
    const list = await ShoppingList.findOne({ user: req.user._id });
    const item = list.items.id(req.params.itemId);

    if (!item)
      return res.status(404).json({ message: "Item not found" });

    item.checked = !item.checked;
    await list.save();
    res.json(list);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/shopping/clear
const clearList = async (req, res) => {
  try {
    await ShoppingList.findOneAndDelete({ user: req.user._id });
    res.json({ message: "Shopping list cleared" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getShoppingList, addItems, toggleItem, clearList };