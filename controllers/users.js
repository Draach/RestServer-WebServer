const { response } = require('express')




const usersGet = (req, res = response) => {

    const {q, nombre = 'No name', apikey, page = '1', limit} = req.query;

    res.json({
        msg: 'get API - usersGet Controller',
        q,
        nombre,
        apikey,
        page,
        limit
    })
}

const usersPut = (req, res = response) => {

    const { id } = req.params;
    res.json({
        msg: 'get API - usersPut Controller',        
        id
    })
}

const usersPost = (req, res = response) => {
    const { nombre, edad } = req.body;
    res.json({
        msg: 'get API - usersPost Controller',
        nombre,
        edad
    })
}

const usersDelete = (req, res = response) => {
    res.json({
        msg: 'get API - usersDelete Controller',
    })
}

const usersPatch = (req, res = response) => {
    res.json({
        msg: 'get API - usersPatch Controller',
    })
}


module.exports = {
    usersGet,
    usersPut,
    usersPost,
    usersDelete,    
    usersPatch
}