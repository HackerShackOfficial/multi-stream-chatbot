const ChatActionInterface = require("./chatActionInterface");

class AbstractMessageStrategy {
  matches(message, ctx) {
    return true;
  }

  async getMessage(message, ctx) {
    if (this.matches(message, ctx)) {
      return this.makeMessage(message, ctx);
    }
  }

  async makeMessage(message, ctx) {
    throw new Error("Unimplemented");
  }
}

class AbstractStrategyBasedChatAction extends ChatActionInterface {
  constructor() {
    super()
    this.strategies = this.registerStrategies();
  }

  registerStrategies() {
    return [];
  }

  async getMessage(message, ctx) {
    for (const strategy of this.strategies) {
      const strategyMessage = await strategy.getMessage(message, ctx);

      if (strategyMessage) {
        return strategyMessage;
      }
    }
  }
}

module.exports = {
  AbstractMessageStrategy,
  AbstractStrategyBasedChatAction
};