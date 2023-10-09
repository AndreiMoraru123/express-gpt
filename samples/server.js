require('dotenv').config()

const path = require('path');
const express = require('express');
const cors = require('cors');
const {Configuration, OpenAIApi} = require("openai");
const app = express();

app.use(express.json()); // parse JSON requests
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

const configuration = new Configuration({
    apiKey: process.env.OPENAI_KEY,
});
const openai = new OpenAIApi(configuration);

app.post('/api/chat', async (req, res) => {
    const body = req.body;
    const response = await fetch("https://api.openai.com/v1/chat/completions",
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_KEY}`,
            },
            body: JSON.stringify(body)
        })
    res.json(await response.json())
});


app.post('/api/general', async (req, res) => {
    const body = req.body;
    const completion = await openai.createChatCompletion({
        model: "gpt-4",
        messages: [{role: "user", content: body.prompt}],
    });
    res.json(completion.data.choices[0].message.content);
});

app.post('/api/image', async (req, res) => {
    const body = req.body
    const response = await openai.createImage({
        prompt: body.prompt,
        n: 1,
        size: "1024x1024",
    });
    res.json({url: response.data.data[0].url})
})

const recipeSample = {
    "slug": "fish-tacos",
    "name": "Fish Tacos with Pickled Onion",
    "type": "Main Meal",
    "duration": 60,
    "image": "images/original/fish-tacos-with-pickled-onion.png",
    "description": "Delicious fish tacos made with crispy breaded fish, fresh cilantro, and tangy pickled onions wrapped in a soft flour tortilla.",
    "ingredients": {
        "Red onion": "1",
        "Water": "1 cup",
        "Vinegar": "1 cup",
        "Sugar": "1 tablespoon",
        "Salt": "1 teaspoon",
        "White fish fillets": "1 pound",
        "Flour": "1 cup",
        "Egg": "1",
        "Breadcrumbs": "1 cup",
        "Vegetable oil": "for frying",
        "Flour tortillas": "8",
        "Cilantro": "1 bunch",
        "Lime": "1"
    },
    "steps": [
        {
            "name": "Pickle Onions",
            "description": "Thinly slice the red onion and set aside."
        },
        {
            "name": "Prepare Pickling Liquid",
            "description": "In a small saucepan, combine the water, vinegar, sugar, and salt. Bring to a simmer, then remove from heat.",
            "timer": 5
        },
        {
            "name": "Pickle Onions",
            "description": "Add the sliced onions to the pickling liquid and let sit for at least 30 minutes.",
            "timer": 30
        },
        {
            "name": "Prepare Fish",
            "description": "Cut the fish fillets into 2-inch wide strips."
        },
        {
            "name": "Bread Fish",
            "description": "Set up a breading station with three shallow dishes: one with flour, one with a beaten egg, and one with breadcrumbs. Coat each fish strip in flour, dip in egg, and then coat with breadcrumbs."
        },
        {
            "name": "Fry Fish",
            "description": "Heat vegetable oil in a deep skillet over medium-high heat. Fry the breaded fish strips until golden brown and cooked through, about 3-4 minutes per side. Drain on paper towels."
        },
        {
            "name": "Assemble Tacos",
            "description": "Place a piece of fried fish on a flour tortilla, top with pickled onions, chopped cilantro, and a squeeze of lime. Fold and serve."
        }]
}

app.post('/api/recipe', async (req, res) => {
    const body = req.body;
    const ingredients = body.ingredients;

    const prompt = `       
    Create a recipe with the list of ingredients defined in the markup.
    <ingredients>${JSON.stringify(ingredients)}</ingredients>
    Make sure it's not healty.
    
    If you've found a rcipe, send the ouput in JSON format as the following sample in ***
    ***${JSON.stringify(recipeSample)}***
    `;

    const completion = await openai.createChatCompletion({
        model: "gpt-4",
        temperature: 1,
        messages: [
            {role: "system", content: "You are Shrek, a cooking expert ogre."},
            {role: "user", content: prompt}
        ],
    });
    res.json(completion.data.choices[0].message.content);

});

app.listen(3000, () => {
    console.log('Server started on port 3000');
});
