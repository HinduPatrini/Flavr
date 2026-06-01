import React from "react";
import { motion } from "framer-motion";

const CategoryPills = ({ selected, onChange }) => {
  const categories = [
    { value: "", label: "All Recipes" },
    { value: "breakfast", label: "Breakfast" },
    { value: "lunch", label: "Lunch" },
    { value: "dinner", label: "Dinner" },
    { value: "dessert", label: "Dessert" },
    { value: "vegetarian", label: "Vegetarian" },
    { value: "vegan", label: "Vegan" },
    { value: "nonveg", label: "Non-Veg" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -15 },
    show: { 
      opacity: 1, 
      x: 0,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 15,
      }
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2 -mx-4 px-4 select-none"
    >
      {categories.map((cat) => {
        const isSelected = selected === cat.value;
        return (
          <motion.button
            key={cat.label}
            variants={itemVariants}
            whileTap={{ scale: 0.95 }}
            onClick={() => onChange(cat.value)}
            className={`flex-shrink-0 px-5 py-2.5 rounded-full font-bold text-xs tracking-wide uppercase transition-all ${
              isSelected
                ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
                : "bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-300 border border-orange-100 dark:border-stone-850 hover:bg-orange-50/50 dark:hover:bg-stone-850"
            }`}
          >
            {cat.label}
          </motion.button>
        );
      })}
    </motion.div>
  );
};

export default CategoryPills;
