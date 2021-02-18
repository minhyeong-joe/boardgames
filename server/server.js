const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.use(passport.initialize());
app.use(passport.session());
require("./passport")(passport);

const PORT = process.env.PORT || 80;

mongoose
	.connect(process.env.DB_CONN, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
	})
	.then((conn) =>
		console.log(
			`Connected to MongoDB - Database: ${conn.connection.db.databaseName}`
		)
	)
	.catch((err) => console.log(err));

const userRoute = require("./routes/users");

app.use("/api/users", userRoute);

app.listen(PORT, () => {
	console.log(`Server running on Port ${PORT}`);
});
