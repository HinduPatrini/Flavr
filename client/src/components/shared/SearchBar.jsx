import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import useDebounce from "../../hooks/useDebounce";
import API from "../../api/axios";

const SearchBar = ({ placeholder = "Search recipes, ingredients..." }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const debouncedQuery = useDebounce(query, 300);

  // Close suggestions on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedQuery.trim().length < 2) {
        setSuggestions([]);
        return;
      }
      setIsLoading(true);
      try {
        const response = await API.get("/recipes/suggestions", {
          params: { query: debouncedQuery },
        });
        setSuggestions(response.data || []);
        setIsOpen(true);
      } catch (err) {
        console.error("Failed to fetch suggestions:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSuggestions();
  }, [debouncedQuery]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setIsOpen(false);
      navigate(`/search?query=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleSuggestionClick = (title) => {
    setQuery(title);
    setIsOpen(false);
    navigate(`/search?query=${encodeURIComponent(title)}`);
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-lg">
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          placeholder={placeholder}
          className="w-full h-11 pl-11 pr-10 rounded-full border border-orange-500 bg-white dark:bg-stone-950 text-stone-800 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm font-medium"
        />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 dark:text-stone-500" />
        
        {isLoading && (
          <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 dark:text-stone-500 animate-spin" />
        )}
      </form>

      {/* Autocomplete Suggestions Dropdown */}
      <AnimatePresence>
        {isOpen && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 left-0 right-0 mt-2 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-xl overflow-hidden"
          >
            <ul className="py-2">
              {suggestions.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => handleSuggestionClick(item.title)}
                    className="w-full text-left px-5 py-3 hover:bg-orange-50 dark:hover:bg-stone-800/60 text-stone-700 dark:text-stone-200 text-sm font-semibold flex items-center gap-3 transition-colors"
                  >
                    <Search className="w-3.5 h-3.5 text-stone-400 dark:text-stone-500" />
                    <span>{item.title}</span>
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;
