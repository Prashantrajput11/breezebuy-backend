const { User } = require("../models/user");
const bcrypt = require("bcryptjs");
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

// @desc        Get users data
// @route       GET /api/users
// @access      Public
router.get("/", async (req, res) => {
	const userList = await User.find().select("-passwordHash");

	if (!userList) {
		res.status(500).json({ success: false });
	} else {
		res.send(userList);
	}
});

// @desc        Get a user data
// @route       GET /api/users
// @access      Public
router.get("/:id", async (req, res) => {
	try {
		let userId = req.params.id;
		const user = await User.findById(userId).select("-passwordHash");

		if (!user) {
			return res
				.status(500)
				.json({ message: "user with given id could not find" });
		} else {
			res.send(user);
		}
	} catch (error) {
		res.status(500).json({ message: "server encountered an error" });
	}
});

// @desc        Register a new user
// @route       POST /api/users
// @access      Public
router.post("/", async (req, res) => {
	const { name, email, password } = req.body;

	// Hash Password
	const salt = await bcrypt.genSalt(10);

	// get hashed password
	const hashPassword = await bcrypt.hash(password, salt);

	// check if name OR email OR password is empty
	if (!name || !email || !password) {
		return res.status(400).json({ error: "Please add all fields" });
	}

	// Check if user exist
	const userExist = await User.findOne({ email });

	if (userExist) {
		res.status(400).json({ message: "user already exist" });
	}

	// create user
	const user = await User.create({
		name,
		email,
		password: hashPassword,
	});

	if (!user) {
		res.status(400).json({ message: "user could not be created" });
	}

	res.status(200).json(user);
});

// @desc        Authenticate a user
// @route       POST /api/users/login
// @access      Public
router.post("/login", async (req, res) => {
	const { email, password } = req.body;

	// check if email is valid
	const user = await User.findOne({ email });
	const secret = process.env.secret;
	if (!user) {
		res.json({ message: "no user found" });
	}
	if (user && (await bcrypt.compare(password, user.password))) {
		const token = jwt.sign({ userId: user.id }, secret, { expiresIn: "1d" });
		res.status(200).json({
			user: user.email,
			token: token,
		});
	} else {
		res.status(401).json({ message: "Inavlid Credentials" });
	}
});

// @desc        Get user data
// @route       POST /api/users/me
// @access      Public
router.post("/me", async (req, res) => {
	res.json({ message: "user data" });
});

module.exports = router;
