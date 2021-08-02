const { Router } = require('express');
const { check } = require('express-validator');


const { login, googleSignIn, tokenValidation } = require('../controllers/auth');
const { fieldValidate } = require('../middlewares/field-validate');
const { JWTValidate } = require('../middlewares/jwt-validate');


const router = Router();


router.get('/', JWTValidate, tokenValidation);

// step 3 - create routes.
router.post('/login', [
    check('email', 'Email must be a valid email').isEmail(),
    check('password', 'Password is mandatory').not().isEmpty(),
    fieldValidate
], login);  

router.post('/google', [
    check('id_token', 'id_token is mandatory.').not().isEmpty(),
    fieldValidate
], googleSignIn);  



module.exports = router;