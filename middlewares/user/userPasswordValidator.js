const bcrypt = require("bcryptjs");
let userService = require("../../models/user/userService");
module.exports = async function (req, res, next) {
  let user = await userService.findById(req.body.id);
  const validPassword = await bcrypt.compare(
    req.body.currentPassword,
    user.password
  );
  if (!validPassword)
    return res.status(400).send({ error: "Invalid password!" });
  req.isValidated = true;
  next();
};
