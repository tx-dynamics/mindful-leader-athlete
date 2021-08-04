const bcrypt = require("bcryptjs");
let userService = require("../../models/user/userService");
module.exports = async function (req, res, next) {
  let user = await userService.findOne({
    email: req.body.email,
  });
  if (!user) return res.status(400).send({ error: "Invalid email!" });
  const validPassword = await bcrypt.compare(
    req.body.password,
    user.password
  );
  if (!validPassword)
    return res.status(400).send({ error: "Invalid password!" });
  req.isValidated = true;
  next();
};
