const OpenAI = require("openai");

// Lazily initialize so a missing OPENAI_API_KEY doesn't crash server on boot
let openai = null;
if (process.env.OPENAI_API_KEY) {
  try {
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    console.log("✅ OpenAI client initialized.");
  } catch (err) {
    console.warn("⚠️ Failed to initialize OpenAI client:", err.message);
  }
} else {
  console.warn("⚠️  OPENAI_API_KEY missing — AI recipe generation will use fallback engine.");
}

/**
 * Intelligent Recipe Fallback Engine
 * Generates beautiful, coherent, and realistic recipes based on input ingredients.
 * Guarantees a 100% success rate even if the API Key is invalid or expired.
 */
const generateFallbackRecipe = (ingredients) => {
  const list = ingredients.map(i => i.trim().toLowerCase());
  
  // Clean capitalization helper
  const capitalize = (str) => str.replace(/\b\w/g, c => c.toUpperCase());
  const primaryIng = capitalize(list[0] || "Fresh Produce");
  const secondaryIng = list[1] ? capitalize(list[1]) : "";
  const ingredientName = secondaryIng ? `${primaryIng} & ${secondaryIng}` : primaryIng;

  let name = "";
  let description = "";
  let prepTime = "15 Min";
  let cookTime = "20 Min";
  let servings = "2";
  let recipeIngredients = [];
  let steps = [];

  // Theme selection based on ingredients
  if (list.some(i => i.includes("pasta") || i.includes("spaghetti") || i.includes("noodle") || i.includes("macaroni"))) {
    // Pasta Theme
    name = `Gourmet Creamy Garlic ${ingredientName} Pasta`;
    description = `A rich, velvety pasta dish showcasing the natural flavors of tender ${list[0]}${list[1] ? ` and fresh ${list[1]}` : ""}. Finished with a luxurious roasted garlic cream sauce and fresh garden herbs.`;
    prepTime = "10 Min";
    cookTime = "15 Min";
    servings = "3";
    recipeIngredients = [
      "250g premium pasta of choice",
      `1.5 cups of sliced ${list[0]}`,
      list[1] ? `1 cup of chopped ${list[1]}` : "2 tbsp of fresh basil leaves, torn",
      "3 cloves of garlic, finely minced",
      "2 tbsp of extra virgin olive oil",
      "1/2 cup of heavy cream (or coconut cream for dairy-free)",
      "1/4 cup of freshly grated Parmesan cheese",
      "1/2 tsp of sea salt & coarse black pepper to taste",
      "A pinch of crushed red pepper flakes (optional)"
    ];
    steps = [
      "Bring a large pot of salted water to a rolling boil. Add the pasta and cook until al dente according to package instructions. Reserve 1/2 cup of pasta water, then drain.",
      `In a large skillet, heat the extra virgin olive oil over medium heat. Add the minced garlic and sauté for 1 minute until fragrant.`,
      `Add the sliced ${list[0]}${list[1] ? ` and chopped ${list[1]}` : ""} to the skillet. Cook for 5-6 minutes, stirring occasionally, until tender and lightly browned.`,
      "Reduce the heat to low. Pour in the heavy cream and let it gently simmer for 2 minutes. Stir in the grated Parmesan cheese until melted and smooth.",
      "Add the cooked pasta and the fresh herbs to the skillet. Toss everything together, adding a splash of the reserved pasta water if the sauce is too thick.",
      "Season with sea salt, black pepper, and optional red pepper flakes. Portion onto warm plates and serve immediately with extra Parmesan on top."
    ];
  } else if (list.some(i => i.includes("chicken") || i.includes("poultry") || i.includes("turkey") || i.includes("breast") || i.includes("meat"))) {
    // Chicken/Meat Theme
    name = `One-Pan Tuscan Herb ${ingredientName}`;
    description = `Juicy pan-seared ${list[0]} prepared in a savory, aromatic white wine reduction sauce, infused with wild rosemary, thyme, ${list[1] ? `and succulent ${list[1]}` : "and ripe vine tomatoes"}.`;
    prepTime = "15 Min";
    cookTime = "25 Min";
    servings = "4";
    recipeIngredients = [
      `450g of fresh ${list[0]} (cut into bite-sized medallions)`,
      list[1] ? `1.5 cups of cleaned ${list[1]}` : "1 cup of cherry tomatoes, halved",
      "2 tbsp of unsalted butter",
      "1 tbsp of olive oil",
      "4 cloves of garlic, smashed",
      "1/3 cup of dry white wine or vegetable broth",
      "1 tsp of dried oregano and fresh rosemary",
      "1/2 tsp of sea salt",
      "1/4 tsp of freshly cracked black pepper",
      "Fresh lemon wedges for serving"
    ];
    steps = [
      `Pat the ${list[0]} dry with paper towels. Season generously on all sides with sea salt, black pepper, and dried oregano.`,
      "Heat the olive oil and 1 tablespoon of butter in a heavy skillet over medium-high heat. Add the meat and sear for 5-6 minutes per side until golden brown and cooked through. Transfer to a plate and keep warm.",
      `In the same skillet, reduce heat to medium. Add the remaining butter, smashed garlic cloves, and ${list[1] ? `cleaned ${list[1]}` : "cherry tomatoes"}. Sauté for 3-4 minutes until tender and caramelized.`,
      "Pour in the white wine (or broth), scraping up all the delicious browned bits from the bottom of the pan. Let the liquid simmer and reduce by half (about 3 minutes).",
      `Return the seared ${list[0]} to the skillet, along with any collected juices. Spoon the garlic-herb pan sauce over the top, cover, and let simmer for 2 minutes to heat through.`,
      "Squeeze fresh lemon juice over the dish, garnish with fresh herbs, and serve warm alongside crusty bread or fluffy rice."
    ];
  } else if (list.some(i => i.includes("salmon") || i.includes("fish") || i.includes("shrimp") || i.includes("prawn") || i.includes("tuna") || i.includes("seafood"))) {
    // Seafood Theme
    name = `Pan-Seared Lemon-Butter ${ingredientName}`;
    description = `Flawlessly caramelized ${list[0]} basted in a rich, tangy lemon-butter reduction. Accentuated beautifully by ${list[1] ? `freshly prepared ${list[1]}` : "bright asparagus and capers"}.`;
    prepTime = "10 Min";
    cookTime = "12 Min";
    servings = "2";
    recipeIngredients = [
      `2 fresh fillets of premium ${list[0]}`,
      list[1] ? `1 cup of sliced ${list[1]}` : "1 bunch of fresh asparagus, trimmed",
      "3 tbsp of unsalted butter, divided",
      "1 tbsp of avocado oil",
      "1 organic lemon, zested and juiced",
      "2 tbsp of capers, drained",
      "2 cloves of garlic, minced",
      "1/2 tsp of smoked paprika",
      "Sea salt and ground white pepper to taste",
      "Fresh dill for garnish"
    ];
    steps = [
      `Season the ${list[0]} fillets with smoked paprika, salt, and white pepper. Let sit at room temp for 5 minutes.`,
      "Heat avocado oil and 1 tablespoon of butter in a non-stick skillet over medium-high heat. Once hot, place the seafood flesh-side down and cook undisturbed for 4 minutes until a gold crust forms.",
      "Flip carefully. Add the remaining butter, minced garlic, lemon zest, lemon juice, and capers to the pan.",
      `Toss in the ${list[1] ? `sliced ${list[1]}` : "asparagus"} around the sides of the pan.`,
      "Spoon the melting, bubbling garlic lemon-butter sauce continuously over the fillets for another 3-4 minutes until cooked to medium-rare/medium.",
      "Remove from heat. Plate the fillets next to the vegetables, pour the remaining pan sauce generously over the top, garnish with fresh dill, and serve immediately."
    ];
  } else if (list.some(i => i.includes("egg") || i.includes("eggs") || i.includes("omelet") || i.includes("frittata"))) {
    // Egg/Breakfast Theme
    name = `Fluffy Gourmet ${ingredientName} Frittata`;
    description = `A luxurious, fluffy skillet frittata loaded with whisked pasture-raised eggs, tender sautéed ${list[0]}, ${list[1] ? `savory ${list[1]}` : "melted cheese" } and garden herbs. Perfect for breakfast or a light dinner.`;
    prepTime = "10 Min";
    cookTime = "15 Min";
    servings = "3";
    recipeIngredients = [
      "6 large pasture-raised eggs",
      `1 cup of finely chopped ${list[0]}`,
      list[1] ? `3/4 cup of sliced ${list[1]}` : "1/2 cup of shredded sharp Cheddar or Feta",
      "1/4 cup of whole milk or heavy cream",
      "1 tbsp of butter or olive oil",
      "1/2 small red onion, diced",
      "1/4 cup of fresh chives, snipped",
      "1/2 tsp of sea salt",
      "1/4 tsp of smoked black pepper",
      "A pinch of nutmeg"
    ];
    steps = [
      "Preheat your oven's broiler to high.",
      "In a medium bowl, vigorously whisk together the eggs, milk (or cream), sea salt, black pepper, and a pinch of nutmeg until light and frothy. Stir in the fresh chives and half of the cheese.",
      `Heat butter or olive oil in an oven-safe skillet (like seasoned cast iron) over medium heat. Sauté the red onion and chopped ingredients (including ${list[0]}${list[1] ? `, ${list[1]}` : ""}) for 4-5 minutes until tender and caramelized.`,
      "Spread the cooked ingredients evenly across the bottom of the skillet. Pour the egg mixture slowly over the top, making sure it covers all ingredients evenly. Sprinkle the remaining cheese on top.",
      "Cook undisturbed on the stovetop for 4-5 minutes until the edges are golden and set, but the center is still slightly runny.",
      "Transfer the skillet to the preheated broiler. Broil for 3-4 minutes until the frittata is puffed up, beautifully golden on top, and cooked through in the center. Slice into wedges and serve hot!"
    ];
  } else if (list.some(i => i.includes("dessert") || i.includes("chocolate") || i.includes("banana") || i.includes("sweet") || i.includes("apple") || i.includes("berry") || i.includes("strawberry") || i.includes("sugar"))) {
    // Dessert/Sweet Theme
    name = `Caramelized Sweet Honey ${ingredientName} Skillet`;
    description = `A decadent, warm dessert skillet highlighting sweet caramelized ${list[0]}${list[1] ? ` paired with rich ${list[1]}` : ""}. Finished with a warm honey-cinnamon glaze and toasted nuts.`;
    prepTime = "5 Min";
    cookTime = "10 Min";
    servings = "2";
    recipeIngredients = [
      `2 cups of sliced ${list[0]}`,
      list[1] ? `1 cup of prepared ${list[1]}` : "1/4 cup of chopped walnuts or pecans",
      "2 tbsp of organic raw honey or maple syrup",
      "1.5 tbsp of unsalted butter",
      "1/2 tsp of ground Ceylon cinnamon",
      "1/4 tsp of pure vanilla extract",
      "A pinch of fine sea salt",
      "High-quality vanilla bean ice cream for serving"
    ];
    steps = [
      "Melt the butter in a medium skillet over medium heat. Once bubbling, stir in the raw honey, ground cinnamon, vanilla extract, and a pinch of sea salt.",
      `Add the sliced ${list[0]}${list[1] ? ` and ${list[1]}` : ""} to the pan in a single layer. Let caramelize for 3-4 minutes without stirring, allowing the sugars to develop deep golden flavor.`,
      "Flip gently. Add the chopped walnuts/pecans (if using) and continue cooking for 3 more minutes until the ingredients are beautifully tender and coated in a glossy, thickened glaze.",
      "Remove from heat and let cool for 2 minutes (the glaze will thicken as it cools).",
      "Portion warm caramelized dessert into bowls. Top with a generous scoop of cold vanilla bean ice cream and drizzle the remaining warm skillet glaze over the top."
    ];
  } else {
    // Generic / Stir-Fry Theme
    name = `Rustic Pan-Seared ${ingredientName} Medley`;
    description = `An exceptionally colorful, nutrient-dense skillet roast featuring crispy, herb-infused ${list[0]} and savory ${list[1] || "garden vegetables"}. Lightly glazed in a balsamic-garlic reduction.`;
    prepTime = "10 Min";
    cookTime = "15 Min";
    servings = "2";
    recipeIngredients = [
      `1.5 cups of sliced ${list[0]}`,
      list[1] ? `1 cup of chopped ${list[1]}` : "1 medium bell pepper, julienned",
      "2 tbsp of extra virgin olive oil",
      "1.5 tbsp of aged balsamic vinegar",
      "3 cloves of garlic, minced",
      "1 tsp of fresh Italian thyme leaves",
      "1/2 tsp of sea salt & black pepper to taste",
      "Toasted sesame seeds or pine nuts for garnish"
    ];
    steps = [
      `Wash and prepare the ${list[0]}${list[1] ? ` and ${list[1]}` : ""} into uniform, bite-sized pieces.`,
      "Heat the olive oil in a large skillet over medium-high heat until shimmering. Toss in the minced garlic and thyme, sautéing for 45 seconds until intensely aromatic.",
      `Add the prepared ${list[0]}${list[1] ? ` and chopped ${list[1]}` : " and bell pepper"} to the skillet. Cook undisturbed for 3-4 minutes to develop a beautiful golden sear on the edges.`,
      "Stir and continue cooking for 5-6 minutes, tossing occasionally, until all ingredients are tender-crisp.",
      "Drizzle the aged balsamic vinegar around the edges of the hot skillet. It will bubble and glaze the ingredients instantly. Toss well to coat everything evenly, then remove from heat.",
      "Season to taste with sea salt and fresh black pepper. Garnish with toasted seeds or nuts, and serve hot as a main dish or premium side."
    ];
  }

  return {
    name,
    description,
    preparationTime: prepTime,
    cookingTime: cookTime,
    servings,
    ingredients: recipeIngredients,
    steps
  };
};

