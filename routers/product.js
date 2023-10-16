const express = require("express");
const router = express.Router();
const { Product } = require("../models/product");

// APIs

// Get Product List

router.get("/", async (req, res) => {
	const productList = await Product.find();

	if (!productList) {
		res.status(500).json({ success: false });
	} else {
		res.send(productList);
	}
});

// Post products List
router.post("/", (req, res) => {
	const newProduct = new Product({
		name: req.body.name,
		image: req.body.image,
		price: req.body.price,

		countInStock: req.body.countInStock,
	});

	newProduct
		.save()
		.then((createdProduct) => {
			console.log(" product created !!");
			res.status(201).json(createdProduct);
		})
		.catch((error) => {
			res.status(500).json({
				error: error,
				success: false,
			});
		});
});

module.exports = router;
