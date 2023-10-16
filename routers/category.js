const { Category } = require("../models/category");

const express = require("express");
const router = express.Router();

// Get Categories
router.get("/", async (req, res) => {
	const categoryList = await Category.find();

	if (!categoryList) {
		res.status(500).json({ success: false });
	} else {
		res.send(categoryList);
	}
});

// Post Category
router.post("/", async (req, res) => {
	let category = new Category({
		name: req.body.name,
		icon: req.body.icon,
		color: req.body.color,
	});

	category = await category.save();

	if (!category) {
		res.status(404).send("category could not be created!!");
	}

	res.send(category);
});

// Delete Category By Id
router.delete("/:id", async (req, res) => {
	try {
		// Get id and delete
		let categoryId = req.params.id;
		const category = await Category.findByIdAndRemove(categoryId);
		if (category) {
			// category found and deleted
			res
				.status(200)
				.json({ success: true, message: "category deleted succesfully" });
		} else {
			// if category does not exist
			return res
				.status(404)
				.json({ success: false, message: " catgeory does not exist" });
		}
	} catch (error) {
		return res.status(400).json({ success: false, error: error.message });
	}
});

// Export
module.exports = router;
