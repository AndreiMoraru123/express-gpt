const OPENAI_KEY = "shrek";
const price = 0.0002 / 1000;

const messages = [];
let totalTokens = 0;

async function sendChat() {
    const prompt = document.querySelector("#prompt").value;
    document.querySelector("#prompt").value = "";
    document.querySelector("ul").innerHTML += `<li><b>${prompt}</b></li>`

    messages.push({"role": "user", "content": prompt})

    const data = {
        "model": "gpt-4",
        messages
    };

    const response = await fetch("https://api.openai.com/v1/chat/completions",
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_KEY}`,
            },
            body: JSON.stringify(data)
        });

    const json_response = await response.json();
    messages.push(json_response.choices[0].message);
    const message = json_response.choices[0].message.content;
    document.querySelector("ul").innerHTML += `<li>${message}</li>`

    document.querySelector("#prompt").value = "";
    document.querySelector("input").focus();
}