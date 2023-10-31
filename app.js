const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv/config");
const morgan = require("morgan");

const api = process.env.API_URL;
const productsRouter = require("./routers/product");
const ordersRouter = require("./routers/order");
const categoriesRouter = require("./routers/category");
const usersRouter = require("./routers/user");

// Middleware stack
app.use(express.json());
app.use(morgan("tiny"));
app.use(`${api}/product`, productsRouter);
app.use(`${api}/order`, ordersRouter);
app.use(`${api}/category`, categoriesRouter);
app.use(`${api}/user`, usersRouter);

// Connect to DB
mongoose
	.connect(process.env.CONNECTION_STRING, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		dbName: "breezebuy",
	})
	.then(() => {
		console.log("succesfuly connected");
	})
	.catch((error) => {
		console.log("wrong", error);
	});
app.listen(3000, () => {
	console.log("running on local host");
});
