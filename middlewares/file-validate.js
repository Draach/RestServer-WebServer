const { response } = require("express")



const fileValidate = (req, res = response, next) => {

  if (!req.files || Object.keys(req.files).length === 0 || !req.files.file) {
    return res.status(400).json({
        msg: "No file selected"
    });
  }

  next();

}


module.exports = {
    fileValidate
}