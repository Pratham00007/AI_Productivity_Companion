const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
require("dotenv").config();

const app = express();
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

const emailRoutes = require("./routes/emailRoutes");

const connectDB = require("./config/db");

dotenv.config();

connectDB();



app.use(express.json());

app.get("/", (req, res) => {
  res.send("API Running");
});

const PORT = process.env.PORT || 5000;


const testRoutes = require("./routes/testRoutes");

app.use("/api/test", testRoutes);

const session =
require("express-session");

const passport =
require("passport");

require("./config/passport");

app.set("trust proxy", 1);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true,
      sameSite: "none",
    },
  })
);

app.use(passport.initialize());

app.use(passport.session());

const authRoutes =
require("./routes/authRoutes");

app.use("/auth", authRoutes);


app.use("/api/email", emailRoutes);


const taskRouter = require("./routes/taskrouter");

app.use("/api/tasks", taskRouter);


app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
