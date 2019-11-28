const YoutubeStream = require("../youtube")

const getMockAuth = authData => ({
    checkTokens: jest.fn(),
    getAuth: jest.fn(() => authData)
})
const getMockYoutube = (chatId, chatTitle) => ({
    liveBroadcasts: {
        list: jest.fn(() => {
            return {
                data: {
                    items: [
                        {
                            snippet: {
                                liveChatId: chatId,
                                title: chatTitle
                            }
                        }
                    ]
                }
            }
        })
    }
})

describe("YoutubeStream", () => {
    it("should raise an error if twitchAuth is not defined", () => {
        expect(() => new YoutubeStream()).toThrow()
    })

    it("should call getlatestchat on setup", async () => {
        const expectedChatTitle = "test"
        const expectedChatId = "1"
        const auth = getMockAuth()
        const youtubeMock = getMockYoutube(expectedChatId, expectedChatTitle)
        const stream = new YoutubeStream(auth, { youtubeAPI: youtubeMock })

        await stream.setup()
        expect(stream.chatId).toEqual(expectedChatId)
        expect(stream.chatName).toEqual(expectedChatTitle)
    })

    it("should include auth in list liveBroadcasts", async () => {
        const expectedAuth = "auth"
        const auth = getMockAuth(expectedAuth)
        const youtubeMock = getMockYoutube()
        const stream = new YoutubeStream(auth, { youtubeAPI: youtubeMock })

        await stream.setup()
        expect(youtubeMock.liveBroadcasts.list.mock.calls[0][0].auth).toEqual(
            expectedAuth
        )
    })

    it("should notify listeners of text message", done => {
        const expectedMessage = "message"
        const listener = (message, publisher, ctx) => {
            expect(ctx.streamType).toEqual("YoutubeStream")
            expect(message).toEqual(expectedMessage)
            done()
        }

        const expectedAuth = "auth"
        const auth = getMockAuth(expectedAuth)
        const youtubeMock = getMockYoutube()
        const stream = new YoutubeStream(auth, { youtubeAPI: youtubeMock })
        stream.addMessageHandler(listener)

        stream.notifyListenerIfNeeded({
            snippet: {
                publishedAt: new Date(2100, 1, 1).toISOString(),
                type: "textMessageEvent",
                textMessageDetails: {
                    messageText: expectedMessage
                }
            }
        })
    })

    it("should notify listeners of superchat message", done => {
        const expectedMessage = "message"
        const expectedAmount = 1
        const listener = (message, publisher, ctx) => {
            expect(ctx.streamType).toEqual("YoutubeStream")
            expect(ctx.superChat).toBeTruthy()
            expect(ctx.value).toEqual(expectedAmount)
            expect(message).toEqual(expectedMessage)
            done()
        }

        const expectedAuth = "auth"
        const auth = getMockAuth(expectedAuth)
        const youtubeMock = getMockYoutube()
        const stream = new YoutubeStream(auth, { youtubeAPI: youtubeMock })
        stream.addMessageHandler(listener)

        stream.notifyListenerIfNeeded({
            snippet: {
                publishedAt: new Date(2100, 1, 1).toISOString(),
                type: "superChatEvent",
                superChatDetails: {
                    userComment: expectedMessage,
                    amountMicros: expectedAmount
                }
            }
        })
    })
})
