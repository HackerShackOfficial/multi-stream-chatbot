// messageParser.js

class MessageParser {
  parseCommand(message) {
    const trimmedMessage = message.trim();
    const command = trimmedMessage.split(" ")[0];
    return command;
  }
}

module.exports = MessageParser;
