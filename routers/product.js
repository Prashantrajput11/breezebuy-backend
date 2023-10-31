const express = require("express");
const router = express.Router();
const { Product } = require("../models/product");
const { Category } = require("../models/category");

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

// Get product by id

router.get(`/:id`, async (req, res) => {
	const product = await Product.findById(req.params.id).populate("category");
	console.log(product);
	if (!product) {
		res.status(500).json({ success: false });
	} else {
		res.send(product);
	}
});

// Post products List
router.post("/", async (req, res) => {
	const category = await Category.findById(req.body.category);

	if (!category) {
		return res.status(400).send("invalid category");
	}
	// Create a new product instance using data from the request body
	let newProduct = new Product({
		name: req.body.name,
		description: req.body.description,
		richDescription: req.body.richDescription,
		image: req.body.image,
		brand: req.body.brand,
		price: req.body.price,
		category: req.body.category,
		countInStock: req.body.countInStock,
		rating: req.body.rating,

		isFeatured: req.body.isFeatured,
	});

	// Save the new product to the database
	try {
		// The result is stored in the "newProduct" variable
		newProduct = await newProduct.save();

		if (!newProduct) {
			// If the new product couldn't be saved, return a 400 (Bad Request) status
			res.status(400);
			throw new Error("Please add a product");
		}

		// If the product is successfully saved, return a 200 (OK) status along
		//with the JSON representation of the new product
		res.status(200).json(newProduct);
	} catch (error) {
		// Handle any errors that occur during the save operation

		res.status(500).json({ error: error });
	}
});

// Update Product API
router.put("/:id", async (req, res) => {
	// Validate Category
	const category = await Category.findById(req.body.category);
	if (!category) {
		return res.status(400).send("invalid category");
	}

	// Get product Id from Req body
	let productId = req.params.id;

	const updateProduct = await Product.findByIdAndUpdate(
		productId,
		{
			name: req.body.name,
			description: req.body.description,
			richDescription: req.body.richDescription,
			image: req.body.image,
			brand: req.body.brand,
			price: req.body.price,
			category: req.body.category,
			countInStock: req.body.countInStock,
			rating: req.body.rating,
			isFeatured: req.body.isFeatured,
		},
		{ new: true }
	);

	// If category id not found

	if (!updateProduct) {
		res.status(500).send("product could not be updated");
	}

	res.send(updateProduct);
});

// Delete Product

// DELETE /products/:id - Delete a product by ID
router.delete("/:id", async (req, res) => {
	try {
		const productId = req.params.id;

		// Attempt to find the product by ID and remove it
		const result = await Product.findOneAndRemove({ _id: productId });

		if (result) {
			// Product found and removed successfully
			res.status(200).json({ message: "Product deleted successfully" });
		} else {
			// Product not found
			res.status(404).json({ message: "Product not found" });
		}
	} catch (error) {
		// Handle any errors, e.g., database connection issues
		res.status(500).json({ message: "Internal server error" });
	}
});
// Get  products Count api

router.get("/get/count", async (req, res) => {
	const productCount = await Product.countDocuments();

	if (!productCount) {
		res.status(500).json({ success: false });
	} else {
		res.send({ productCount: productCount });
	}
});

module.exports = router;
