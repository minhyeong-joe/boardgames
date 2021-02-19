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

// Middlewares
const app = express();
const server = http.createServer(app);
const io = socketio(server, {
	cors: {
		origin: "http://localhost:3000",
		credentials: true,
	},
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

app.use(
	session({
		secret: "secret_key",
		resave: false,
		saveUninitialized: true,
		cookie: {
			maxAge: 24 * 60 * 60 * 1000,
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
const roomRoute = require("./routes/rooms");
app.use("/api/users", userRoute);
app.use("/api/rooms", roomRoute);

// socketio
require("./sockets/test")(io);

server.listen(PORT, () => {
	console.log(`Server running on Port ${PORT}`);
});
