const ActionSwitcher = require("../actions/actionSwitcher")

class StreamBot {
    constructor({ streams = [], actions = [], config = {} }) {
        this.messageHandler = this.messageHandler.bind(this)

        this.streams = streams
        this.streams.forEach(s => s.addMessageHandler(this.messageHandler))

        this.actionSwitcher = new ActionSwitcher(actions, {
            blacklisted: config.blacklistedActions
        })
    }

    start() {
        this.streams.forEach(s => s.listen())
        console.log("* StreamBot is listening")
    }

    async messageHandler(message, publisher, ctx) {
        const trimmedMessage = message.trim()
        const messages = await this.actionSwitcher.getMessages(
            trimmedMessage,
            ctx
        )
        messages.forEach(m => publisher.sendMessage(m))
    }
}

module.exports = StreamBot
