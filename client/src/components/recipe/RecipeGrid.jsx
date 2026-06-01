import React from "react";
import { motion } from "framer-motion";
import RecipeCard from "./RecipeCard";

const RecipeGrid = ({ recipes }) => {
  if (!recipes || recipes.length === 0) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-1"
    >
      {recipes.map((recipe, index) => (
        <motion.div key={recipe.id || index} variants={itemVariants}>
          <RecipeCard recipe={recipe} />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default RecipeGrid;
