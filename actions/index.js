// index.js
const ChatActionInterface = require('./chatActionInterface')
const MessageParser = require('./messageParser')
const AbstractSimpleChatAction = require('./simpleChatAction')
const {
	AbstractMessageStrategy,
	AbstractStrategyBasedChatAction
} = require('./strategyBasedChatAction')

module.exports = {
	ChatActionInterface,
	MessageParser,
	AbstractSimpleChatAction,
	AbstractMessageStrategy,
	AbstractStrategyBasedChatAction
}