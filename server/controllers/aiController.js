const Groq = require("groq-sdk");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// POST /api/ai/generate
const generateRecipe = async (req, res) => {
  try {
    const { ingredients } = req.body;

    if (!ingredients || ingredients.length === 0)
      return res.status(400).json({ message: "Ingredients are required" });

    const prompt = `
      I have these ingredients: ${ingredients.join(", ")}.
      Generate a detailed recipe I can make with these.
      Include:
      - Recipe name
      - Preparation time
      - Cooking time
      - Servings
      - Ingredients list with quantities
      - Step by step cooking instructions
      - A short description
      Format the response as JSON only, no extra text.
    `;

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const text = response.choices[0].message.content;
    const clean = text.replace(/```json|```/g, "").trim();
    const recipe = JSON.parse(clean);

    res.json({ recipe });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { generateRecipe };