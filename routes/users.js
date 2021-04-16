const { Router } = require('express');
const { check } = require('express-validator');

const { fieldValidate } = require('../middlewares/field-validate');
const { isValidRole, emailExists } = require('../helpers/db-validators');

const { usersGet,
        usersPut,
        usersPost,
        usersDelete,
        usersPatch } = require('../controllers/users');

const router = Router();


router.get('/', usersGet);

router.put('/:id', usersPut);

router.post('/', [
    check('name', 'Name is mandatory.').not().isEmpty(),
    check('password', 'Password must have at least 6 characters.').isLength({ min: 6}),
    check('email', 'Email is not a valid email.').isEmail(),
    check('email').custom( emailExists ),
    // check('role', 'Role is not a valid role.').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    check('role').custom( isValidRole ),
    fieldValidate
], usersPost); // if 3 params, the second is the middleware/array of middlewares and the third is the controller

router.delete('/', usersDelete); // if 2 params, the second is the controller

router.patch('/', usersPatch);






module.exports = router;