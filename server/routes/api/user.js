const express = require("express");
const router = express.Router();
const _ = require("lodash");
const jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const config = require("config");
const { User } = require("../../models/user/userSchema");
const userService = require("../../models/user/userService");
const companyService = require("../../models/company/companyService");
const adminService = require("../../models/admin/adminService");
const userHabbitService = require("../../models/UserHabbit/userHabbitService");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(
  "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"
);

function gen_rand(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

module.exports.signUp = async (req, res) => {
  // var name = req.body.email.substring(0, req.body.email.lastIndexOf("@"));
  // const domain = req.body.email.substring(req.body.email.lastIndexOf("@") + 1);
  try {
    let user = req.body;

    const domain = user.email.substring(user.email.lastIndexOf("@") + 1);
    const company = await companyService.findOne({
      companyDomain: domain,
    });
    if (!company)
      return res
        .status(400)
        .send({ error: "Company with this email domain does not exist." });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    user.company = company._id;
    user.profileImage =
      "/9j/4QlQaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjYtYzE0MiA3OS4xNjA5MjQsIDIwMTcvMDcvMTMtMDE6MDY6MzkgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiLz4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8P3hwYWNrZXQgZW5kPSJ3Ij8+/+0ALFBob3Rvc2hvcCAzLjAAOEJJTQQlAAAAAAAQ1B2M2Y8AsgTpgAmY7PhCfv/bAIQAAgEBAQEBAgEBAgMCAQIDAwICAgIDAwMDAwMDAwUDBAQEBAMFBQUGBgYFBQcHCAgHBwoKCgoKDAwMDAwMDAwMDAECAgIEAwQHBQUHCggHCAoMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwM/90ABAA5/+4ADkFkb2JlAGTAAAAAAf/AABEIAcIBwgMAEQABEQECEQH/xACYAAEAAQQDAQAAAAAAAAAAAAAAAwYHCAkBBAUCAQEBAQEBAAAAAAAAAAAAAAAAAgMBBBAAAgECAwUEBgYFCQYHAAAAAAECAwQFBhEHEiExUQgTQVJhcYGS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";
    user = await userService.save(user);

    const token = jwt.sign(
      {
        _id: user._id,
        role: user.role,
        fullName: user.fullName,
        email: user.email,
      },
      config.get("jwtPrivateKey")
    );
    user = _.omit(user, "password");
    user = JSON.parse(JSON.stringify(user));
    user.token = token;
    return res.status(200).send({ user, company });
  } catch (e) {
    console.log(e);
    return res.status(400).send({ error: e.message });
  }
};

module.exports.login = async (req, res) => {
  let user = await userService.findOne({
    email: req.body.email,
  });
  if (!user) return res.status(400).send({ error: "Invalid email." });
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword)
    return res.status(400).send({ error: "Invalid password" });
  const token = jwt.sign(
    {
      _id: user._id,
      role: user.role,
      fullName: user.fullName,
      email: user.email,
    },
    config.get("jwtPrivateKey")
  );

  user = _.omit(user, "password");
  user = JSON.parse(JSON.stringify(user));
  user.token = token;
  return res.send(user);
};

module.exports.changePassword = async (req, res) => {
  try {
    let user = await userService.findById(req.body.id);
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.newPassword, salt);
    user = await userService.save(user);
    user = _.omit(user, "password");
    user = JSON.parse(JSON.stringify(user));
    return res.status(200).send(user);
  } catch (e) {
    console.log(e);
    return res.status(400).send({ error: e.message });
  }
};

module.exports.updateUser = async (req, res) => {
  try {
    let user = await userService.findById(req.params.id);
    let data = req.body;
    for (var x of Object.keys(data)) {
      user[x] = data[x];
    }
    user = await userService.save(user);
    user = _.omit(user, "password");
    user = JSON.parse(JSON.stringify(user));
    return res.status(200).send(user);
  } catch (e) {
    console.log(e);
    return res.status(400).send({ error: e.message });
  }
};

