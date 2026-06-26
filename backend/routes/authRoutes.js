const express = require("express");

const passport = require("passport");
const User = require("../models/User");
const router = express.Router();

// login route

router.get(
  "/google",
passport.authenticate("google", {
  scope: [
    "profile",
    "email",
    "https://www.googleapis.com/auth/gmail.readonly",
    "https://www.googleapis.com/auth/calendar",
  ],

  accessType: "offline",

  prompt: "consent",
})
);

// callback route

router.get(
  "/google/callback",

  passport.authenticate(
    "google",
    {
      failureRedirect:
        "/login",
    }
  ),

  (req, res) => {

 res.redirect(process.env.FRONTEND_URL + "/dashboard");

}
);
router.get(
  "/me",
  async (req, res) => {
    try {

      if (!req.user) {
        return res.status(401).json({
          success: false,
        });
      }

      const user =
        await User.findById(
          req.user.id
        );

      res.json({
        success: true,
        user: {
          name: user.name,
          email: user.email,
        },
      });

    } catch (error) {

      res.status(500).json({
        success: false,
      });

    }
  }
);

module.exports = router;