const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");

const User = require("./models/user");

module.exports = function (passport) {
	passport.use(
		new LocalStrategy((username, password, done) => {
			// Match user
			User.findOne(
				{
					username: username,
				},
				(err, user) => {
					// This is how you handle error
					if (err) return done(err);
					// When user is not found
					if (!user)
						return done(null, false, { message: "Username does not exist" });
					// When password is not correct
					if (user.password !== password)
						return done(null, false, { message: "Incorrect password" });
					// When all things are good, we return the user
					return done(null, user);
				}
			);
		})
	);

	passport.serializeUser((user, done) => {
		done(null, user.id);
	});

	passport.deserializeUser((id, done) => {
		User.findById(id, (err, user) => {
			done(err, user);
		});
	});
};
