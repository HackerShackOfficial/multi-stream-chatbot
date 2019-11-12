const file = require("../util/file");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

// Permissions needed to view and submit live chat comments
const DEFAULT_SCOPE = [
  "https://www.googleapis.com/auth/youtube.readonly",
  "https://www.googleapis.com/auth/youtube",
  "https://www.googleapis.com/auth/youtube.force-ssl"
];

class YoutubeAuth {
  constructor({
    clientId,
    clientSecret,
    redirectURI,
    tokenFilePath,
    scope = DEFAULT_SCOPE
  }) {
    this.updateTokens = this.updateTokens.bind(this);

    this.auth = new OAuth2(clientId, clientSecret, redirectURI);
    this.auth.on("tokens", this.updateTokens);

    this.scope = scope;
    this.tokenFilePath = tokenFilePath;
  }

  getAuth() {
    return this.auth;
  }

  updateTokens(tokens) {
    if (tokens.refresh_token) {
      file.save(this.tokenFilePath, JSON.stringify(this.auth.tokens));
    }
  }

  getCode(response) {
    const authUrl = this.auth.generateAuthUrl({
      access_type: "offline",
      scope: this.scope
    });

    response.redirect(authUrl);
  }

  async getTokensWithCode(code) {
    const credentials = await this.auth.getToken(code);
    await this.authorize(credentials);
  }

  async authorize({ tokens }) {
    this.auth.setCredentials(tokens);
    await file.save(this.tokenFilePath, JSON.stringify(tokens));
  }

  async checkTokens() {
    const tokens = await file.read(this.tokenFilePath);
    if (tokens) {
      this.auth.setCredentials(tokens);
    } else {
      throw new Error("No tokens set for Youtube OAuth");
    }
  }
}

module.exports = YoutubeAuth;
