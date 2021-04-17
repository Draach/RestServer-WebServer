const { response } = require('express')
const bcryptjs = require('bcryptjs')

const User = require('../models/user');


const usersGet = async(req, res = response) => {

    // const {q, name = 'No name', apikey, page = '1', limit} = req.query;
    const { limit = 5, from = 0 } = req.query;
    const query = {status: true};

    /**
    const users = await User.find(query)
    .skip(Number(from))
    .limit(Number(limit));

    const total = await User.countDocuments(query);
    */
    const [ total, users] = await Promise.all([    // Promises array, array destruct.
        User.countDocuments(query),
        User.find(query)
            .skip(Number(from))
            .limit(Number(limit))
    ]);

    res.json({
        total,
        users
    })
}

const usersPut = async(req, res = response) => {

    const { id } = req.params;
    const { _id, password, google, email, ...resto } = req.body;

    if ( password ) {
        const salt = bcryptjs.genSaltSync();                 
        resto.password = bcryptjs.hashSync(password, salt);
    }

    const user = await User.findByIdAndUpdate( id, resto );

    res.json(user)

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

const usersDelete = async(req, res = response) => {

    const { id } = req.params;    

    const user = await User.findByIdAndUpdate(id, {status: false});
    const authenticatedUser = req.user;

    res.json({user, authenticatedUser})
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