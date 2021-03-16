const express = require("express");
const passport = require("passport");
const {
	getUsers,
	createUser,
	authenticateUser,
	getLoggedInUser,
	logoutUser,
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
router.post("/login", authenticateUser);

// GET /api/users/auth
// Get logged-in user's info (or isLoggedIn:false if not logged in)
router.get("/auth", getLoggedInUser);

router.post("/logout", logoutUser);

module.exports = router;
