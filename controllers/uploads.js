const path = require("path");
const fs = require("fs");

const cloudinary = require("cloudinary").v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const { response } = require("express");
const { fileUpload } = require("../helpers");
const { User, Product } = require("../models");

const loadFiles = async (req, res = response) => {
  try {
    // txt, md
    //const name = await fileUpload(req.files, ["txt", "md"], 'texts');

    // imgs
    const name = await fileUpload(req.files, undefined, "imgs");

    res.json({
      name,
    });
  } catch (msg) {
    res.status(400).json({ msg });
  }
};

const imgUpdate = async (req, res = response) => {
  const { id, collection } = req.params;

  let model;

  switch (collection) {
    case "users":
      model = await User.findById(id);
      if (!model) {
        return res.status(400).json({
          msg: `User ID ${id} does not exists.`,
        });
      }
      break;
    case "products":
      model = await Product.findById(id);
      if (!model) {
        return res.status(400).json({
          msg: `Product ID ${id} does not exists.`,
        });
      }
      break;

    default:
      return res.status(500).json({ msg: "Forgot to validate this" });
  }

  if (model.img) {
    // Delete img from server
    const imagePath = path.join(__dirname, "../uploads", collection, model.img);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
  }

  const imgName = await fileUpload(req.files, undefined, collection);
  model.img = imgName;

  await model.save();

  res.json(model);
};

const imgShow = async (req, res = response) => {
  const { id, collection } = req.params;

  let model;

  switch (collection) {
    case "users":
      model = await User.findById(id);
      if (!model) {
        return res.status(400).json({
          msg: `User ID ${id} does not exists.`,
        });
      }
      break;
    case "products":
      model = await Product.findById(id);
      if (!model) {
        return res.status(400).json({
          msg: `Product ID ${id} does not exists.`,
        });
      }
      break;

    default:
      return res.status(500).json({ msg: "Forgot to validate this" });
  }

  if (model.img) {
    // Delete img from server
    const imagePath = path.join(__dirname, "../uploads", collection, model.img);
    if (fs.existsSync(imagePath)) {
      return res.sendFile(imagePath);
    }
  }

  const imagePath = path.join(__dirname, "../assets/no-image.jpg");
  res.sendFile(imagePath);
};

const imgUpdateCloudinary = async (req, res = response) => {
  const { id, collection } = req.params;

  let model;

  switch (collection) {
    case "users":
      model = await User.findById(id);
      if (!model) {
        return res.status(400).json({
          msg: `User ID ${id} does not exists.`,
        });
      }
      break;
    case "products":
      model = await Product.findById(id);
      if (!model) {
        return res.status(400).json({
          msg: `Product ID ${id} does not exists.`,
        });
      }
      break;

    default:
      return res.status(500).json({ msg: "Forgot to validate this" });
  }

  if (model.img) {
    const nameArr = model.img.split('/');
    const name = nameArr[nameArr.length - 1];
    const [ public_id ] =name.split('.');

    cloudinary.uploader.destroy(public_id);

  }

  const { tempFilePath } = req.files.file;
  const { secure_url } = await cloudinary.uploader.upload(tempFilePath);

  model.img = secure_url;

  await model.save();

  res.json(model);
};

module.exports = {
  loadFiles,
  imgUpdate,
  imgShow,
  imgUpdateCloudinary,
};
