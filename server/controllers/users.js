const mongoose = require("mongoose");
const User = require("../models/user");
const passport = require("passport");
const bcrypt = require("bcrypt");

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
		res.json({ success: false, message: "Username already in use" });
		return;
	}
	const hashedPassword = bcrypt.hashSync(user.password, 10);
	user.password = hashedPassword;
	const newUser = new User(user);
	try {
		await newUser.save();
		res.status(201).json({ success: true, newUser });
	} catch (error) {
		res.status(409).json({ message: error.message });
	}
};

// authenticate a user
const authenticateUser = (req, res, next) => {
	passport.authenticate("local", (err, user, info) => {
		if (err) throw err;
		if (!user) res.json({ success: false, message: info.message });
		else {
			req.logIn(user, (err) => {
				if (err) throw err;
				const { password, __v, ...userInfo } = req.user._doc;
				res.status(200).json({
					success: true,
					token: req.session.passport.user,
					userInfo: userInfo,
				});
			});
		}
	})(req, res, next);
};

// get loggedIn User
const getLoggedInUser = (req, res) => {
	if (req.user) {
		res.json({
			isLoggedIn: true,
			userId: req.user._id,
			username: req.user.username,
		});
	} else {
		res.json({ isLoggedIn: false });
	}
};

const logoutUser = (req, res) => {
	req.logOut();
	// req.session.destroy((err) => {
	// 	res.clearCookie("connect.sid");
	// });
	res.json({ isLoggedIn: false });
};

module.exports = {
	getUsers,
	createUser,
	authenticateUser,
	getLoggedInUser,
	logoutUser,
};
