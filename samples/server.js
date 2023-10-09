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
    res.json (completion.data.choices[0].message.content);
});

app.post('/api/image', async (req, res) => {

})

app.post('/api/recipe', async (req, res) => {

});

app.listen(3000, () => {
    console.log('Server started on port 3000');
});
