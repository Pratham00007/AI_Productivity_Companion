const express = require("express");

const User = require("../models/user");

const router = express.Router();

router.get("/create-user", async (req, res) => {
  const user = await User.create({
    name: "Rahul",
    email: "rahul@gmail.com",
  });

  res.json(user);
});

module.exports = router;