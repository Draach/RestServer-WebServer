const { Router } = require('express');
const { check } = require('express-validator');


const { login } = require('../controllers/auth');
const { fieldValidate } = require('../middlewares/field-validate');


const router = Router();

// step 3 - create routes.
router.post('/login', [
    check('email', 'Email must be a valid email').isEmail(),
    check('password', 'Password is mandatory').not().isEmpty(),
    fieldValidate
], login);  



module.exports = router;