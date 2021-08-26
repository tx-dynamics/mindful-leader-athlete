const express = require("express");
const router = express.Router();
const _ = require("lodash");
const jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const config = require("config");

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

module.exports.query = async (req, res) => {
  let user = await userService.find();
  if (!user) return res.status(400).send({ error: "Sorry no user found!" });

  console.log("sss");
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
  user.token = token;
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
