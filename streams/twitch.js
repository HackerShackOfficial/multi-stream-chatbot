const stream = require("./stream");
const tmi = require("tmi.js");
const MessageFormatter = require("../util/messageFormatter");

TWITCH_MAX_MESSAGE_LENGTH = 500;

class TwitchTargetedMessagePublisher extends stream.AbstractTargetedMessagePublisher {
  constructor(client, target) {
    super();

    this.client = client;
    this.target = target;
  }

  sendMessage(message) {
    MessageFormatter.createMessageParts(
      message,
      TWITCH_MAX_MESSAGE_LENGTH
    ).forEach(messagePart => {
      this.client.say(this.target, messagePart);
    });
  }
}

class TwitchStream extends stream.AbstractStream {
  constructor(twitchAuth, {customClientOpts = {}} = {}) {
    super();

    // Define configuration options
    const opts = {
      identity: {
        username: twitchAuth.botUsername,
        password: twitchAuth.oauthToken
      },
      channels: [twitchAuth.channel],
      ...clientOpts
    };

    // Bind class methods
    this.onMessageHandler = this.onMessageHandler.bind(this);
    this.onConnectedHandler = this.onConnectedHandler.bind(this);

    // Create a client with our options
    this.client = new tmi.client(opts);
    this.client.on("message", this.onMessageHandler);
    this.client.on("connected", this.onConnectedHandler);
  }

  listen() {
    this.client.connect();
  }

  onMessageHandler(target, context, msg, self) {
    // Ignore messages from the bot
    if (self) {
      return;
    }

    const publisher = new TwitchTargetedMessagePublisher(this.client, target);
    this.notifyListeners(msg, publisher);
  }

  onConnectedHandler(addr, port) {
    console.log(`* Connected to ${addr}:${port}`);
  }
}

module.exports = TwitchStream;
