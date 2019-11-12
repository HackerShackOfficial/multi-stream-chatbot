const ChatActionInterface = require("./chatActionInterface")

class AbstractMessageStrategy {
    matches(message, ctx) {
        return true
    }

    async getMessage(message, ctx) {
        if (this.matches(command, ctx)) {
            return this.makeMessage(message, ctx)
        }
    }

    async makeMessage(message, ctx) {
        throw new Error("Unimplemented")
    }
}

class AbstractStrategyBasedChatAction extends ChatActionInterface {
    constructor() {
        this.strategies = this.registerStrategies()
    }

    registerStrategies() {
        return []
    }

    async getMessage(message, ctx) {
        for (strategy of this.strategies) {
            const message = strategy.getMessage(message, ctx)

            if (message) {
                return message
            }
        }
    }
}

module.exports = {
    AbstractMessageStrategy,
    AbstractStrategyBasedChatAction
}
