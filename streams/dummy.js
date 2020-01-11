const stream = require("./stream")

class DummyTargetedMessagePublisher extends stream.AbstractTargetedMessagePublisher {
    sendMessage(message) {
        console.log(`DummyStream output: ${message}`)
    }
}

class DummyStream extends stream.AbstractStream {
    constructor({ command, interval_ms = 5000 }) {
        super()
        this.command = command
        this.interval_ms = interval_ms
        this.getChatMessage = this.getChatMessage.bind(this)
    }

    listen() {
        this.interval = setInterval(this.getChatMessage, this.interval_ms)
        console.log(`* Initialized DummyStream`)
    }

    getChatMessage() {
        this.notifyListeners(this.command, new DummyTargetedMessagePublisher())
    }
}

module.exports = DummyStream
