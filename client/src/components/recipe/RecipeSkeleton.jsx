import React from "react";
import { Skeleton } from "../ui/skeleton";

export const RecipeCardSkeleton = () => {
  return (
    <div className="overflow-hidden rounded-2xl border border-stone-100 dark:border-stone-850 bg-white dark:bg-stone-900 p-0 flex flex-col justify-between h-[360px]">
      {/* Image skeleton */}
      <Skeleton className="aspect-video w-full bg-stone-200 dark:bg-stone-800 rounded-t-2xl rounded-b-none" />
      
      {/* Body skeleton */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div className="space-y-3">
          {/* Subtitle tag */}
          <Skeleton className="h-3 w-1/4 bg-stone-200 dark:bg-stone-800 rounded-full" />
          {/* Title lines */}
          <Skeleton className="h-5 w-full bg-stone-200 dark:bg-stone-800 rounded-full" />
          <Skeleton className="h-5 w-4/5 bg-stone-200 dark:bg-stone-800 rounded-full" />
        </div>

        {/* Footer badges */}
        <div className="flex items-center gap-4 border-t border-stone-100 dark:border-stone-850 pt-4 mt-auto">
          <Skeleton className="h-4 w-16 bg-stone-200 dark:bg-stone-800 rounded-full" />
          <Skeleton className="h-4 w-16 bg-stone-200 dark:bg-stone-800 rounded-full" />
          <Skeleton className="h-4 w-12 bg-stone-200 dark:bg-stone-800 rounded-full ml-auto" />
        </div>
      </div>
    </div>
  );
};

export const RecipeGridSkeleton = ({ count = 8 }) => {
  const items = Array.from({ length: count });
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {items.map((_, i) => (
        <RecipeCardSkeleton key={i} />
      ))}
    </div>
  );
};

export const RecipeDetailSkeleton = () => {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Large Image Banner */}
      <Skeleton className="w-full h-80 md:h-[450px] bg-stone-200 dark:bg-stone-800 rounded-3xl" />

      {/* Main Info */}
      <div className="max-w-4xl mx-auto space-y-6 px-4">
        <div className="space-y-4">
          <Skeleton className="h-10 w-2/3 bg-stone-200 dark:bg-stone-800 rounded-full" />
          <div className="flex gap-3">
            <Skeleton className="h-5 w-24 bg-stone-200 dark:bg-stone-800 rounded-full" />
            <Skeleton className="h-5 w-32 bg-stone-200 dark:bg-stone-800 rounded-full" />
          </div>
        </div>

        {/* Badges bar */}
        <div className="flex gap-4 border-y border-stone-100 dark:border-stone-850 py-5">
          <Skeleton className="h-12 w-28 bg-stone-200 dark:bg-stone-800 rounded-2xl" />
          <Skeleton className="h-12 w-28 bg-stone-200 dark:bg-stone-800 rounded-2xl" />
          <Skeleton className="h-12 w-28 bg-stone-200 dark:bg-stone-800 rounded-2xl" />
        </div>

        {/* Two column grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
          {/* Ingredients list (2 cols) */}
          <div className="md:col-span-2 space-y-4">
            <Skeleton className="h-6 w-36 bg-stone-200 dark:bg-stone-800 rounded-full" />
            <div className="space-y-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-5 w-full bg-stone-200 dark:bg-stone-800 rounded-full" />
              ))}
            </div>
          </div>

          {/* Sidebar facts */}
          <div className="space-y-4">
            <Skeleton className="h-6 w-32 bg-stone-200 dark:bg-stone-800 rounded-full" />
            <Skeleton className="h-44 w-full bg-stone-200 dark:bg-stone-800 rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeGridSkeleton;
