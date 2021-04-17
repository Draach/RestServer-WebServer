const fieldValidation = require('../middlewares/field-validate');
const JWTValidation = require('../middlewares/jwt-validate');
const roleValidation = require('../middlewares/role-validate');

module.exports = {
    ...fieldValidation,
    ...JWTValidation,
    ...roleValidation
}