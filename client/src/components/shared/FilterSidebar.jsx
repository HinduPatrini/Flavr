import React from "react";
import { SlidersHorizontal, RotateCcw } from "lucide-react";
import { Button } from "../ui/button";

const FilterSidebar = ({ filters, onFilterChange, onReset }) => {
  const diets = [
    { value: "", label: "Any Diet" },
    { value: "vegetarian", label: "Vegetarian" },
    { value: "vegan", label: "Vegan" },
    { value: "gluten free", label: "Gluten-Free" },
    { value: "ketogenic", label: "Ketogenic" },
    { value: "nonveg", label: "Non-Vegetarian" },
  ];

  const cuisines = [
    { value: "", label: "Any Cuisine" },
    { value: "indian", label: "Indian" },
    { value: "italian", label: "Italian" },
    { value: "chinese", label: "Chinese" },
    { value: "mexican", label: "Mexican" },
    { value: "american", label: "American" },
  ];

  const mealTypes = [
    { value: "", label: "Any Meal Type" },
    { value: "breakfast", label: "Breakfast" },
    { value: "lunch", label: "Lunch" },
    { value: "dinner", label: "Dinner" },
    { value: "dessert", label: "Dessert" },
    { value: "appetizer", label: "Appetizer" },
    { value: "salad", label: "Salad" },
  ];

  const sortOptions = [
    { value: "popularity", label: "Popularity" },
    { value: "healthiness", label: "Healthiness" },
    { value: "price", label: "Price" },
    { value: "time", label: "Cook Time" },
  ];

  const handleChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value, page: 1 });
  };

  return (
    <div className="w-full bg-white dark:bg-stone-900 border border-orange-100 dark:border-stone-850 rounded-2xl p-6 space-y-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-stone-100 dark:border-stone-850">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4.5 h-4.5 text-orange-500" />
          <h3 className="font-extrabold text-stone-850 dark:text-white">Filters</h3>
        </div>
        <button
          onClick={onReset}
          className="text-xs font-bold text-stone-400 dark:text-stone-555 hover:text-orange-500 flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Sort By */}
      <div className="space-y-2.5">
        <label className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
          Sort By
        </label>
        <select
          value={filters.sort || "popularity"}
          onChange={(e) => handleChange("sort", e.target.value)}
          className="w-full h-10 px-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-orange-50/30 dark:bg-stone-950 text-stone-800 dark:text-stone-100 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all cursor-pointer"
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Diet Filter */}
      <div className="space-y-2.5">
        <label className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
          Diet
        </label>
        <div className="space-y-2">
          {diets.map((diet) => (
            <label
              key={diet.value}
              className="flex items-center gap-3 cursor-pointer text-sm font-semibold text-stone-600 dark:text-stone-300 hover:text-orange-500 transition-colors select-none"
            >
              <input
                type="radio"
                name="diet"
                checked={(filters.diet || "") === diet.value}
                onChange={() => handleChange("diet", diet.value)}
                className="w-4 h-4 rounded-full accent-orange-500 border-stone-300 text-orange-500 focus:ring-orange-500 focus:ring-offset-0 focus:ring-0"
              />
              <span>{diet.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Cuisine Filter */}
      <div className="space-y-2.5">
        <label className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
          Cuisine
        </label>
        <div className="space-y-2">
          {cuisines.map((cuisine) => (
            <label
              key={cuisine.value}
              className="flex items-center gap-3 cursor-pointer text-sm font-semibold text-stone-600 dark:text-stone-300 hover:text-orange-500 transition-colors select-none"
            >
              <input
                type="radio"
                name="cuisine"
                checked={(filters.cuisine || "") === cuisine.value}
                onChange={() => handleChange("cuisine", cuisine.value)}
                className="w-4 h-4 rounded-full accent-orange-500 border-stone-300 text-orange-500 focus:ring-orange-500"
              />
              <span>{cuisine.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Meal Type Filter */}
      <div className="space-y-2.5">
        <label className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
          Meal Type
        </label>
        <div className="space-y-2">
          {mealTypes.map((type) => (
            <label
              key={type.value}
              className="flex items-center gap-3 cursor-pointer text-sm font-semibold text-stone-600 dark:text-stone-300 hover:text-orange-500 transition-colors select-none"
            >
              <input
                type="radio"
                name="mealType"
                checked={(filters.type || "") === type.value}
                onChange={() => handleChange("type", type.value)}
                className="w-4 h-4 rounded-full accent-orange-500 border-stone-300 text-orange-500 focus:ring-orange-500"
              />
              <span>{type.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
