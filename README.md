# TheLazyOne
Custom Slack bot made for Stardance. Try it out!

This Bot was made totally with Node.js following [this guide](https://stardance.hackclub.com/missions/slack-bot/guide) which helped with laying the foundation needed.

---

## Available Commands

**Normal Commands**
`/lazy-help` - Show a help message
`/lazy-ping` - Check bot latency
`/lazy-reminder [minutes][reason]` - Set a reminder

**API Commands**
`/lazy-catfact` - Get a cat fact
`/lazy-exchange [initialCurrency][targetCurrency][amount]` - Exchange any amount of money from one currency to another
`/lazy-astronomy` - Get NASA's APOD
`/lazy-verse` - Get a random Bible verse

---

## How to run Locally
1. Register your bot:
    - Go to the [Slack Apps dashboard](https://api.slack.com/apps) and click **Create New App** → **From scratch**.
    - Call it however you want and pick your workspace.
    - Click **Create App**.
    - Open the **Socket Mode** page in your app’s left sidebar and toggle **Enable Socket Mode** on.
    - Open **Basic Information** in the left sidebar. Scroll to **App-Level Tokens** and click Generate Token and Scopes. Give the token a name (e.g. my-bot-socket) and add the `connections:write` scope. Click **Generate** and copy the token.
    - **Open OAuth & Permissions** in the left sidebar. Under **Bot Token Scopes**, add:
        ```
        chat:write
        commands
        app_mentions:read
        channels:history
        ```
    - Go to **Install App** in the left sidebar and click **Install to Workspace**, then you’ll see the **Bot User OAuth Token**, copy and save it. 
    - Open **Slash Commands** in the left sidebar and click **Create New Command**.
    - Register each command mentioned before.

2. Clone the repo:
    ```
    git clone https://github.com/n0kira/TheLazyOne.git

    cd TheLazyOne
    ```
3. Install dependencies:
    ```
    npm install
    ```
4. Set up environment variables:
    Get your NASA API Key at [this site](https://api.nasa.gov/#signUp).
    Create a `.env` file and add your Slack and NASA API keys:
    ```
    SLACK_APP_TOKEN=xapp....

    SLACK_BOT_TOKEN=xoxb....

    NASA_API_KEY=your_key...
    ```

5. Run the bot:
    ```
    node index.js
    ```
If nothing went wrong, you should see `Bot is Running!!` in your terminal.

If you need further help I suggest you visit [this guide](https://stardance.hackclub.com/missions/slack-bot/guide#step-1)
