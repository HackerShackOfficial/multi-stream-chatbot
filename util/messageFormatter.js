// messageFormatter.js

class MessageFormatter {
	static createMessageParts(str, maxLength) {
		var partIndex = 0
		var currentPart = ''

		const tokensSplitBySpaces = str.split(' ')

		return tokensSplitBySpaces.reduce((acc, token) => {
			if (token.length > maxLength) {
				throw new Error(`Message part was longer than maxLength: ${maxLength}`)
			}
			else if ((currentPart.length + token.length) > maxLength) {
				currentPart = ''
				partIndex++
			} else {
				currentPart += ' '
			}

			currentPart = currentPart + token
			acc[partIndex] = currentPart
			return acc
		}, [])
	}
}

module.exports = MessageFormatter