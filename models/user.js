// Require Mongoose

const mongoose = require("mongoose");

// Create User Schema

const userSchema = mongoose.Schema({
	name: {
		type: String,
		required: [true, "user name is required"],
	},
	age: {
		type: Number,
		require: [true, "user age is required"],
	},
});

exports.User = mongoose.model("User", userSchema);
