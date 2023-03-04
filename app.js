require("express-async-errors");

const express = require("express");
const app = express();

const notFoundMiddleware = require("./middleware/not-found");
const errorMiddleware = require("./middleware/error-handler");
const connectDB = require("./db/connect");
const products = require("./routes/products");

// middleware
app.use(express.json());

// rootes

app.get("/", (req, res) => {
	res.send(
		"<h1> my store api </h1> <a href='/api/v1/products'>products route</a>"
	);
});

app.use("/api/v1/products", products);

// product route
app.use(notFoundMiddleware);
app.use(errorMiddleware);

const port = 3000;
// process.env.PORT || 3000
const start = async () => {
	try {
		await connectDB();
		app.listen(
			port,
			console.log(`The server is listening on port: ${port}`)
		);
	} catch (error) {
		console.log(error);
	}
};

start();
