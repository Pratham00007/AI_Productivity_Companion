const { google } = require("googleapis");

const createCalendarClient = (user) => {
  const oauth2Client =
    new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );

  oauth2Client.setCredentials({
    access_token: user.accessToken,
    refresh_token: user.refreshToken,
  });

  return google.calendar({
    version: "v3",
    auth: oauth2Client,
  });
};

const createTaskEvent = async (
  user,
  task
) => {
  const calendar =
    createCalendarClient(user);

  const deadline =
    new Date(task.deadline);

  const event = {
    summary: task.title,

    description: `Priority: ${task.priority}`,

    start: {
      dateTime:
        deadline.toISOString(),
      timeZone:
        "Asia/Kolkata",
    },

    end: {
      dateTime: new Date(
        deadline.getTime() +
          60 * 60 * 1000
      ).toISOString(),
      timeZone:
        "Asia/Kolkata",
    },

    reminders: {
      useDefault: false,

      overrides: [
        {
          method: "popup",
          minutes: 1440,
        },

        {
          method: "popup",
          minutes: 60,
        },
      ],
    },
  };

  const response =
    await calendar.events.insert({
      calendarId: "primary",
      requestBody: event,
    });

  return response.data;
};

const updateTaskEvent = async (user, eventId, task) => {
  const calendar = createCalendarClient(user);

  const updatedEvent = {
    summary: task.title,
    description: `Priority: ${task.priority}`,
    start: {
      dateTime: new Date(task.deadline).toISOString(),
      timeZone: "Asia/Kolkata",
    },
    end: {
      dateTime: new Date(
        new Date(task.deadline).getTime() + 60 * 60 * 1000
      ).toISOString(),
      timeZone: "Asia/Kolkata",
    },
  };

  await calendar.events.update({
    calendarId: "primary",
    eventId,
    requestBody: updatedEvent,
  });
};

module.exports = {
  createTaskEvent,
  updateTaskEvent,
};
