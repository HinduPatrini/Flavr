const mockRecipes = [
  {
    id: 999001,
    title: "Classic Margherita Pizza",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80",
    readyInMinutes: 25,
    servings: 4,
    vegetarian: true,
    vegan: false,
    glutenFree: false,
    cuisines: ["Italian", "Mediterranean"],
    dishTypes: ["lunch", "dinner", "main course"],
    summary: "A simple yet delicious classic Italian Margherita pizza with fresh mozzarella, vine-ripened tomatoes, and fresh basil leaves on a thin, crispy crust.",
    extendedIngredients: [
      { id: 1, name: "pizza dough", amount: 1, unit: "lb", original: "1 lb pizza dough" },
      { id: 2, name: "mozzarella cheese", amount: 8, unit: "oz", original: "8 oz fresh mozzarella, sliced" },
      { id: 3, name: "tomato sauce", amount: 0.5, unit: "cup", original: "0.5 cup marinara or tomato sauce" },
      { id: 4, name: "fresh basil", amount: 10, unit: "leaves", original: "10 fresh basil leaves" },
      { id: 5, name: "olive oil", amount: 1, unit: "tbsp", original: "1 tbsp extra virgin olive oil" }
    ],
    analyzedInstructions: [
      {
        name: "",
        steps: [
          { number: 1, step: "Preheat your oven to 450°F (230°C). Roll out the pizza dough on a floured surface to form a 12-inch circle." },
          { number: 2, step: "Transfer the rolled dough onto a baking sheet or pizza stone." },
          { number: 3, step: "Spread the tomato sauce evenly over the dough, leaving a 1-inch border around the edge." },
          { number: 4, step: "Arrange the fresh mozzarella slices evenly over the sauce." },
          { number: 5, step: "Bake in the preheated oven for 12-15 minutes, or until the crust is golden brown and the cheese is bubbly." },
          { number: 6, step: "Remove from the oven, garnish with fresh basil leaves, drizzle with olive oil, slice and serve hot." }
        ]
      }
    ],
    nutrition: {
      nutrients: [
        { name: "Calories", amount: 285, unit: "kcal" },
        { name: "Fat", amount: 10, unit: "g" },
        { name: "Carbohydrates", amount: 36, unit: "g" },
        { name: "Protein", amount: 12, unit: "g" }
      ]
    }
  },
  {
    id: 999002,
    title: "Creamy Spaghetti Carbonara",
    image: "https://images.unsplash.com/photo-1612874742237-6526221588e3?auto=format&fit=crop&w=800&q=80",
    readyInMinutes: 20,
    servings: 2,
    vegetarian: false,
    vegan: false,
    glutenFree: false,
    cuisines: ["Italian"],
    dishTypes: ["lunch", "dinner", "main course"],
    summary: "Authentic Roman spaghetti carbonara made with rich egg yolks, crispy guanciale or pancetta, freshly grated Pecorino Romano, and cracked black pepper.",
    extendedIngredients: [
      { id: 11, name: "spaghetti", amount: 8, unit: "oz", original: "8 oz spaghetti pasta" },
      { id: 12, name: "pancetta", amount: 4, unit: "oz", original: "4 oz pancetta or guanciale, diced" },
      { id: 13, name: "egg yolks", amount: 3, unit: "large", original: "3 large egg yolks" },
      { id: 14, name: "Pecorino Romano", amount: 0.5, unit: "cup", original: "0.5 cup Pecorino Romano cheese, grated" },
      { id: 15, name: "black pepper", amount: 1, unit: "tsp", original: "1 tsp freshly ground black pepper" }
    ],
    analyzedInstructions: [
      {
        name: "",
        steps: [
          { number: 1, step: "Bring a large pot of salted water to a boil and cook the spaghetti according to package directions until al dente." },
          { number: 2, step: "Meanwhile, cook the pancetta in a large skillet over medium heat until crispy, about 5-7 minutes. Remove from heat." },
          { number: 3, step: "In a small bowl, whisk together the egg yolks, grated Pecorino Romano, and black pepper until a thick paste forms." },
          { number: 4, step: "Drain the pasta, reserving 1/2 cup of pasta water. Add the hot pasta immediately to the skillet with the pancetta." },
          { number: 5, step: "Pour the egg yolk mixture over the hot pasta and toss rapidly. The heat of the pasta will cook the eggs into a smooth, creamy sauce. Add pasta water as needed to loosen." },
          { number: 6, step: "Serve immediately with extra grated cheese and fresh pepper." }
        ]
      }
    ],
    nutrition: {
      nutrients: [
        { name: "Calories", amount: 420, unit: "kcal" },
        { name: "Fat", amount: 18, unit: "g" },
        { name: "Carbohydrates", amount: 45, unit: "g" },
        { name: "Protein", amount: 18, unit: "g" }
      ]
    }
  },
  {
    id: 999003,
    title: "Classic Chicken Tikka Masala",
    image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80",
    readyInMinutes: 40,
    servings: 4,
    vegetarian: false,
    vegan: false,
    glutenFree: true,
    cuisines: ["Indian"],
    dishTypes: ["lunch", "dinner", "main course"],
    summary: "Succulent grilled chicken chunks cooked in a rich, velvety, spiced tomato-cream curry sauce. Perfect with warm garlic naan or basmati rice.",
    extendedIngredients: [
      { id: 21, name: "chicken breast", amount: 1.5, unit: "lbs", original: "1.5 lbs chicken breasts, cubed" },
      { id: 22, name: "yogurt", amount: 0.5, unit: "cup", original: "0.5 cup plain Greek yogurt" },
      { id: 23, name: "garam masala", amount: 2, unit: "tbsp", original: "2 tbsp garam masala spice blend" },
      { id: 24, name: "tomato puree", amount: 15, unit: "oz", original: "15 oz tomato puree sauce" },
      { id: 25, name: "heavy cream", amount: 0.5, unit: "cup", original: "0.5 cup heavy whipping cream" },
      { id: 26, name: "ginger garlic paste", amount: 1.5, unit: "tbsp", original: "1.5 tbsp ginger garlic paste" }
    ],
    analyzedInstructions: [
      {
        name: "",
        steps: [
          { number: 1, step: "In a bowl, marinate chicken with yogurt, half of the ginger garlic paste, 1 tbsp garam masala, lemon juice, and salt for at least 15 minutes." },
          { number: 2, step: "Thread chicken onto skewers or place on a baking pan. Broil at high heat for 10-12 minutes until slightly charred. Set aside." },
          { number: 3, step: "In a large pot, heat oil over medium heat. Sauté chopped onions and remaining ginger garlic paste until soft." },
          { number: 4, step: "Add tomato puree, remaining garam masala, cumin, coriander, and chili powder. Simmer for 10 minutes." },
          { number: 5, step: "Stir in the heavy cream, then add the grilled chicken pieces. Let it simmer gently for 5 minutes." },
          { number: 6, step: "Garnish with fresh cilantro leaves and serve with warm basmati rice." }
        ]
      }
    ],
    nutrition: {
      nutrients: [
        { name: "Calories", amount: 380, unit: "kcal" },
        { name: "Fat", amount: 22, unit: "g" },
        { name: "Carbohydrates", amount: 12, unit: "g" },
        { name: "Protein", amount: 32, unit: "g" }
      ]
    }
  },
  {
    id: 999004,
    title: "Healthy Vegan Buddha Bowl",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80",
    readyInMinutes: 15,
    servings: 1,
    vegetarian: true,
    vegan: true,
    glutenFree: true,
    cuisines: ["Healthy", "Clean Eating"],
    dishTypes: ["lunch", "dinner", "salad"],
    summary: "A nutrient-packed buddha bowl composed of fluffy quinoa, roasted sweet potatoes, crisp chickpeas, fresh avocado, and a creamy tahini-lemon dressing.",
    extendedIngredients: [
      { id: 31, name: "quinoa", amount: 0.5, unit: "cup", original: "0.5 cup cooked quinoa" },
      { id: 32, name: "sweet potato", amount: 0.5, unit: "cup", original: "0.5 cup roasted sweet potatoes, cubed" },
      { id: 33, name: "chickpeas", amount: 0.5, unit: "cup", original: "0.5 cup cooked chickpeas" },
      { id: 34, name: "avocado", amount: 0.5, unit: "piece", original: "0.5 avocado, sliced" },
      { id: 35, name: "tahini", amount: 2, unit: "tbsp", original: "2 tbsp organic tahini paste" },
      { id: 36, name: "spinach", amount: 1, unit: "cup", original: "1 cup fresh baby spinach" }
    ],
    analyzedInstructions: [
      {
        name: "",
        steps: [
          { number: 1, step: "Assemble the base of the bowl with fresh baby spinach leaves." },
          { number: 2, step: "Arrange cooked quinoa, roasted sweet potatoes, chickpeas, and avocado slices neatly side by side on top of the spinach." },
          { number: 3, step: "In a small bowl, whisk together the tahini, lemon juice, a splash of warm water, salt, and pepper to make a creamy dressing." },
          { number: 4, step: "Drizzle the tahini dressing generously over the bowl components." },
          { number: 5, step: "Top with sesame seeds or red pepper flakes for extra crunch and heat." }
        ]
      }
    ],
    nutrition: {
      nutrients: [
        { name: "Calories", amount: 340, unit: "kcal" },
        { name: "Fat", amount: 14, unit: "g" },
        { name: "Carbohydrates", amount: 48, unit: "g" },
        { name: "Protein", amount: 10, unit: "g" }
      ]
    }
  },
  {
    id: 999005,
    title: "Avocado Toast with Poached Egg",
    image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80",
    readyInMinutes: 10,
    servings: 1,
    vegetarian: true,
    vegan: false,
    glutenFree: false,
    cuisines: ["Breakfast", "American"],
    dishTypes: ["breakfast", "brunch"],
    summary: "Artisanal toasted sourdough bread topped with creamy seasoned mashed avocado, a perfectly poached runny egg, and a sprinkle of everything bagel seasoning.",
    extendedIngredients: [
      { id: 41, name: "sourdough bread", amount: 1, unit: "slice", original: "1 thick slice sourdough bread" },
      { id: 42, name: "avocado", amount: 0.5, unit: "piece", original: "0.5 ripe Haas avocado" },
      { id: 43, name: "egg", amount: 1, unit: "large", original: "1 large organic egg" },
      { id: 44, name: "everything bagel seasoning", amount: 0.5, unit: "tsp", original: "0.5 tsp everything bagel seasoning" },
      { id: 45, name: "lemon juice", amount: 1, unit: "tsp", original: "1 tsp fresh lemon juice" }
    ],
    analyzedInstructions: [
      {
        name: "",
        steps: [
          { number: 1, step: "Toast the sourdough slice until golden and crispy." },
          { number: 2, step: "In a small bowl, mash the avocado with lemon juice, salt, and pepper." },
          { number: 3, step: "Bring a small pot of water to a gentle simmer, add a splash of vinegar, swirl the water, and crack the egg into the center to poach for 3 minutes." },
          { number: 4, step: "Spread the mashed avocado generously over the toasted sourdough bread." },
          { number: 5, step: "Carefully lift the poached egg with a slotted spoon, pat dry, and place it on top of the avocado." },
          { number: 6, step: "Sprinkle with everything bagel seasoning and red pepper flakes." }
        ]
      }
    ],
    nutrition: {
      nutrients: [
        { name: "Calories", amount: 220, unit: "kcal" },
        { name: "Fat", amount: 12, unit: "g" },
        { name: "Carbohydrates", amount: 20, unit: "g" },
        { name: "Protein", amount: 9, unit: "g" }
      ]
    }
  },
  {
    id: 999006,
    title: "Decadent Chocolate Lava Cake",
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80",
    readyInMinutes: 18,
    servings: 2,
    vegetarian: true,
    vegan: false,
    glutenFree: false,
    cuisines: ["French", "Desserts"],
    dishTypes: ["dessert"],
    summary: "Rich chocolate cake with a warm, flowing molten chocolate center. A popular restaurant dessert that is easy to make at home.",
    extendedIngredients: [
      { id: 51, name: "dark chocolate", amount: 4, unit: "oz", original: "4 oz dark baking chocolate" },
      { id: 52, name: "butter", amount: 4, unit: "tbsp", original: "4 tbsp unsalted butter" },
      { id: 53, name: "eggs", amount: 2, unit: "whole", original: "2 whole eggs" },
      { id: 54, name: "sugar", amount: 0.25, unit: "cup", original: "0.25 cup granulated sugar" },
      { id: 55, name: "all purpose flour", amount: 2, unit: "tbsp", original: "2 tbsp all purpose flour" }
    ],
    analyzedInstructions: [
      {
        name: "",
        steps: [
          { number: 1, step: "Preheat oven to 425°F (218°C). Grease two ramekins with butter and dust lightly with cocoa powder." },
          { number: 2, step: "Melt dark chocolate and butter together in a microwave-safe bowl in 20-second increments until completely smooth." },
          { number: 3, step: "In another bowl, whisk eggs and sugar together until light and fluffy." },
          { number: 4, step: "Gently fold the melted chocolate mixture and flour into the eggs until just combined." },
          { number: 5, step: "Divide batter evenly between prepared ramekins and bake for 10-12 minutes until the edges are firm but center is jiggly." },
          { number: 6, step: "Invert carefully onto dessert plates, dust with powdered sugar, and serve immediately with vanilla ice cream." }
        ]
      }
    ],
    nutrition: {
      nutrients: [
        { name: "Calories", amount: 390, unit: "kcal" },
        { name: "Fat", amount: 24, unit: "g" },
        { name: "Carbohydrates", amount: 38, unit: "g" },
        { name: "Protein", amount: 6, unit: "g" }
      ]
    }
  },
  {
    id: 999007,
    title: "Garlic Butter Lemon Salmon",
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=800&q=80",
    readyInMinutes: 20,
    servings: 2,
    vegetarian: false,
    vegan: false,
    glutenFree: true,
    cuisines: ["Seafood", "Mediterranean"],
    dishTypes: ["lunch", "dinner", "main course"],
    summary: "Flaky, pan-seared salmon fillets basted in a delicious garlic butter pan sauce infused with fresh lemon juice and dill.",
    extendedIngredients: [
      { id: 61, name: "salmon fillet", amount: 2, unit: "pieces", original: "2 fresh skin-on salmon fillets" },
      { id: 62, name: "butter", amount: 2, unit: "tbsp", original: "2 tbsp unsalted butter" },
      { id: 63, name: "garlic", amount: 3, unit: "cloves", original: "3 garlic cloves, minced" },
      { id: 64, name: "lemon", amount: 0.5, unit: "piece", original: "0.5 fresh lemon, juiced" },
      { id: 65, name: "fresh dill", amount: 1, unit: "tbsp", original: "1 tbsp fresh dill, chopped" }
    ],
    analyzedInstructions: [
      {
        name: "",
        steps: [
          { number: 1, step: "Season salmon fillets generously on both sides with salt, pepper, and garlic powder." },
          { number: 2, step: "Heat olive oil in a non-stick skillet over medium-high heat. Sear salmon skin-side up for 4-5 minutes until golden." },
          { number: 3, step: "Flip the fillets, reduce heat to medium, and add butter, minced garlic, and fresh dill to the pan." },
          { number: 4, step: "Spoon the melted garlic butter continuously over the salmon for 3-4 minutes to baste it." },
          { number: 5, step: "Squeeze fresh lemon juice over the top, remove from pan, and garnish with fresh dill and lemon slices." }
        ]
      }
    ],
    nutrition: {
      nutrients: [
        { name: "Calories", amount: 310, unit: "kcal" },
        { name: "Fat", amount: 16, unit: "g" },
        { name: "Carbohydrates", amount: 2, unit: "g" },
        { name: "Protein", amount: 34, unit: "g" }
      ]
    }
  },
  {
    id: 999008,
    title: "Classic Grilled Chicken Caesar Salad",
    image: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&w=800&q=80",
    readyInMinutes: 15,
    servings: 2,
    vegetarian: false,
    vegan: false,
    glutenFree: false,
    cuisines: ["American"],
    dishTypes: ["lunch", "salad"],
    summary: "Crisp Romaine lettuce tossed in creamy Caesar dressing, topped with sliced juicy grilled chicken breast, garlic herb croutons, and shaved Parmesan.",
    extendedIngredients: [
      { id: 71, name: "chicken breast", amount: 1, unit: "large", original: "1 large grilled chicken breast, sliced" },
      { id: 72, name: "Romaine lettuce", amount: 4, unit: "cups", original: "4 cups crisp Romaine lettuce, chopped" },
      { id: 73, name: "croutons", amount: 0.5, unit: "cup", original: "0.5 cup garlic herb croutons" },
      { id: 74, name: "Parmesan cheese", amount: 0.25, unit: "cup", original: "0.25 cup shaved Parmesan cheese" },
      { id: 75, name: "Caesar dressing", amount: 3, unit: "tbsp", original: "3 tbsp creamy Caesar salad dressing" }
    ],
    analyzedInstructions: [
      {
        name: "",
        steps: [
          { number: 1, step: "In a large salad bowl, combine the chopped crisp Romaine lettuce, shaved Parmesan, and croutons." },
          { number: 2, step: "Drizzle the creamy Caesar dressing over the ingredients and toss gently to coat evenly." },
          { number: 3, step: "Divide salad between serving plates." },
          { number: 4, step: "Top with warm sliced grilled chicken breast and sprinkle with freshly cracked black pepper." }
        ]
      }
    ],
    nutrition: {
      nutrients: [
        { name: "Calories", amount: 290, unit: "kcal" },
        { name: "Fat", amount: 15, unit: "g" },
        { name: "Carbohydrates", amount: 14, unit: "g" },
        { name: "Protein", amount: 26, unit: "g" }
      ]
    }
  }
];

module.exports = mockRecipes;
