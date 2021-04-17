const {response} = require('express');
const bcryptjs = require('bcryptjs')

const User = require('../models/user');
const { generateJWT } = require('../helpers/generateJWT');


const login = async(req, res = response) => {

    const { email, password } = req.body;

    try {
    // verify email
    const user = await User.findOne({email})

    if (!user) {
        return res.status(400).json({
            msg: 'User / Password not correct - Email'
        })
    }

    // verify user active status
    if (!user.status) {
        return res.status(400).json({
            msg: 'User / Password not correct - Status: False'
        })
    }

    // Verify password
    const validPassword = bcryptjs.compareSync( password, user.password );  // Compares received password against DB password, returns a boolean
    if (!validPassword) {
        return res.status(400).json({
            msg: 'User / Password not correct - Password'
        })
    }

    // Generate JWT
    const token = await generateJWT(user.id);
        res.json({
            user,
            token
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: 'Contact administrator.'
        });
    }
}


module.exports = {
    login
}