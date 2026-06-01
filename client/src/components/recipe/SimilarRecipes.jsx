import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Clock, Users } from "lucide-react";
import { motion } from "framer-motion";
import API from "../../api/axios";
import { Skeleton } from "../ui/skeleton";

const SimilarRecipes = ({ recipeId }) => {
  const [similar, setSimilar] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSimilar = async () => {
      setIsLoading(true);
      try {
        const response = await API.get(`/recipes/${recipeId}/similar`);
        setSimilar(response.data || []);
      } catch (err) {
        console.error("Failed to load similar recipes", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (recipeId) {
      fetchSimilar();
    }
  }, [recipeId]);

  if (!isLoading && similar.length === 0) return null;

  return (
    <div className="space-y-6">
      <h3 className="text-xl md:text-2xl font-black text-stone-850 dark:text-white">
        You Might Also Like
      </h3>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-video w-full rounded-2xl bg-stone-200 dark:bg-stone-800" />
              <Skeleton className="h-4 w-3/4 rounded-full bg-stone-200 dark:bg-stone-800" />
            </div>
          ))}
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 100, damping: 18 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
        >
          {similar.slice(0, 4).map((item) => {
            // Construct Spoonacular recipe image URL
            const imageUrl = `https://spoonacular.com/recipeImages/${item.id}-556x370.${item.imageType || "jpg"}`;
            
            return (
              <Link
                key={item.id}
                to={`/recipe/${item.id}`}
                className="group block border border-orange-100 dark:border-stone-850 bg-white dark:bg-stone-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-orange-200 dark:hover:border-orange-500/20 transition-all"
              >
                <div className="relative aspect-video overflow-hidden bg-stone-150 dark:bg-stone-800">
                  <img
                    src={imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://images.unsplash.com/photo-1495521821757-a1efb6729352?q=80&w=640";
                    }}
                  />
                </div>
                <div className="p-4 space-y-2">
                  <h4 className="font-extrabold text-sm text-stone-800 dark:text-stone-200 group-hover:text-orange-500 transition-colors line-clamp-1">
                    {item.title}
                  </h4>
                  <div className="flex gap-3 text-xs font-semibold text-stone-500 dark:text-stone-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-orange-500" />
                      {item.readyInMinutes} m
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-orange-500" />
                      {item.servings} s
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </motion.div>
      )}
    </div>
  );
};

export default SimilarRecipes;
