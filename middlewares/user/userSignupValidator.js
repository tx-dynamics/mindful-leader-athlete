let userService = require("../../models/user/userService");
module.exports = async function (req, res, next) {
    
  let user = await userService.findOne({
    email: req.body.email,
  });
  if (user)
    return res.status(400).send({ error: "User already registered!" });
  req.isValidated = true;
  next();
};
