const { validationResult } = require('express-validator');

const fieldValidate = (req, res, next) => {         // Next = middleware third argument.

    const errors = validationResult(req);
    if ( !errors.isEmpty() ) {
        return res.status(400).json(errors);
    }

    next();                                         // Must call at the end of the middleware to call the next one.
}


module.exports = {
    fieldValidate
}