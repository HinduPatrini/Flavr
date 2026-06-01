import React, { useState } from "react";
import { FaStar } from "react-icons/fa";

const StarRating = ({ rating = 0, onChange, interactive = false, size = 18 }) => {
  const [hoverRating, setHoverRating] = useState(0);

  const handleClick = (value) => {
    if (interactive && onChange) {
      onChange(value);
    }
  };

  const handleMouseEnter = (value) => {
    if (interactive) {
      setHoverRating(value);
    }
  };

  const handleMouseLeave = () => {
    if (interactive) {
      setHoverRating(0);
    }
  };

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((value) => {
        const activeRating = hoverRating || rating;
        const filled = value <= activeRating;

        return (
          <FaStar
            key={value}
            size={size}
            onClick={() => handleClick(value)}
            onMouseEnter={() => handleMouseEnter(value)}
            onMouseLeave={handleMouseLeave}
            className={`transition-colors duration-150 ${
              interactive ? "cursor-pointer" : ""
            } ${
              filled
                ? "text-orange-500 fill-orange-500"
                : "text-stone-200 dark:text-stone-850"
            }`}
          />
        );
      })}
    </div>
  );
};

export default StarRating;
