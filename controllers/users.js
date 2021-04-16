const { response } = require('express')
const bcryptjs = require('bcryptjs')

const User = require('../models/user');


const usersGet = (req, res = response) => {

    const {q, name = 'No name', apikey, page = '1', limit} = req.query;

    res.json({
        msg: 'get API - usersGet Controller',
        q,
        name,
        apikey,
        page,
        limit
    })
}

const usersPut = (req, res = response) => {

    const { id } = req.params;
    res.json({
        msg: 'put API - usersPut Controller',        
        id
    })
}

const usersPost = async(req, res = response) => {

    

    const { name, email, password, role } = req.body;
    const user = new User({name, email, password, role});


    // Encript PW
    const salt = bcryptjs.genSaltSync();                        // genSaltySinc generates a salt, how many rounds used to encrypt, default 10
    user.password = bcryptjs.hashSync(password, salt);          // hashSync generates a hash for the given string, requires the string and a salt

    // Save DB
    await user.save();

    res.json({
        user
    })
}

const usersDelete = (req, res = response) => {
    res.json({
        msg: 'delete API - usersDelete Controller',
    })
}

const usersPatch = (req, res = response) => {
    res.json({
        msg: 'patch API - usersPatch Controller',
    })
}


module.exports = {
    usersGet,
    usersPut,
    usersPost,
    usersDelete,    
    usersPatch
}