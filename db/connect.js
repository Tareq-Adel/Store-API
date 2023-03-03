const mongoose = require("mongoose");

const connectDB = () => {
	mongoose.connect(
		"mongodb://127.0.0.1:27017/STORE-API",
		{
			useNewUrlParser: true,
			useCreateIndex: true,
			useFindAndModify: false,
			useUnifiedTopology: true,
		},
		() => console.log("connected")
	);
};

module.exports = connectDB;
