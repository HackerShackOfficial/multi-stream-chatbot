const DummyStream = require("./dummy")
const TwitchStream = require("./twitch")
const YoutubeStream = require("./youtube")
const { AbstreamStream, AbstractTargetedMessagePublisher } = require("./stream")

module.exports = {
    DummyStream,
    TwitchStream,
    YoutubeStream,
    AbstreamStream,
    AbstractTargetedMessagePublisher
}
