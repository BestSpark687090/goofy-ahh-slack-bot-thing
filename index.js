require("dotenv").config();
const fs = require("fs");
const help_msg = fs.readFileSync("./help.txt").toString();
// yes reason loading
const yes_normal = require("./yes_reasons.json");
const yes_corp = require("./yes_reasons_corporate.json");
const yes_funny = require("./yes_reasons_funny.json");
const yes_sarcastic = require("./yes_reasons_sarcastic.json");

const { App } = require("@slack/bolt");

const app = new App({
    token: process.env.BOT_TOKEN,
    appToken: process.env.APP_TOKEN,
    socketMode: true,
});

app.command("/goofyahhbot-ping", async ({ command, ack, respond }) => {
    const start = Date.now();
    await ack();
    const latency = Date.now() - start;
    await respond({ text: `Pong!\nLatency: ${latency}ms` });
});

app.command("/goofyahhbot-help", async ({ command, ack, respond }) => {
    await ack();
    await respond({ text: help_msg });
});
app.command("/goofyahhbot-ismysiteup", async ({ command, ack, respond }) => {
    // fetch exists natively in nodejs now so it should be fine
    await ack();
    try {
        let res = await fetch("https://bestspark.org/ping");
        let txt = await res.text();
        if (txt == "pong") {
            await respond({ text: "bestspark.org is up :thumbs-up:" });
        }
    } catch (e) {
        await respond({
            text: `failed to fetch https://bestspark.org/ping: ${e.message}`,
        });
    }
});
app.command("/goofyahhbot-no", async function ({ command, ack, respond, say }) {
    await ack();
    try {
        let res = await fetch("https://naas.isalman.dev/no");
        let json = await res.json();
        await say({ text: json.reason });
    } catch (e) {
        await respond({
            text: `couldn't even fetch a no for you. sad.
anyways heres the error message: ${e.message}`,
        });
    }
});
app.command(
    "/goofyahhbot-paramtest",
    async function ({ command, ack, respond }) {
        await ack();
        await respond({ text: `your parameters were ${command.text}` });
    },
);
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}
app.command(
    "/goofyahhbot-yes",
    async function ({ command, ack, say, respond }) {
        await ack();
        switch (command.text) {
            case "":
                await say({
                    text: yes_normal[getRandomInt(yes_normal.length)],
                });
                break;
            case "corporate":
                await say({ text: yes_corp[getRandomInt(yes_corp.length)] });
                break;
            case "funny":
                await say({ text: yes_funny[getRandomInt(yes_corp.length)] });
                break;
            case "sarcastic":
                await say({
                    text: yes_sarcastic[getRandomInt(yes_sarcastic.length)],
                });
                break;
            default:
                await respond({
                    text: `${command.text} isn't a valid type.
Try nothing, \`corporate\`, \`funny\`, or \`sarcastic\` for options.`,
                });
        }
    },
);
// this is the reason why i need a semicolon at the end
(async () => {
    await app.start();
    console.log("bot is running!");
})();
