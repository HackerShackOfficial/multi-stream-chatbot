const TwitchStream = require("../twitch")
const TwitchAuth = require("../../auth/twitch")

const getMockAuth = () =>
    new TwitchAuth({ oauthToken: "", botUsername: "", channel: "" })

describe("TwitchStream", () => {
    it("should raise an error if twitchAuth is not defined", () => {
        expect(() => new TwitchStream()).toThrow()
    })

    it("should call client.connect", () => {
        const mockClient = { connect: jest.fn() }
        const auth = getMockAuth()
        const stream = new TwitchStream(auth)

        stream.client = mockClient
        stream.listen()

        expect(mockClient.connect.mock.calls.length).toBe(1)
    })

    it("should notify listeners", done => {
        const expectedMessage = "message"
        const listener = message => {
            expect(message).toEqual(expectedMessage)
            done()
        }

        const auth = getMockAuth()
        const stream = new TwitchStream(auth)
        stream.addMessageHandler(listener)

        stream.onMessageHandler("", {}, expectedMessage)
    })

    it("should use safe context", done => {
        const expectedMessage = "message"
        const listener = message => {
            expect(message).toEqual(expectedMessage)
            done()
        }

        const auth = getMockAuth()
        const stream = new TwitchStream(auth)
        stream.addMessageHandler(listener)

        stream.onMessageHandler("", null, expectedMessage)
    })

    it("should embed auther infor", done => {
        const expectedCtx = { username: "123", "display-name": "abc" }
        const listener = (message, publisher, ctx) => {
            expect(ctx.author.id).toEqual(expectedCtx.username)
            expect(ctx.author.displayName).toEqual(expectedCtx["display-name"])
            done()
        }

        const auth = getMockAuth()
        const stream = new TwitchStream(auth)
        stream.addMessageHandler(listener)

        stream.onMessageHandler("", expectedCtx, "")
    })

    it("should not notify listeners if self", () => {
        const listener = message => {
            expect(0).toBe(1)
        }

        const auth = getMockAuth()
        const stream = new TwitchStream(auth)
        stream.addMessageHandler(listener)

        stream.onMessageHandler("", {}, "", true)
    })
})
