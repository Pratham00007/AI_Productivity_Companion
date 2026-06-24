const express = require("express");
const router = express.Router();

const { scanEmails } = require("../controllers/emailController");

const auth = require("../middleware/auth");

// IMPORTANT: middleware add karo
router.get("/scan", auth, scanEmails);

module.exports = router;