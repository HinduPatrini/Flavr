const OpenAI = require("openai");

// Lazily initialize so a missing OPENAI_API_KEY doesn't crash server on boot
let openai = null;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  console.log("✅ OpenAI client initialized.");
} else {
  console.warn("⚠️  OPENAI_API_KEY missing — AI recipe generation disabled.");
}

// POST /api/ai/generate
const generateRecipe = async (req, res) => {
  try {
    if (!openai) {
      return res.status(503).json({
        message: "AI service is not configured. Please add OPENAI_API_KEY to your environment variables.",
      });
    }

    const { ingredients } = req.body;

    if (!ingredients || ingredients.length === 0)
      return res.status(400).json({ message: "Ingredients are required" });

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
        try {
          recipe = JSON.parse(match[0]);
        } catch (innerErr) {
          throw new Error("Could not parse generated recipe JSON structure.");
        }
      } else {
        throw new Error("No JSON structure found in generated recipe response.");
      }
    }

    res.json({ recipe });
  } catch (error) {
    console.error("AI generate error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { generateRecipe };