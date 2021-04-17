const { Router } = require('express');
const { check } = require('express-validator');


// const { fieldValidate } = require('../middlewares/field-validate');
// const { JWTValidate } = require('../middlewares/jwt-validate');
// const { adminValidate, roleValidate } = require('../middlewares/role-validate');
const {
    fieldValidate,
    JWTValidate,
    adminValidate,
    roleValidate
} = require('../middlewares');   // Imports from middlewares/index.


const { isValidRole, emailExists, userIDExists } = require('../helpers/db-validators');

const { usersGet,
        usersPut,
        usersPost,
        usersDelete,
        usersPatch } = require('../controllers/users');

const router = Router();

router.get('/', usersGet);

router.put('/:id',[
    check('id', "Not a valid ID.").isMongoId(),
    check('id').custom( userIDExists ),
    check('role').custom( isValidRole ),
    fieldValidate                                                   // Continue only if no errors
] ,usersPut);

router.post('/', [
    check('name', 'Name is mandatory.').not().isEmpty(),
    check('password', 'Password must have at least 6 characters.').isLength({ min: 6}),
    check('email', 'email must have a valid email.').isEmail(),
    check('email').custom( emailExists ),
    // check('role', 'Role is not a valid role.').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    check('role').custom( isValidRole ),
    fieldValidate                                                   // Continue only if no errors
], usersPost); // if 3 params, the second is the middleware/array of middlewares and the third is the controller

router.delete('/:id', [
    JWTValidate,
    adminValidate,
    //roleValidate('ADMIN_ROLE', 'VENTAS_ROLE'),
    check('id', "Not a valid ID.").isMongoId(),
    check('id').custom( userIDExists ),
    fieldValidate
], usersDelete); // if 2 params, the second is the controller

router.patch('/', usersPatch);






module.exports = router;