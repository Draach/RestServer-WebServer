const { response } = require("express");
const Category = require("../models/category");

// const getCategoies - paginado - total - populate
const getCategories = async (req, res = response) => {
  const { limit = 10, offset = 0 } = req.query;
  const query = {status: true}

  const [total, categories] = await Promise.all([
    await Category.count(query),
    await Category.find(query).populate('user', 'name').skip(Number(offset)).limit(Number(limit)),
  ]);

  res.json({ total, categories });
};
// const getCategory - populate {}
const getCategory = async(req, res = response) => {

    const { id } = req.params;

    const category = await Category.findById(id);

    res.json(category);
}

// const updateCategory -
const putCategory = async(req, res = response) => {

    const { id } = req.params;
    const name = req.body.name.toUpperCase();


    const category = await Category.findByIdAndUpdate(id, {name})

    res.json(category);

}
// const removeCategory
const removeCategory = async(req, res = response) => {

    const { id } = req.params;

    const category = await Category.findByIdAndUpdate(id, {status: false});

    res.json(category);

}

const createCategory = async(req, res = response) => {
  const name = req.body.name.toUpperCase();

  const categoryDB = await Category.findOne({ name });

  if (categoryDB) {
    return res.status(400).json({
      msg: `Category ${name} already exists.`,
    });
  }

  // Generate data to save
  const data = {
    name,
    user: req.user._id,
  };

  const category = new Category(data);

  // Saves to db
  await category.save();

  res.status(201).json(category);
};

module.exports = {
  getCategories,
  getCategory,
  putCategory,
  createCategory,
  removeCategory
};
