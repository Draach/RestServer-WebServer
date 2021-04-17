const { response, request } = require("express")

// Validates admin role
const adminValidate = (req = request, res = response, next) => {

    if(!req.user) {
        return res.status(500).json({
            msg: 'Trying to validate role without validating token first'
        })
    }

    const { role, name } = req.user;

    if (role != 'ADMIN_ROLE') {
        return res.status(401).json({
            msg: `${name} is not administrator - cant do this action`
        })
    }



    next();
}

// Validates roles from a given array
const roleValidate = ( ...roles ) => {

    return (req, res = response, next) => {

        if(!req.user) {
            return res.status(500).json({
                msg: 'Trying to validate role without validating token first'
            })
        }

        if(!roles.includes(req.user.role)) {
            return res.status(401).json({
                msg: `Service require one of this roles: ${roles}`
            })
        }


        
        next();
    }
}

module.exports = {
    adminValidate,
    roleValidate
}