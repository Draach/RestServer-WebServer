const { Router } = require('express');
const { check } = require('express-validator');
const cors = require('cors');


const { fieldValidate } = require('../middlewares/field-validate');
const { isValidRole, emailExists, userIDExists } = require('../helpers/db-validators');

const { usersGet,
        usersPut,
        usersPost,
        usersDelete,
        usersPatch } = require('../controllers/users');

const router = Router();

//
var whitelist = ['http://localhost:8080', 'https://restserver-nodejs-jm.herokuapp.com']
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}


//
router.get('/', cors(corsOptions) ,usersGet);

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
    check('id', "Not a valid ID.").isMongoId(),
    check('id').custom( userIDExists ),
    fieldValidate
], usersDelete); // if 2 params, the second is the controller

router.patch('/', usersPatch);






module.exports = router;