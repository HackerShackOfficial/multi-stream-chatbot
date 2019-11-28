const {
    AbstractStream,
    AbstractTargetedMessagePublisher
} = require("../stream")

describe("AbstractStream", () => {
    it("should register listeners", () => {
        const listener = () => {}
        const stream = new AbstractStream()
        stream.addMessageHandler(listener)
        expect(stream.listeners.includes(listener)).toBeTruthy()
    })

    it("should remove listeners", () => {
        const listener = () => {}
        const stream = new AbstractStream()
        stream.addMessageHandler(listener)
        expect(stream.listeners.includes(listener)).toBeTruthy()
        stream.removeMessageHandler(listener)
        expect(stream.listeners.includes(listener)).toBeFalsy()
    })

    it("should call listeners with message", done => {
        const expectedMessage = "message"
        const listener = message => {
            expect(message).toEqual(expectedMessage)
            done()
        }

        const stream = new AbstractStream()
        stream.addMessageHandler(listener)
        stream.notifyListeners(expectedMessage)
    })

    it("should call listeners with stream name", done => {
        const listener = (message, publisher, ctx) => {
            expect(ctx.streamType).toEqual("AbstractStream")
            done()
        }

        const stream = new AbstractStream()
        stream.addMessageHandler(listener)
        stream.notifyListeners("message")
    })

    it("should pass ctx from notifyListeners", done => {
        expectedCtx = { key: "value" }
        const listener = (message, publisher, ctx) => {
            expect(ctx.streamType).toEqual("AbstractStream")
            expect(ctx.key).toEqual(expectedCtx.key)
            done()
        }

        const stream = new AbstractStream()
        stream.addMessageHandler(listener)
        stream.notifyListeners("message", null, expectedCtx)
    })

    it("should pass publisher from notifyListeners", done => {
        expectedPublisher = "publisher"
        const listener = (message, publisher, ctx) => {
            expect(publisher).toEqual(expectedPublisher)
            done()
        }

        const stream = new AbstractStream()
        stream.addMessageHandler(listener)
        stream.notifyListeners("message", expectedPublisher)
    })
})
