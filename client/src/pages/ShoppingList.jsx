import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Trash2, Plus, Sparkles, CheckSquare, Square } from "lucide-react";
import toast from "react-hot-toast";
import { fetchShoppingList, addShoppingItems, toggleShoppingItem, clearShoppingList } from "../store/shoppingSlice";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

const ShoppingList = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { items, isLoading, error } = useSelector((state) => state.shopping);

  // Custom manual item form state
  const [customName, setCustomName] = useState("");
  const [customAmount, setCustomAmount] = useState("");
  const [customUnit, setCustomUnit] = useState("");

  // Load items on mount
  useEffect(() => {
    if (token) {
      dispatch(fetchShoppingList());
    }
  }, [dispatch, token]);

  const handleToggleItem = (itemId) => {
    dispatch(toggleShoppingItem(itemId))
      .unwrap()
      .catch(() => {
        toast.error("Failed to update item");
      });
  };

  const handleAddCustomItem = (e) => {
    e.preventDefault();
    if (!customName.trim()) {
      toast.error("Please specify an ingredient name");
      return;
    }

    const newItem = {
      name: customName.trim(),
      amount: customAmount.trim() || "1",
      unit: customUnit.trim() || "",
      checked: false,
      recipeName: "", // Empty signifies Custom manual item
    };

    dispatch(addShoppingItems([newItem]))
      .unwrap()
      .then(() => {
        toast.success("Ingredient added!");
        setCustomName("");
        setCustomAmount("");
        setCustomUnit("");
      })
      .catch(() => {
        toast.error("Failed to add custom ingredient");
      });
  };

  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to clear your shopping list?")) {
      dispatch(clearShoppingList())
        .unwrap()
        .then(() => {
          toast.success("Shopping list cleared!");
        })
        .catch(() => {
          toast.error("Failed to clear shopping list");
        });
    }
  };

  // Group items by recipe
  const getGroupedItems = () => {
    if (!items || items.length === 0) return {};
    return items.reduce((groups, item) => {
      const recipe = item.recipeName || "Custom Items";
      if (!groups[recipe]) {
        groups[recipe] = [];
      }
      groups[recipe].push(item);
      return groups;
    }, {});
  };

  const grouped = getGroupedItems();
  const hasItems = items && items.length > 0;

  // If not authenticated, render blurred placeholder (handled globally)
  if (!token) {
    return (
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[70vh] filter blur-[3px] pointer-events-none select-none">
        <h2 className="text-xl font-bold">Please login to view your shopping list</h2>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="container mx-auto px-4 py-8 space-y-8 min-h-screen pb-20"
    >
      {/* Header toolbar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-orange-50/40 dark:bg-stone-900/40 border border-orange-100 dark:border-stone-850 p-6 rounded-3xl">
        <div>
          <h1 className="text-2xl font-black text-stone-850 dark:text-white flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-orange-500" />
            <span>Shopping List</span>
          </h1>
          <p className="text-xs font-bold text-stone-450 dark:text-stone-500 mt-1 uppercase tracking-wider">
            Tick off ingredients as you grab them in the kitchen
          </p>
        </div>

        {hasItems && (
          <Button
            onClick={handleClearAll}
            variant="outline"
            className="rounded-xl font-bold border-red-200 dark:border-red-950/20 text-red-650 hover:bg-red-50 dark:hover:bg-red-950/10 dark:text-red-400 bg-white dark:bg-stone-900"
          >
            Clear All Items
          </Button>
        )}
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Manual Form */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-stone-900 border border-orange-100 dark:border-stone-850 p-6 rounded-3xl shadow-sm space-y-4">
            <h3 className="text-base font-black text-stone-850 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4.5 h-4.5 text-orange-500 fill-orange-500/10" />
              <span>Add Custom Ingredient</span>
            </h3>

            <form onSubmit={handleAddCustomItem} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                  Item Name
                </label>
                <Input
                  type="text"
                  placeholder="e.g. Fresh Cilantro"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="rounded-xl border-stone-300 dark:border-stone-800 bg-orange-50/10 focus-visible:ring-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                    Amount
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g. 2"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    className="rounded-xl border-stone-300 dark:border-stone-800 bg-orange-50/10 focus-visible:ring-orange-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                    Unit
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g. bunches"
                    value={customUnit}
                    onChange={(e) => setCustomUnit(e.target.value)}
                    className="rounded-xl border-stone-300 dark:border-stone-800 bg-orange-50/10 focus-visible:ring-orange-500"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold h-11 flex items-center justify-center gap-2 active:scale-95 transition-transform"
              >
                <Plus className="w-4.5 h-4.5" />
                <span>Add to List</span>
              </Button>
            </form>
          </div>
        </div>

        {/* Right Columns: Checklist grouped by Recipes */}
        <div className="lg:col-span-2">
          {isLoading && items.length === 0 ? (
            <div className="flex justify-center items-center py-20">
              <svg className="animate-spin h-7 w-7 text-orange-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
          ) : !hasItems ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-20 bg-white dark:bg-stone-900 border border-orange-100 dark:border-stone-850 rounded-3xl text-center px-6 shadow-sm"
            >
              <div className="w-16 h-16 bg-orange-50 dark:bg-stone-955 rounded-full flex items-center justify-center text-orange-500 mb-6">
                <ShoppingBag className="w-8 h-8 text-orange-500 fill-orange-500/10" />
              </div>
              <h3 className="text-xl font-extrabold text-stone-850 dark:text-stone-150">
                Your shopping list is empty
              </h3>
              <p className="text-sm text-stone-450 dark:text-stone-500 mt-2 max-w-xs mx-auto">
                No items in your checklist. Add ingredients directly from recipe pages, or input custom items using the form.
              </p>
            </motion.div>
          ) : (
            <div className="space-y-6">
              {Object.keys(grouped).map((recipeName) => (
                <div
                  key={recipeName}
                  className="bg-white dark:bg-stone-900 border border-orange-100 dark:border-stone-850 rounded-3xl p-6 shadow-sm space-y-4"
                >
                  {/* Group Header */}
                  <h4 className="text-sm font-black text-orange-500 uppercase tracking-wider border-b border-stone-100 dark:border-stone-850 pb-2">
                    {recipeName}
                  </h4>

                  {/* Checklist Items */}
                  <div className="space-y-1">
                    <AnimatePresence initial={false}>
                      {grouped[recipeName].map((item) => (
                        <motion.div
                          key={item._id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ type: "spring", stiffness: 200, damping: 18 }}
                          onClick={() => handleToggleItem(item._id)}
                          className={`flex items-start gap-3 py-3 px-2 rounded-xl cursor-pointer select-none transition-colors ${
                            item.checked
                              ? "bg-stone-50/40 dark:bg-stone-950/20 text-stone-400 dark:text-stone-600"
                              : "hover:bg-orange-50/30 dark:hover:bg-stone-850/30 text-stone-750 dark:text-stone-250"
                          }`}
                        >
                          <button type="button" className="mt-0.5 text-orange-500 flex-shrink-0">
                            {item.checked ? (
                              <CheckSquare className="w-5 h-5 fill-orange-500 text-white dark:fill-orange-600" />
                            ) : (
                              <Square className="w-5 h-5 text-stone-300 dark:text-stone-700" />
                            )}
                          </button>

                          <div className="flex-1 text-sm font-semibold flex items-center justify-between">
                            <span className={item.checked ? "line-through font-medium" : ""}>
                              {item.name}
                            </span>
                            <span className={`text-xs font-bold ${item.checked ? "text-stone-400/80" : "text-stone-450"}`}>
                              {item.amount} {item.unit}
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ShoppingList;
