var ChatActionInterface = require("./chatActionInterface")

class AbstractSimpleChatAction extends ChatActionInterface {
    matchesCommand(message, ctx) {
        return true
    }

    async getMessage(message, ctx) {
        if (this.matchesCommand(message, ctx)) {
            const message = await this.makeMessage(message, ctx)
            return message
        }
    }

    async makeMessage(message, ctx) {
        throw new Error("Unimplemented")
    }
}

module.exports = AbstractSimpleChatAction
