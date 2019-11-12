class AbstractStream {
    constructor() {
        this.listeners = []
    }

    listen() {
        throw new Error("Unimplemented")
    }

    addMessageHandler(handler) {
        if (!this.listeners.includes(handler)) {
            this.listeners.push(handler)
        }
    }

    removeMessageHandler(handler) {
        listeners = this.listeners.filter(l => l !== handler)
    }

    notifyListeners(message, publisher, ctx) {
        const extraCtx = ctx || {}
        const defaultCtx = { streamType: this.constructor.name }
        this.listeners.forEach(l =>
            l(message, publisher, { ...defaultCtx, ...extraCtx })
        )
    }
}

class AbstractTargetedMessagePublisher {
    sendMessage(message) {
        throw new Error("Unimplemented")
    }
}

module.exports = {
    AbstractStream,
    AbstractTargetedMessagePublisher
}
