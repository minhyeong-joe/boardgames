const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const dotenv = require("dotenv");
dotenv.config();
console.log(`Current Environment: ${process.env.NODE_ENV}`);

let origin_url;
// frontend URL in different environments
if (process.env.NODE_ENV == "development") {
	origin_url = "http://localhost:3000";
} else if (process.env.NODE_ENV == "production") {
	origin_url = "https://family-board-game.herokuapp.com";
}

// Middlewares
const app = express();
const server = http.createServer(app);
const io = socketio(server, {
	cors: {
		origin: origin_url,
		credentials: true,
	},
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cors({ origin: origin_url, credentials: true }));

app.use(
	session({
		secret: process.env.SESSION_SECRET_KEY,
		resave: false,
		saveUninitialized: true,
		cookie: {
			maxAge: 24 * 60 * 60 * 1000, // 24 hours
		},
	})
);

// Passport Config
app.use(passport.initialize());
app.use(passport.session());
require("./passport")(passport);

const PORT = process.env.PORT || 80;

// Database Connection
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

// API routes
const userRoute = require("./routes/users");
app.use("/api/users", userRoute);

// socketio
require("./sockets/core")(io);

server.listen(PORT, () => {
	console.log(`Server running on Port ${PORT}`);
});
