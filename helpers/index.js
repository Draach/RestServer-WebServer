

const dbValidators = require('./db-validators');
const generateJWT = require('./generateJWT');
const googleVerify = require('./google-verify');
const uploadFile = require('./upload-file');


module.exports = {
    ...dbValidators,
    ...generateJWT,
    ...googleVerify,
    ...uploadFile
}