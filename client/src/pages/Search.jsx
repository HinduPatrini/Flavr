import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, ArrowLeft, ArrowRight, Frown, Sparkles } from "lucide-react";
import { searchRecipesThunk } from "../store/recipeSlice";
import RecipeGrid from "../components/recipe/RecipeGrid";
import { RecipeGridSkeleton } from "../components/recipe/RecipeSkeleton";
import FilterSidebar from "../components/shared/FilterSidebar";
import SearchBar from "../components/shared/SearchBar";
import { Button } from "../components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../components/ui/sheet";

const Search = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  // Local state mirrored from URL parameters
  const query = searchParams.get("query") || "";
  const diet = searchParams.get("diet") || "";
  const cuisine = searchParams.get("cuisine") || "";
  const type = searchParams.get("type") || "";
  const sort = searchParams.get("sort") || "popularity";
  const page = parseInt(searchParams.get("page") || "1");

  const { searchResults, isLoading, error } = useSelector((state) => state.recipes);

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Trigger search fetch whenever search params change
  useEffect(() => {
    dispatch(
      searchRecipesThunk({
        query,
        diet,
        cuisine,
        type,
        sort,
        page,
      })
    );
  }, [dispatch, query, diet, cuisine, type, sort, page]);

  const updateFilters = (newFilters) => {
    const params = {};
    if (newFilters.query) params.query = newFilters.query;
    if (newFilters.diet) params.diet = newFilters.diet;
    if (newFilters.cuisine) params.cuisine = newFilters.cuisine;
    if (newFilters.type) params.type = newFilters.type;
    if (newFilters.sort) params.sort = newFilters.sort;
    if (newFilters.page && newFilters.page > 1) params.page = String(newFilters.page);

    setSearchParams(params);
  };

  const handleFilterChange = (updatedFilters) => {
    updateFilters({
      query,
      diet,
      cuisine,
      type,
      sort,
      ...updatedFilters,
    });
  };

  const handleResetFilters = () => {
    setSearchParams({ query });
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1) return;
    handleFilterChange({ page: newPage });
  };

  const currentFilters = { diet, cuisine, type, sort };
  const totalResults = searchResults.totalResults || 0;
  const resultsList = searchResults.results || [];
  const totalPages = Math.ceil(totalResults / 12) || 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="container mx-auto px-4 py-8 space-y-8 min-h-screen"
    >
      {/* Search Header Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-orange-50/40 dark:bg-stone-900/40 border border-orange-100 dark:border-stone-850 p-6 rounded-3xl">
        <div className="w-full md:w-auto">
          <h1 className="text-2xl font-black text-stone-850 dark:text-white flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-orange-500 fill-orange-500/10" />
            <span>Search Gourmet Recipes</span>
          </h1>
          <p className="text-xs font-bold text-stone-450 dark:text-stone-500 mt-1 uppercase tracking-wider">
            {totalResults > 0 ? `${totalResults} culinary matches found` : "Find your next meal"}
          </p>
        </div>
        <div className="w-full md:w-1/2 flex justify-end">
          <SearchBar />
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Column: Filter Sidebar (Desktop only) */}
        <div className="hidden lg:block lg:col-span-1">
          <FilterSidebar
            filters={currentFilters}
            onFilterChange={handleFilterChange}
            onReset={handleResetFilters}
          />
        </div>

        {/* Right Column: Results Grid and Controls */}
        <div className="lg:col-span-3 space-y-6">
          {/* Mobile Filter Trigger Toolbar */}
          <div className="lg:hidden flex items-center justify-between bg-white dark:bg-stone-900 border border-orange-100 dark:border-stone-850 p-4 rounded-2xl shadow-sm">
            <span className="text-sm font-extrabold text-stone-800 dark:text-stone-250">
              Matches: {totalResults}
            </span>
            <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  className="rounded-xl font-bold text-xs gap-2 border-orange-100 dark:border-stone-850 hover:bg-orange-50/50 text-stone-600 dark:text-stone-300 bg-white dark:bg-stone-950"
                >
                  <SlidersHorizontal className="w-4 h-4 text-orange-500" />
                  <span>Filters</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[85%] max-w-sm p-6 bg-orange-50 dark:bg-stone-950 border-r border-orange-100 dark:border-stone-850 overflow-y-auto">
                <SheetHeader className="mb-4">
                  <SheetTitle className="text-xl font-black text-stone-850 dark:text-white">
                    Refine Search
                  </SheetTitle>
                </SheetHeader>
                <FilterSidebar
                  filters={currentFilters}
                  onFilterChange={(f) => {
                    handleFilterChange(f);
                    setMobileFiltersOpen(false);
                  }}
                  onReset={() => {
                    handleResetFilters();
                    setMobileFiltersOpen(false);
                  }}
                />
              </SheetContent>
            </Sheet>
          </div>

          {/* Results Grid Loading / States */}
          {isLoading ? (
            <RecipeGridSkeleton count={9} />
          ) : error ? (
            <div className="text-center py-16 bg-red-50 dark:bg-red-950/15 rounded-3xl border border-red-100 dark:border-red-950/30">
              <p className="text-red-650 dark:text-red-400 font-semibold">{error}</p>
            </div>
          ) : resultsList.length === 0 ? (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center justify-center py-20 bg-white dark:bg-stone-900 border border-orange-100 dark:border-stone-850 rounded-3xl text-center px-6 shadow-sm"
            >
              <div className="w-16 h-16 bg-orange-50 dark:bg-stone-955 rounded-full flex items-center justify-center text-orange-500 mb-6">
                <Frown className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-extrabold text-stone-850 dark:text-stone-150">
                No matching recipes found
              </h3>
              <p className="text-sm text-stone-450 dark:text-stone-500 mt-2 max-w-md">
                We couldn't find any recipes for "{query}". Try checking your spelling or adjusting filters to expand your search.
              </p>
              <Button
                onClick={handleResetFilters}
                className="mt-6 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 shadow-md shadow-orange-500/10 active:scale-95 transition-transform"
              >
                Clear All Filters
              </Button>
            </motion.div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={query + diet + cuisine + type + sort + page}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="space-y-8"
              >
                {/* Grid */}
                <RecipeGrid recipes={resultsList} />

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 pt-6 border-t border-stone-100 dark:border-stone-850">
                    <Button
                      variant="outline"
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page === 1}
                      className="rounded-xl h-10 px-4 gap-1.5 border-orange-150 dark:border-stone-850 hover:bg-orange-50/50 text-stone-600 dark:text-stone-300 disabled:opacity-40"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span className="font-bold text-xs uppercase">Prev</span>
                    </Button>

                    <span className="text-sm font-bold text-stone-500 dark:text-stone-400 px-4">
                      Page {page} of {totalPages}
                    </span>

                    <Button
                      variant="outline"
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page === totalPages}
                      className="rounded-xl h-10 px-4 gap-1.5 border-orange-150 dark:border-stone-850 hover:bg-orange-50/50 text-stone-600 dark:text-stone-300 disabled:opacity-40"
                    >
                      <span className="font-bold text-xs uppercase">Next</span>
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Search;
