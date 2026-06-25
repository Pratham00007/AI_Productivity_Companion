const User = require("../models/User");
const Task = require("../models/Task");

const { createTaskEvent } = require("../utils/calendar");

const {
  getLatestEmails,
  getEmailContent,
  getGmailClient,
} = require("../utils/gmail");

const { GoogleGenerativeAI } = require("@google/generative-ai");

// 🔥 IMPORTANT: env check
if (!process.env.GOOGLE_API_KEY) {
  throw new Error("GOOGLE_API_KEY is missing in .env file");
}

// Gemini init
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// ------------------------------
// Extract task from email using Gemini
// ------------------------------
const extractTaskFromEmail = async (text) => {
  const model = genAI.getGenerativeModel({
    model: "gemini-3.5-flash",
  });

  const prompt = `
You are an AI Productivity Assistant.

Analyze the email carefully.

Extract:

1. Main task title
2. Deadline
3. Priority
4. Category
5. Estimated preparation hours
6. Important topics/skills involved
7. Preparation plan

Allowed categories:

- Interview
- Assignment
- Exam
- Meeting
- Bill
- Project
- Application
- Personal
- General

Return ONLY valid JSON.

Format:

{
  "title": "",
  "deadline": "",
  "priority": "Low | Medium | High",
  "category": "",
  "estimatedHours": 0,

  "topics": [],

  "preparationPlan": [
    {
      "task": "",
      "daysBefore": 0
    }
  ]

  "resourceSuggestions": [
    {
      "title": "",
      "platform": "",
      "reason": ""
    }
  ]

}
Also suggest useful learning resources.

Resource types can be:

- YouTube
- Course
- Documentation
- Practice Platform

Return only resource names.
Do not generate URLs.

If email is not actionable return:

{
 "ignore": true
}

Ignore:

- promotions
- newsletters
- marketing emails
- discount offers
- social notifications
- OTP messages

Only create tasks for:

- interviews
- exams
- assignments
- meetings
- projects
- applications
- bills

Email:
${text}
`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const rawText = response.text();

  try {
    return JSON.parse(rawText);
  } catch (err) {
    console.log("❌ Gemini raw response:", rawText);
    throw new Error("Failed to parse Gemini response as JSON");
  }
};

const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const extractTaskWithOpenAI = async (text) => {
  const prompt = `
  You are an AI Productivity Assistant.

Analyze the email carefully.

Extract:

1. Main task title
2. Deadline
3. Priority
4. Category
5. Estimated preparation hours
6. Important topics/skills involved
7. Preparation plan

Allowed categories:

- Interview
- Assignment
- Exam
- Meeting
- Bill
- Project
- Application
- Personal
- General

Return ONLY valid JSON.

Format:

{
  "title": "",
  "deadline": "",
  "priority": "Low | Medium | High",
  "category": "",
  "estimatedHours": 0,

  "topics": [],

  "preparationPlan": [
    {
      "task": "",
      "daysBefore": 0
    }
  ]

  "resourceSuggestions": [
    {
      "title": "",
      "platform": "",
      "reason": ""
    }
  ]

}
Also suggest useful learning resources.

Resource types can be:

- YouTube
- Course
- Documentation
- Practice Platform

Return only resource names.
Do not generate URLs.
If email is not actionable return:

{
 "ignore": true
}

Ignore:

- promotions
- newsletters
- marketing emails
- discount offers
- social notifications
- OTP messages

Only create tasks for:

- interviews
- exams
- assignments
- meetings
- projects
- applications
- bills

Email:
${text}`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4.1-mini",

    temperature: 0.2,

    messages: [
      {
        role: "system",
        content: "Return ONLY valid JSON.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  const raw = completion.choices[0].message.content;

  return JSON.parse(raw);
};

// ------------------------------
// Main controller: scan emails
// ------------------------------
const scanEmails = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user || !user.accessToken) {
      return res.status(401).json({
        success: false,
        error: "No Gmail access token found",
      });
    }

    // Get emails
    const messages = await getLatestEmails(user.accessToken);
    const gmail = getGmailClient(user.accessToken);

    let tasks = [];

    for (let msg of messages) {
      const existingTask = await Task.findOne({
        sourceEmailId: msg.id,
      });

      if (existingTask) {
        continue;
      }
      try {
        // email content fetch
        const content = await getEmailContent(gmail, msg.id);

        // AI extraction
        let task;

        try {
          task = await extractTaskFromEmail(content);
          if (task.deadline) {

  const parsed =
    new Date(
      task.deadline
    );

  const currentYear =
    new Date()
      .getFullYear();

  if (
    parsed.getFullYear() <
    currentYear
  ) {

    parsed.setFullYear(
      currentYear
    );

    task.deadline =
      parsed.toISOString();
  }

}
        } catch (geminiError) {
          console.log("⚠ Gemini Failed, using OpenAI...");

          task = await extractTaskWithOpenAI(content);
          if (task.deadline) {

  const parsed =
    new Date(
      task.deadline
    );

  const currentYear =
    new Date()
      .getFullYear();

  if (
    parsed.getFullYear() <
    currentYear
  ) {

    parsed.setFullYear(
      currentYear
    );

    task.deadline =
      parsed.toISOString();
  }

}
        }

        // skip if no task detected
        if (!task || !task.title) continue;

if (task.ignore) {

  console.log(
    "Ignored email"
  );

  continue;
}

        // save to DB
        const savedTask = await Task.create({
          title: task.title,

          deadline: task.deadline,

          priority: task.priority,

          category: task.category,

          estimatedHours: task.estimatedHours,

          topics: task.topics || [],

          preparationPlan: task.preparationPlan || [],

          resourceSuggestions: task.resourceSuggestions || [],
          

          sourceEmailId: msg.id,

          userId: user._id,
        });
        if (task.deadline) {
          try {
            const event = await createTaskEvent(user, savedTask);

            savedTask.calendarEventId = event.id;

            await savedTask.save();

            console.log("✅ Calendar Event Created");
          } catch (error) {
            console.log("❌ Calendar Error:", error.message);
          }
        }

        tasks.push(savedTask);
      } catch (err) {
        console.log("⚠️ Email skipped:", err.message);
      }
    }

    return res.json({
      success: true,
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    console.log("❌ scanEmails error:", error);
    return res.status(500).json({
      success: false,
      error: "Server error while scanning emails",
    });
  }
};

module.exports = {
  scanEmails,
};
