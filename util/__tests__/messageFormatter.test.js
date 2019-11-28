const MessageFormatter = require("../messageFormatter")

describe("MessageFormatter", () => {
    it("should return original message if maxlength longer than message length", () => {
        const originalMessage = "test message"
        const results = MessageFormatter.createMessageParts(
            originalMessage,
            1000
        )
        expect(results.length).toEqual(1)
        expect(results[0]).toEqual(originalMessage)
    })

    it("should split into multiple parts at the space", () => {
        const originalMessage = "test message with multiple spaces"
        const results = MessageFormatter.createMessageParts(originalMessage, 10)
        expect(results.length).toEqual(5)
        expect(results[0]).toEqual("test")
        expect(results[1]).toEqual("message")
        expect(results[2]).toEqual("with")
        expect(results[3]).toEqual("multiple")
        expect(results[4]).toEqual("spaces")
    })

    it("should throw error if word is longer than maxlength", () => {
        const originalMessage = "test message"
        expect(() =>
            MessageFormatter.createMessageParts(originalMessage, 4)
        ).toThrow()
    })
})
