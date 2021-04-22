const { request, response } = require("express");
const Product = require("../models/product");
const Category = require("../models/category");

const getProducts = async (req, res = response) => {
  const { limit = 20, offset = 0 } = req.query;
  const query = { status: true };

  const products = await Product.find()
    .skip(Number(offset))
    .limit(Number(limit))
    .populate("user", "name")
    .populate("category", "name");

  res.json(products);
};

const getProduct = async (req, res = response) => {
  const { id } = req.params;
  const product = await Product.findById(id);

  res.json(product);
};

const postProduct = async (req = request, res = response) => {
  const { price, description } = req.body;
  const name = req.body.name.toUpperCase();
  const category = req.body.category.toUpperCase();

  const [categoryDB, productDB] = await Promise.all([
    await Category.findOne({ name: category }),
    await Product.findOne({ name }),
  ]);

  console.log(categoryDB);
  console.log(name);
  if (productDB) {
    return res.status(400).json({
      msg: `Product ${name} already exists.`,
    });
  }

  // Generate data to save
  const data = {
    name,
    user: req.user._id,
    category: categoryDB.id,
    price,
    description,
  };

  const product = new Product(data);

  // Saves to db
  await product.save();

  res.status(201).json(product);
};

const putProduct = async (req = request, res = response) => {
  const { id } = req.params;

  const { ...rest } = req.body;

  const product = await Product.findByIdAndUpdate(id, rest);

  res.json(product);
};

const removeProduct = async (req, res = response) => {
  const { id } = req.params;

  const product = await Product.findByIdAndUpdate(id, { status: false });

  res.json(product);
};

module.exports = {
  getProducts,
  getProduct,
  putProduct,
  postProduct,
  removeProduct,
};
