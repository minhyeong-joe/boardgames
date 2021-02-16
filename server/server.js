const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const app = express();

const PORT = process.env.PORT || 80;

mongoose
	.connect(process.env.DB_CONN, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
	})
	.then(() => console.log("Connected to MongoDB."))
	.catch((err) => console.log(err));

app.listen(PORT, () => {
	console.log(`Server running on Port ${PORT}`);
});