module.exports.singleUser = async (req, res) => {
  try {
    let user = await userService.findById(req.params.id);

    user = _.omit(user, "password");
    user = JSON.parse(JSON.stringify(user));
    return res.status(200).send(user);
  } catch (e) {
    console.log(e);
    return res.status(400).send({ error: e.message });
  }
};

module.exports.addDepartment = async (req, res) => {
  try {
    let user = await userService.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: { department: req.body.department } }
    );
    console.log("User: ", user);
    user = _.omit(user, "password");
    return res.status(200).send(user);
  } catch (e) {
    console.log(e);
    return res.status(400).send({ error: e.message });
  }
};

module.exports.adminLogin = async (req, res) => {
  let user = await adminService.findOne({
    email: req.body.email,
  });
  if (!user) return res.status(400).send({ error: "Invalid email." });
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword)
    return res.status(400).send({ error: "Invalid password" });
  const token = jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
    },
    config.get("jwtPrivateKey")
  );

  user = _.omit(user, "password");
  user = JSON.parse(JSON.stringify(user));
  user.accessToken = "access-token-8f3ae836da744329a6f93bf20594b5cc";
  return res.send(user);
};

module.exports.adminSignUp = async (req, res) => {
  try {
    let user = await adminService.findOne({
      email: req.body.email,
    });
    if (user)
      return res.status(400).send({ error: "User already registered." });

    user = _.pick(req.body, ["name", "email", "password"]);
    const salt = await bcrypt.genSalt(10);
    console.log(user);
    user.password = await bcrypt.hash(user.password, salt);
    await adminService.save(user);

    const token = jwt.sign(
      {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
      config.get("jwtPrivateKey")
    );
    user = _.omit(user, "password");
    user = JSON.parse(JSON.stringify(user));
    user.token = token;
    return res.status(200).send(user);
  } catch (e) {
    console.log(e);
    return res.status(400).send({ error: e });
  }
};

module.exports.editName = async (req, res) => {
  try {
    console.log("Edit Name: ", req.body.fullName);
    let user = await userService.findById(req.params.id);
    user.fullName = req.body.fullName;
    console.log("Edit Name: ", user);
    user = await userService.save(user);
    user = _.omit(user, "password");
    user = JSON.parse(JSON.stringify(user));
    return res.status(200).send(user);
  } catch (e) {
    console.log(e);
    return res.status(400).send({ error: e.message });
  }
};

module.exports.editGender = async (req, res) => {
  try {
    console.log("Edit Gender: ", req.body.gender);
    let user = await userService.findById(req.params.id);
    user.gender = req.body.gender;
    // let user = await userService.findByIdAndUpdate(
    //   { _id: req.params.id },
    //   { $set: { gender: req.body.gender } }
    // );
    console.log("Edit Gender: ", user);
    user = await userService.save(user);
    user = _.omit(user, "password");
    user = JSON.parse(JSON.stringify(user));
    return res.status(200).send(user);
  } catch (e) {
    console.log(e);
    return res.status(400).send({ error: e.message });
  }
};

module.exports.editBirthday = async (req, res) => {
  try {
    console.log("Edit Birthday: ", req.body.birthday);
    let user = await userService.findById(req.params.id);
    user.birthday = req.body.birthday;
    console.log("Edit Birthday: ", user);
    user = await userService.save(user);
    user = _.omit(user, "password");
    user = JSON.parse(JSON.stringify(user));
    return res.status(200).send(user);
  } catch (e) {
    console.log(e);
    return res.status(400).send({ error: e.message });
  }
};

module.exports.editProfileImage = async (req, res) => {
  try {
    console.log("Profile Image: ", req.body.profileImage);
    let user = await userService.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: { profileImage: req.body.profileImage } }
    );
    // console.log("User: ", user);
    let newUser = await userService.findById(req.params.id);
    // console.log("New User: ", newUser);
    // user = _.omit(user, "password");
    return res.status(200).send(newUser);
    // user = JSON.parse(JSON.stringify(user));
    // return res.status(200).send(user);
  } catch (e) {
    console.log(e);
    return res.status(400).send({ error: e.message });
  }
};