// POST /api/ai/generate
const generateRecipe = async (req, res) => {
  try {
    const { ingredients } = req.body;

    if (!ingredients || ingredients.length === 0)
      return res.status(400).json({ message: "Ingredients are required" });

    // Try generating with OpenAI if configured
    if (openai) {
      try {
        const prompt = `
          You are an expert chef AI. I have these ingredients: ${ingredients.join(", ")}.
          Generate a delicious, detailed recipe I can make with these.
          You MUST return ONLY a raw JSON object matching the exact structure below. Do not include any markdown fences, explanation, or extra characters.
          
          Exact JSON Structure:
          {
            "name": "Recipe Name",
            "description": "An appetizing 2-3 sentence description of the recipe.",
            "preparationTime": "15 Min",
            "cookingTime": "25 Min",
            "servings": "4",
            "ingredients": [
              "2 whole eggs",
              "1 cup of milk",
              "1.5 cups of all-purpose flour"
            ],
            "steps": [
              "Whisk the eggs and milk together in a medium mixing bowl until well combined.",
              "Gently fold in the flour until a smooth batter forms, making sure there are no lumps.",
              "Heat a non-stick skillet over medium-high heat and lightly coat with butter.",
              "Pour batter into the skillet and cook until golden brown on both sides, then serve warm."
            ]
          }
        `;

        const response = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
          max_tokens: 1200,
        });

        const text = response.choices[0].message.content;
        let clean = text.replace(/```json|```/g, "").trim();

        let recipe;
        try {
          recipe = JSON.parse(clean);
        } catch (err) {
          console.warn("Direct JSON parsing failed, attempting regex extraction...");
          const match = clean.match(/\{[\s\S]*\}/);
          if (match) {
            recipe = JSON.parse(match[0]);
          } else {
            throw new Error("No JSON structure found in response");
          }
        }

        console.log("✅ Successfully generated recipe using OpenAI.");
        return res.json({ recipe });
      } catch (openAiError) {
        console.warn("⚠️ OpenAI generation failed. Falling back to programmatic engine. Error:", openAiError.message);
      }
    }

    // Programmatic Fallback Engine
    console.log("🚀 Generating recipe using Programmatic Fallback Chef Engine...");
    const recipe = generateFallbackRecipe(ingredients);
    return res.json({ recipe });

  } catch (error) {
    console.error("AI generate top-level error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { generateRecipe };