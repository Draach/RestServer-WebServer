const { Router } = require("express");
const { check } = require("express-validator");
const {
  getCategories,
  createCategory,
  getCategory,
  putCategory,
  removeCategory,
} = require("../controllers/categories");
const { categoryIDExists, isValidRole } = require("../helpers/db-validators");

const { JWTValidate, fieldValidate, adminValidate } = require("../middlewares");

const router = Router();

// GET - Lists all categories - public.
router.get("/", getCategories);

// GET - Lists one category by id - public.
router.get(
  "/:id",
  [
    check("id", "Invalid ID").isMongoId(),
    check("id").custom(categoryIDExists),
    fieldValidate,
  ],
  getCategory
);

// POST - Creates a new category - private - any person with a valid token.
router.post(
  "/",
  [
    JWTValidate,
    check("name", "Name is mandatory.").not().isEmpty(),
    fieldValidate,
  ],
  createCategory
);

// PUT - Updates a registry by id
router.put(
  "/:id",
  [
      adminValidate,
    check("id", "Invalid ID").isMongoId(),
    check("id").custom(categoryIDExists),
    fieldValidate,
  ],
  putCategory
);

// DELETE - Removes a category - Admins.
router.delete(
  "/:id",
  [
    JWTValidate,
    adminValidate,
    check("id", "Invalid ID").isMongoId(),
    check("id").custom(categoryIDExists),
    fieldValidate,
  ],
  removeCategory
);

module.exports = router;
