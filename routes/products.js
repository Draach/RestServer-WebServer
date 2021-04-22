const { Router } = require("express");
const { check } = require("express-validator");
const {
  getProducts,
  getProduct,
  postProduct,
  putProduct,
  removeProduct,
} = require("../controllers/products");
const {
  categoryIDExists,
  isValidRole,
  productIDExists,
} = require("../helpers/db-validators");

const { JWTValidate, fieldValidate, adminValidate } = require("../middlewares");

const router = Router();

router.get("/", getProducts);

router.get("/:id",[
    check("id").isMongoId(),
    check("id").custom(productIDExists),
    fieldValidate
], getProduct);

router.post("/",[
      JWTValidate,
      check("name", "Name is mandatory").not().isEmpty(),
      check('description', "Description is mandatory").not().isEmpty(),
      fieldValidate
    ],
  postProduct);

router.put("/:id", [
    JWTValidate,
    check('id').custom( productIDExists),
    fieldValidate
],
putProduct);

router.delete("/:id", [
    JWTValidate,
    adminValidate,
    check('id', 'Invalid ID').isMongoId(),
    check('id').custom (productIDExists),
    fieldValidate
],
removeProduct);

module.exports = router;
