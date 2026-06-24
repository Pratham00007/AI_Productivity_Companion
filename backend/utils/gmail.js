const { google } = require("googleapis");

const getGmailClient = (accessToken) => {
  const oauth2Client = new google.auth.OAuth2();

  oauth2Client.setCredentials({
    access_token: accessToken,
  });

  return google.gmail({
    version: "v1",
    auth: oauth2Client,
  });
};

const getLatestEmails = async (accessToken) => {
  const gmail = getGmailClient(accessToken);

  const res = await gmail.users.messages.list({
    userId: "me",
    maxResults: 5,
  });

  return res.data.messages || [];
};

const getEmailContent = async (gmail, messageId) => {
  const res = await gmail.users.messages.get({
    userId: "me",
    id: messageId,
  });

  const payload = res.data.payload;

  let body = "";

  if (payload.parts) {
    body = payload.parts
      .map((p) =>
        Buffer.from(
          p.body.data || "",
          "base64"
        ).toString("utf-8")
      )
      .join(" ");
  }

  return body;
};

module.exports = {
  getLatestEmails,
  getEmailContent,
  getGmailClient,
}; 