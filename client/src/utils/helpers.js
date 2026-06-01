/**
 * Utility helper functions for Flavr Recipe Finder
 */

/**
 * Formats cooking time from minutes into a user-friendly string (e.g. "1 hr 15 min" or "45 min").
 * @param {number} minutes 
 * @returns {string}
 */
export const formatTime = (minutes) => {
  if (!minutes || isNaN(minutes)) return "N/A";
  if (minutes < 60) return `${minutes} min`;
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hrs} hr ${mins} min` : `${hrs} hr`;
};

/**
 * Truncates text to a specified length and appends ellipses.
 * @param {string} text 
 * @param {number} maxLength 
 * @returns {string}
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
};

/**
 * Sanitizes HTML strings (strips tags or decodes basic entities).
 * @param {string} html 
 * @returns {string}
 */
export const stripHtml = (html) => {
  if (!html) return "";
  return html.replace(/<\/?[^>]+(>|$)/g, "");
};

/**
 * Get image URL for Spoonacular recipe similar item if only an ID is given.
 * @param {string|number} id 
 * @param {string} size 
 * @param {string} type 
 * @returns {string}
 */
export const getSpoonacularRecipeImage = (id, size = "556x370", type = "jpg") => {
  if (!id) return "";
  return `https://spoonacular.com/recipeImages/${id}-${size}.${type}`;
};
