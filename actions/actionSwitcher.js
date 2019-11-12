// actionSwitcher.js

class ActionSwitcher {
  constructor(actions, { blacklisted = [] }) {
    this.blacklisted = blacklisted;
    this.actions = actions;
  }

  async getMessages(message, ctx) {
    var messages = [];

    for (action of this.actions) {
      const generatedMessage = await action.getMessage(message, ctx);

      if (!generatedMessage) {
        continue;
      }

      const actionName = this.getActionName(action);

      if (this.isBacklisted(actionName)) {
        console.log(
          `* Streambot ignored blacklisted ${actionName} command "${message}"`
        );
      } else {
        messages.push(generatedMessage);
        console.log(
          `* Streambot executed ${actionName} command for "${message}"`
        );
      }
    }

    return messages;
  }

  getActionName(action) {
    return action.constructor.name;
  }

  isBacklisted(actionName) {
    if (!this.blacklisted) {
      return false;
    }
    return actionName && this.blacklisted.includes(actionName);
  }
}

module.exports = ActionSwitcher;
