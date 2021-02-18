const express = require("express");
const {
	getUsers,
	createUser,
	authenticateUser,
} = require("../controllers/users");

const router = express.Router();

// GET /api/users/
// Returns all users (without password field)
router.get("/", getUsers);

// POST /api/users/
// body: { username: String, password: String }
// Create a user
router.post("/", createUser);

// POST /api/users/auth
// body: { username: String, password: String }
// Authenticate a user using passport Local Strategy
router.post("/auth", authenticateUser);

module.exports = router;
