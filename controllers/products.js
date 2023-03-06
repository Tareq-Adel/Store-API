const Product = require("../models/product");

const getAllProductsStatic = async (req, res) => {
	// throw new Error("testing async error");

	// const search = "a";
	const products = await Product.find({
		// name: {
		// 	$regex: search,
		// 	$options: "i",
		// },
		price: { $gt: 100 },
	})
		.sort("name")
		.select("name price")
		.limit(5)
		.skip(5);
	await res.status(201).json({ products, nbHits: products.length });
};

const getAllProducts = async (req, res) => {
	// throw new Error("testing async error");
	const { featured, company, name, sort, feilds, numericFilters } = req.query;
	const queryObject = {};
	if (featured) {
		queryObject.featured = featured === "true" ? true : false;
	}

	if (company) {
		queryObject.company = company;
	}
	if (name) {
		queryObject.name = { $regex: name, $options: "i" };
	}

	if (numericFilters) {
		const operatorMap = {
			">": "$gt",
			">=": "$gte",
			"=": "$eq",
			"<": "$lt",
			"<=": "$lte",
		};

		const regEx = /\b(<|>|<=|>=|=)\b/g;
		let filters = numericFilters.replace(
			regEx,
			(match) => `-${operatorMap[match]}-`
		);
		filters = filters.split(",").forEach((item) => {
			const options = ["price", "rating"];
			const [field, operator, value] = item.split("-");
			if (options.includes(field)) {
				queryObject[field] = { [operator]: Number(value) };
			}
		});
	}

	let result = Product.find(queryObject);
	// sort
	if (sort) {
		const sortList = sort.split(",").join(" ");
		result = result.sort(sortList);
	} else {
		result = result.sort("createAt");
	}

	if (feilds) {
		const feildList = feilds.split(",").join(" ");
		result = result.select(feildList);
	}

	const page = Number(req.query.page);
	const limit = Number(req.query.limit);
	const skip = (page - 1) * limit;

	result = result.skip(skip).limit(limit);

	const products = await result;

	await res.status(201).json({ products, nbHits: products.length });
};

module.exports = { getAllProducts, getAllProductsStatic };