module.exports.usersQuery = async (req, res) => {
  let user = await userService.find({ company: req.params.id });
  if (!user) return res.status(400).send({ error: "Sorry no user found!" });

  console.log("sss", user);
  const query = req.body.query;
  console.log(query);
  // console.log(query);
  let conditions = {};
  if (query.search) {
    conditions.$and = [
      {
        $or: [
          { fullName: { $regex: ".*" + query.search + ".*" } },
          { email: { $regex: ".*" + query.search + ".*" } },
        ],
      },
      { company: req.params.id },
    ];
    // conditions.$or = [
    //   { fullName: { $regex: ".*" + query.search + ".*" } },
    //   { email: { $regex: ".*" + query.search + ".*" } },
    // ];
  } else {
    conditions = { company: req.params.id };
  }
  let skip = query.page * query.pageSize;
  let sort = {};
  if (query.orderBy) {
    sort[query.orderBy.field] = query.orderDirection == "asc" ? 1 : -1;
  }
  console.log("ss");
  const records = await userService.findPopulateSkipSortLimit(
    conditions,
    "company",
    skip,
    sort,
    query.pageSize
  );
  const total = await userService.countDocuments(conditions);

  res.send({ data: records, page: query.page, total });
};

module.exports.forgotPassword = async (req, res) => {
  try {
    let user = await userService.findOne({
      email: req.body.email,
    });
    console.log("User: ", user);
    if (!user) return res.status(400).send({ error: "Invalid email." });

    var newPass = gen_rand(8);
    console.log("newPass: ", newPass);
    const salt = await bcrypt.genSalt(10);
    updatedPassword = await bcrypt.hash(newPass, salt);
    let newUser = await userService.findByIdAndUpdate(
      { _id: user._id },
      { $set: { password: updatedPassword } }
    );
    // user = await userService.save(user);
    // console.log("User: ", newUser);

    // user = _.omit(user, "password");
    // user = JSON.parse(JSON.stringify(user));

    var theHTML = `<b> Hi ${user.fullName}</b>, <br> You just request a password reset, here is your new password: <br> <b>${newPass}</b>`;

    const msg = {
      to: req.body.email, // Change to your recipient
      from: "muqbausman@gmail.com", // Change to your verified sender
      subject: "Forgot Password",
      // text: "and easy to do anywhere, even with Node.js",
      html: theHTML,
    };
    sgMail
      .send(msg)
      .then(() => {
        console.log("Email sent");
        res.status(200).send({ msg: "Email sent successfully" });
      })
      .catch((error) => {
        console.error(error);
        res.status(400).send({ err: "Email don't work on this server yet " });
      });
  } catch (e) {
    console.log(e);
    return res.status(400).send({ error: e.message });
  }
};

module.exports.query = async (req, res) => {
  let user = await userService.find({ company: req.params.id });
  if (!user) return res.status(400).send({ error: "Sorry no user found!" });

  console.log("sss", user);
  const query = req.body.query;
  console.log(query);
  // console.log(query);
  let conditions = {};
  if (query.search) {
    conditions.$or = [
      { fullName: { $regex: ".*" + query.search + ".*" } },
      { email: { $regex: ".*" + query.search + ".*" } },
    ];
  }
  let skip = query.page * query.pageSize;
  let sort = {};
  if (query.orderBy) {
    sort[query.orderBy.field] = query.orderDirection == "asc" ? 1 : -1;
  }
  console.log("ss");
  const records = await userService.findPopulateSkipSortLimit(
    conditions,
    "company",
    skip,
    sort,
    query.pageSize
  );
  const total = await userService.countDocuments(conditions);

  res.send({ data: records, page: query.page, total });
};
