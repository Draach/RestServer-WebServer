const Role = require('../models/role')
const User = require('../models/user')

const isValidRole = async(role = "") => {
    const roleExists = await Role.findOne({ role });
    if (!roleExists) {
        throw new Error(`Role ${ role } is not registered.`)
    }
}

const emailExists = async( email = "" ) => {     
     const email_Exists = await User.findOne({ email });
     if( email_Exists ) {
         throw new Error(`Email ${ email } is already registered.`)
     }
}

const userIDExists = async( id ) => {     
    const userExists = await User.findById( id );
    if( !userExists ) {
        throw new Error(`ID ${ id } does not exists.`)
    }
}

module.exports = {
    isValidRole,
    emailExists,
    userIDExists
}