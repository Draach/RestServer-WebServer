const { response, request } = require('express')
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const JWTValidate = async(req = request, res = response, next) => {

    const token = req.header('x-token');
    
    if (!token) {
        return res.status(401).json({
            msg: 'No token detected'
        })
    }

    try {
    
        const {uid} = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        // read correspondant user to id
        const user = await User.findById(uid);

        if (!user) {
            return res.status(401).json({
                msg: 'Invalid token - User does not exist'
            })
        }

        // verify user status
        if (!user.status) {
            return res.status(401).json({
                msg: 'Invalid token - User status = false'
            })
        }

        req.user = user;      // save user in the request

        next();
        
    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'Invalid token'
        })
    }
}

module.exports = {
    JWTValidate
}