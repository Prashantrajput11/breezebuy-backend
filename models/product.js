// Require Mongoose
const mongoose = require("mongoose");

// Products Schema
const productSchema = mongoose.Schema({
	name: {
		type: String,
		required: [true, "Product must have  a name"],
	},

	price: Number,
	image: String,
	countInStock: Number,
});

// Model
exports.Product = mongoose.model("Product", productSchema);
