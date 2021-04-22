const { response } = require("express");
const { ObjectId } = require("mongoose").Types;

const { User, Category, Product } = require("../models");

const allowedCollections = ["categories", "products", "roles", "users"];

const searchUsers = async (term = "", res = response) => {
  const isMongoID = ObjectId.isValid(term);

  if (isMongoID) {
    const user = await User.findById(term);
    return res.json({
      results: user ? [user] : [],
    });
  }

  const regexp = new RegExp(term, "i");

  const users = await User.find({
    $or: [{ name: regexp }, { email: regexp }],
    $and: [{ status: true }],
  });

  res.json({
    results: users,
  });
};

const searchCategories = async (term = "", res = response) => {
  const isMongoID = ObjectId.isValid(term);

  if (isMongoID) {
    const category = await Category.findById(term);
    return res.json({
      results: category ? [category] : [],
    });
  }

  const regexp = new RegExp(term, "i");

  const categories = await Category.find({
    name: regexp,
    status: true,
  });

  res.json({
    results: categories,
  });
};

const searchProducts = async( term = '', res = response) => {

    const isMongoID = ObjectId.isValid(term);

    if(isMongoID) {
        const product = await Product.findById(term).populate('category', 'name');
        return res.json({
            results: ( product ) ? [ product ] : []
        })
    }

    const regexp = new RegExp( term, 'i');

    const products = await Product.find({
        name: regexp,
        status: true
    }).populate('category', 'name');

    res.json({
        results: products
    })
}


const searchDB = (req, res = response) => {
  const { collection, term } = req.params;

  if (!allowedCollections.includes(collection)) {
    return res.status(400).json({
      msg: `Allowed collections are: ${allowedCollections}`,
    });
  }

  switch (collection) {
    case "categories":
        searchCategories(term, res);
      break;
    case "products":
        searchProducts(term, res);
      break;
    case "users":
      searchUsers(term, res);
      break;
    default:
      res.status(500).json({
        msg: "Forgot to make this search",
      });
  }
};

module.exports = {
  searchDB,
};
