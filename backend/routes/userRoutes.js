const express = require("express");
const router = express.Router();
const { getUsers } = require("../controllers/userController");
const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

router.get("/", auth, admin, getUsers);

module.exports = router;
