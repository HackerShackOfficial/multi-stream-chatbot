const stream = require("./stream");
const file = require("../util/file");
const google = require("googleapis").google;
const MessageFormatter = require("../util/messageFormatter");

YOUTUBE_MAX_MESSAGE_LENGTH = 200;

class YoutubeTargetedMessagePublisher extends stream.AbstractTargetedMessagePublisher {
  constructor(youtube, youtubeAuth, chatId) {
    super();

    this.youtube = youtube;
    this.youtubeAuth = youtubeAuth;
    this.chatId = chatId;
  }

  sendMessage(message) {
    MessageFormatter.createMessageParts(
      message,
      YOUTUBE_MAX_MESSAGE_LENGTH
    ).forEach(messagePart => {
      const chatMessage = this.buildChatMessage(messagePart);
      this.youtube.liveChatMessages.insert(
        chatMessage,
        this.handleInsertResponse
      );
    });
  }

  buildChatMessage(message) {
    return {
      auth: this.youtubeAuth.getAuth(),
      part: "snippet",
      resource: {
        snippet: {
          type: "textMessageEvent",
          liveChatId: this.chatId,
          textMessageDetails: {
            messageText: message
          }
        }
      }
    };
  }

  handleInsertResponse(err, resp) {
    if (err) {
      console.log("* Error sending message to youtube stream");
      console.log(err.errors);
    }
  }
}

class YoutubeStream extends stream.AbstractStream {
  constructor(youtubeAuth, { pollrate = 5000 } = {}) {
    super();

    this.pollrate = pollrate;
    this.pageToken = undefined;
    this.startTime = new Date();
    this.youtubeAuth = youtubeAuth;
    this.youtube = google.youtube("v3");

    this.getChatMessages = this.getChatMessages.bind(this);

    this.setup();
  }

  listen() {
    this.interval = setInterval(this.getChatMessages, this.pollrate);
  }

  async setup() {
    await this.youtubeAuth.checkTokens();
    await this.getLatestChat();
  }

  async getLatestChat() {
    const request = this.buildListLiveBroadcastsRequest();
    const response = await this.youtube.liveBroadcasts.list(request);

    const latestChat = response.data.items[0];
    this.chatId = latestChat.snippet.liveChatId;
    this.chatName = latestChat.snippet.title;

    console.log(`* Connected to Youtube for chat: "${this.chatName}"`);
  }

  buildListLiveBroadcastsRequest() {
    return {
      auth: this.youtubeAuth.getAuth(),
      part: "snippet",
      mine: "true"
    };
  }

  async getChatMessages() {
    if (!this.chatId) {
      return;
    }

    const request = this.buildListChatMessagesRequest();

    const response = await this.youtube.liveChatMessages.list(request);
    const data = response.data;
    const newMessages = data.items;
    this.pageToken = data.nextPageToken;

    if (newMessages.length <= 0) {
      return;
    }

    const publisher = new YoutubeTargetedMessagePublisher(
      this.youtube,
      this.youtubeAuth,
      this.chatId
    );

    newMessages.forEach(chatMessage => {
      this.notifyListenerIfNeeded(chatMessage, publisher);
    });
  }

  buildListChatMessagesRequest() {
    return {
      auth: this.youtubeAuth.getAuth(),
      part: "snippet",
      liveChatId: this.chatId,
      pageToken: this.pageToken
    };
  }

  notifyListenerIfNeeded(chatMessage, publisher) {
    const snippet = chatMessage.snippet;
    const publishedAt = new Date(snippet.publishedAt);

    if (publishedAt <= this.startTime) {
      return;
    }

    if (snippet.type === "textMessageEvent") {
      const messageText = snippet.textMessageDetails.messageText
        .split(String.fromCharCode(8203))
        .join("");
      this.notifyListeners(messageText, publisher);
    } else if (snippet.type == "superChatEvent") {
      const value = parseInt(snippet.superChatDetails.amountMicros);
      const messageText = snippet.superChatDetails.userComment
        .split(String.fromCharCode(8203))
        .join("");
      this.notifyListeners(messageText, publisher, {
        superChat: true,
        value
      });
    }
  }
}

module.exports = YoutubeStream;
