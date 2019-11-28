# multi-stream-chatbot
Chatbot framework that listens and sends messages to multiple live-streaming platforms simultaneously

![](https://github.com/HackerShackOfficial/multi-stream-chatbot/workflows/Tests/badge.svg)

## Documentation

### Quick Start

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

### Bot



### Streams

### Actions

## Test Locally

```
npm test
```

## Example

See the [Hacker Shack livestream chatbot repo](https://github.com/HackerShackOfficial/hackershack-livestream-chatbot) to see usage examples. 

## Donations

Thanks for the support!

 - `Zachary Nawrocki`: Love your videos. I've been working on a chat bot for my personal home assistant project, and these ideas have given me some inspiration. Thanks.