const mongoose = require("mongoose");

const categorySchema = mongoose.Schema({
	categoryName: String,
});

exports.Category = mongoose.model("order", categorySchema);
