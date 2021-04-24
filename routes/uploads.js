const { Router } = require("express");
const { check } = require("express-validator");
const { loadFiles, imgUpdate, imgShow, imgUpdateCloudinary } = require("../controllers/uploads");
const { allowedCollections } = require("../helpers");
const { fileValidate } = require("../middlewares");

const { fieldValidate } = require("../middlewares/field-validate");

const router = Router();

router.get("/:collection/:id", [
  check("id", "Must be a MongoId").isMongoId(),
  check("collection").custom((c) =>
    allowedCollections(c, ["users", "products"])
  ),
  fieldValidate,
], imgShow);

router.post("/", fileValidate, loadFiles);

router.put(
  "/:collection/:id",
  [
    fileValidate,
    check("id", "Must be a MongoId").isMongoId(),
    check("collection").custom((c) =>
      allowedCollections(c, ["users", "products"])
    ),
    fieldValidate,
  ],
  imgUpdateCloudinary
  // imgUpdate
);

module.exports = router;
