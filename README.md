# multi-stream-chatbot
Chatbot framework that listens and sends messages to multiple live-streaming platforms simultaneously

![](https://github.com/HackerShackOfficial/multi-stream-chatbot/workflows/Node%20CI/badge.svg)

## Documentation

### Quick Start

Create a node project:

```bash
npm init
```

Post the following content in `index.js`:

```js
// Create an action
class DiceRollAction extends AbstractSimpleChatAction {
    matchesCommand(message, ctx) {
        return new MessageParser().parseCommand(message) === "!dice"
    }

    async makeMessage(message, ctx) {
        const num = this.rollDice()
        return `You rolled a ${num}`
    }

    rollDice() {
        const sides = 6
        return Math.floor(Math.random() * sides) + 1
    }
}

const actions = [new DiceRollAction()]

// Configure twitch auth
const twitchAuth = new TwitchAuth({
    oauthToken: process.env.TWITCH_BOT_KEY,
    botUsername: process.env.TWITCH_BOT_USERNAME,
    channel:  process.env.TWITCH_CHANNEL
})

// Create a bot
const bot = new StreamBot({
    streams: [new TwitchStream(twitchAuth)],
    actions
})

// Start the bot
bot.start()

```

Create environment variables for your Twitch stream authentication:

```
TWITCH_BOT_KEY,
TWITCH_BOT_USERNAME,
TWITCH_CHANNEL
```

Run the program:

```
node index.js
```

### Streams

Supports:

- Youtube
- Twitch
- Dummy (Interval)

### Actions

#### SimpleChatAction

Handles one command. See [DiceAction](https://github.com/HackerShackOfficial/hackershack-livestream-chatbot/blob/master/src/actions/registered/diceRollAction.js) for more details.

```js 
var {
    AbstractSimpleChatAction,
} = require("multi-stream-chatbot/actions")
```

#### StrategyBasedChatAction

Handles multiple commands that share state. See [PollActions](https://github.com/HackerShackOfficial/hackershack-livestream-chatbot/blob/master/src/actions/registered/pollAction.js) for more details.

```js 
var {
    AbstractStrategyBasedChatAction,
    AbstractMessageStrategy,
} = require("multi-stream-chatbot/actions")
```

## Test Locally

```
npm test
npm pretty
```

## Example

See the [Hacker Shack livestream chatbot repo](https://github.com/HackerShackOfficial/hackershack-livestream-chatbot) to see usage examples. 

## Donations

Thanks for the support!

 - `Zachary Nawrocki`: Love your videos. I've been working on a chat bot for my personal home assistant project, and these ideas have given me some inspiration. Thanks.
