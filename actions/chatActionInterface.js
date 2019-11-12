// chatActionInterface.py

class ChatActionInterface {
  async getMessage(message, ctx) {
    throw new Error("Unimplemented");
  }
}

module.exports = ChatActionInterface;
