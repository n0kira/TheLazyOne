require("dotenv").config();

const { App } = require("@slack/bolt");
const axios = require("axios");

const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    appToken: process.env.SLACK_APP_TOKEN,
    socketMode: true
});

app.command("/lazy-help", async ({command, ack, respond}) => {
    await ack();
    await respond({
        text: 
        `Hello <@${command.user_id}>! Thanks for using The Lazy One bot!\nHere are all available Commands:\n\n*Normal Commands*\n\`/lazy-help\` - Show this help message\n\`/lazy-ping\` - Check bot latency\n\`/lazy-reminder [minutes][reason]\` - Set a reminder\n\n*API Commands*\n\`/lazy-catfact\` - Get a cat fact\n\`/lazy-exchange [initialCurrency][targetCurrency][amount]\` - Exchange any amount of money from one currency to another\n\`/lazy-astronomy\` - Get NASA\'s APOD\n\`/lazy-verse\` - Get a random Bible verse\n`
    });
});

app.command("/lazy-ping", async({ ack, respond}) => {
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

app.command("/lazy-astronomy", async({ack, respond}) => {
    await ack();

    try {
        const apiKey = process.env.NASA_API_KEY;
        const response = await axios.get(`https://api.nasa.gov/planetary/apod?api_key=${apiKey}`);
        if (response.data.media_type === "image") {
            await respond({ 
                text: `Here is NASA's APOD!\n\n*${response.data.title}*\n${response.data.explanation}`,
                attachments: [
                    {
                        fallback: 'Image preview: ${response.data.title}',
                        image_url: response.data.url,
                        alt_text: "APOD"
                    }
                ]            
            })  
        } else {
            await respond({
                text: `NASA has a video today, get the link below:\n\n*${response.data.title}*\n${response.data.explanation}\n\n${response.data.url}`
            })
        }
    } catch (e) {
        await respond({ text: "Sorry! Couldn't fetch :("});
    }
});

app.command("/lazy-exchange", async({ command, ack, respond}) => {
    await ack();
    const args = command.text.split(' ');
    if (args.length != 3) {
        await respond({ text: "Error! Make sure to put the right parameters (3)."});
        return;
    }
    
    try {
        const from = args[0];
        const to = args[1];
        const amount = args[2];

        const response = await axios.get(`https://api.frankfurter.dev/v2/rate/${from}/${to}`);
        const rate = response.data.rate;

        const result = (amount * rate).toFixed(2);

        await respond({ text: `${amount} *${from.toUpperCase()}* is ${result} *${to.toUpperCase()}*\n\n>Current rate: ${rate}`});
    } catch (e) {
        await respond({ text: "Failed to convert. Sorry!"});
    }
});

app.command("/lazy-verse", async({ack, respond}) => {

    await ack();

    try {
        const response = await axios.get("https://bible-api.com/data/web/random");

        await respond({ 
            text: `*${response.data.random_verse.book} ${response.data.random_verse.chapter}:${response.data.random_verse.verse}*\n\n>${response.data.random_verse.text}`
        });
    } catch (e) {
        await respond({ text: "Failed to fetch a verse. Sorry! :("});
    }
});

app.command("/lazy-reminder", async({command, ack, respond}) => {

    await ack();

    const args = command.text.split(" ");

    if (args.length != 2) {
        await respond({ text: "Invalid number or arguments!"})
        return;
    }

    try {
        const seconds = parseInt(args[0]) * 60;
        const title = args[1];

        if (!(seconds >= 60) || isNaN(seconds)) {
            await respond({ text: "Your number must be equal or greated than 1."});
            return;
        }


        let time;
        if (seconds == 60) {
            time = "min";
        } else {
            time = "mins";
        }

        await respond({ text: `You will be notified in ${args[0]} ${time}, reason: ${title}`});

        setTimeout(async () => {await respond({ text: `<@${command.user_id}>! Here is your reminder, reason: ${title}`})}, seconds*1000);
    } catch (e) {
        await respond({ text: "Error! Make sure you typed the correct info" });
    }

});

(async() => {
    await app.start();
    console.log("Bot is Running!!");
})();
