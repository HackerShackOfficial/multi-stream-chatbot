// dummy.js
const stream = require("./stream");

class DummyTargetedMessagePublisher extends stream.AbstractTargetedMessagePublisher {
  sendMessage(message) {
    console.log(`DummyStream output: ${message}`);
  }
}

class DummyStream extends stream.AbstractStream {
  constructor(command) {
    super();
    this.command = command;
    this.getChatMessage = this.getChatMessage.bind(this);
  }

  listen() {
    this.interval = setInterval(this.getChatMessage, 5000);
    console.log(`* Initialized DummyStream`);
  }

  getChatMessage() {
    this.notifyListeners(this.command, new DummyTargetedMessagePublisher());
  }
}

module.exports = DummyStream;
