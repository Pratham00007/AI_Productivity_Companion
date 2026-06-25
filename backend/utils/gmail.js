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

  q: "category:primary newer_than:30d"
});

  return res.data.messages || [];
};

const getEmailContent = async (
  gmail,
  messageId
) => {

  const res =
    await gmail.users.messages.get({
      userId: "me",
      id: messageId,
    });

  const extractText = (parts) => {

    let text = "";

    for (const part of parts) {

      if (
        part.mimeType === "text/plain" &&
        part.body?.data
      ) {

        text += Buffer.from(
          part.body.data,
          "base64"
        ).toString("utf8");

      }

      if (part.parts) {

        text += extractText(
          part.parts
        );

      }

    }

    return text;
  };

  const payload =
    res.data.payload;

  if (payload.parts) {
    return extractText(
      payload.parts
    );
  }

  return "";
};

module.exports = {
  getLatestEmails,
  getEmailContent,
  getGmailClient,
}; 