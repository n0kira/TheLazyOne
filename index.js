require("dotenv").config();

const { App } = require("@slack/bolt");
const axios = require("axios");

const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    appToken: process.env.SLACK_APP_TOKEN,
    socketMode: true
});

app.command("/lazy-help", async ({ack, respond}) => {
    await ack();
    await respond({
        text: 
        'Available Commands:\n/lazy-help - Show this help message\n/lazy-ping - Check bot latency\n/lazy-catfact - Get a cat fact'
    });
});

app.command("/lazy-ping", async({command, ack, respond}) => {
    const start = Date.now();
    await ack();
    const latency = Date.now() - start;
    await respond ({text: `Pong!\nLatency: ${latency}ms`}); 
});

app.command("/lazy-catfact", async({ack, respond}) => {
    await ack();

    try {
        const response = await axios.get("https://catfact.ninja/fact");
        await respond({ text: `Cat Fact:\n${response.data.fact}` });
    } catch (e) {
        await respond({ text: "Failed to fetch a cat fact :(" });
    }
});

(async() => {
    await app.start();
    console.log("Bot is Running!!");
})();
