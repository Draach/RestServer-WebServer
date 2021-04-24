const fieldValidation = require('../middlewares/field-validate');
const JWTValidation = require('../middlewares/jwt-validate');
const roleValidation = require('../middlewares/role-validate');
const fileValidate = require('../middlewares/file-validate');

module.exports = {
    ...fieldValidation,
    ...JWTValidation,
    ...roleValidation,
    ...fileValidate
}