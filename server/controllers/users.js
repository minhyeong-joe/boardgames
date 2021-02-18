const mongoose = require("mongoose");
const User = require("../models/user");
const passport = require("passport");

// get all users
const getUsers = async (req, res) => {
	try {
		const users = await User.find().select("-password");
		res.status(200).json(users);
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

// add a user
const createUser = async (req, res) => {
	const user = req.body;
	const userExists = await User.findOne({ username: user.username });
	if (userExists) {
		res.status(409).json({ message: "Username already in use" });
		return;
	}
	const newUser = new User(user);
	try {
		await newUser.save();
		res.status(201).json(newUser);
	} catch (error) {
		res.status(409).json({ message: error.message });
	}
};

// authenticate a user
const authenticateUser = (req, res, next) => {
	passport.authenticate("local", (err, user, info) => {
		if (err) throw err;
		if (!user) res.json({ message: info.message });
		else {
			req.logIn(user, (err) => {
				if (err) throw err;
				res.status(200).json({ message: "Login Successful" });
				console.log(req.user);
			});
		}
	})(req, res, next);
};

module.exports = { getUsers, createUser, authenticateUser };
