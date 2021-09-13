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
    // console.log("Edit Image: ", req.body.profileImage);
    // let user = await userService.findById(req.params.id);
    // user.profileImage = req.body.profileImage;
    // console.log("Edit Image: ", user);
    // user = await userService.save(user);
    // user = _.omit(user, "password");
    // let user = new User();
    let user = await userService.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: { profileImage: req.body.profileImage } }
    );
    console.log("User: ", user);
    let newUser = await userService.findById(req.params.id);
    console.log("New User: ", newUser);
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
