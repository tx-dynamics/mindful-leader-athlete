const express = require("express");
const router = express.Router();
const _ = require("lodash");
const jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const config = require("config");
const moment = require("moment");
const challangeService = require("../../models/challange/challangeService");
const companyService = require("../../models/company/companyService");
const { Challange } = require("../../models/challange/challangeSchema");
const userHabbitService = require("../../models/UserHabbit/userHabbitService");
const userService = require("../../models/user/userService");

module.exports.getHabbitWiseRanking = async (req, res) => {};

module.exports.getIndividualRanking = async (req, res) => {
  console.log("Company Id: ", req.body.companyId);
  console.log("Start Date: ", req.body.startDate); //Challange start
  var currentDate = moment().format("YYYY-MM-DD");
  try {
    var users = await userService.findAndSelect(
      { company: req.body.companyId },
      ["_id", "fullName", "company"]
    );

    console.log("Users: ", users);
    var flag = 0;
    const Promises = users.map(async (us) => {
      const userHabbit = await userHabbitService.find({
        user: { $eq: us._id },
        date: { $lte: currentDate, $gte: req.body.startDate },
        company: { $eq: us.company },
        state: { $eq: "done" },
      });
      console.log("User Habbit", userHabbit, "Length: ", userHabbit.length);
      var pair = { score: userHabbit.length };
      users[flag] = { ...users[flag], ...pair };
      console.log("User score added: ", users[flag]);
      flag++;
    });

    await Promise.all(Promises);
    console.log("New Users: ", users);
    const newUsers = _.pick(users, ["fullName", "score"]);
    console.log("New Users: ", newUsers);
    return res.status(200).send(users);
  } catch (e) {
    console.log(e);
    return res.status(400).send({ error: e.message });
  }
};

module.exports.getDepartmentWiseRanking = async (req, res) => {
  console.log("Department Id: ", req.body.departmentId);
  console.log("Date: ", req.body.startDate);
  var currentDate = moment().format("YYYY-MM-DD");
  try {
    var users = await userService.findAndSelect(
      { department: req.body.departmentId, company: req.body.companyId },
      ["_id", "department", "fullName"]
    );
    console.log("Users: ", users);
    var flag = 0;
    const Promises = users.map(async (us) => {
      const userHabbit = await userHabbitService.find({
        user: { $eq: us._id },
        date: { $lte: currentDate, $gte: req.body.startDate },
        department: { $eq: us.department },
        state: { $eq: "done" },
      });
      console.log("User Habbit", userHabbit, "Length: ", userHabbit.length);
      var pair = { score: userHabbit.length };
      users[flag] = { ...users[flag], ...pair };
      console.log("User score added: ", users[flag]);
      flag++;
    });

    await Promise.all(Promises);
    console.log("New Users: ", users);
    return res.status(200).send(users);
  } catch (e) {
    console.log(e);
    return res.status(400).send({ error: e.message });
  }
};

module.exports.getCompanyDepartmentsRanking = async (req, res) => {
  console.log("Company Id: ", req.body.companyId);
  console.log("Date: ", req.body.startDate);
  var currentDate = moment().format("YYYY-MM-DD");
  try {
    var company = await companyService.findOneAndSelect(
      { _id: req.body.companyId },
      ["_id", "departments", "companyName"]
    );
    console.log("company: ", company);
    var flag = 0;
    const arr = company.departments;
    const Promises = arr.map(async (us) => {
      const userHabbit = await userHabbitService.find({
        department: { $eq: us._id },
        date: { $lte: currentDate, $gte: req.body.startDate },
        state: { $eq: "done" },
      });
      console.log("User Habbit", userHabbit, "Length: ", userHabbit.length);
      var pair = { score: userHabbit.length };
      company.departments[flag] = { ...company.departments[flag], ...pair };
      console.log("User score added: ", company.departments[flag]);
      flag++;
    });

    await Promise.all(Promises);
    console.log("New company: ", company);
    return res.status(200).send(company);
  } catch (e) {
    console.log(e);
    return res.status(400).send({ error: e.message });
  }
};

// 610e8828e5e8ad080ca4f2cb  domain
// 610e88d9deb681298804dcef dep 1
// 610e88d9deb681298804dcf0 dep 2
// 610e88d9deb681298804dcee  techxpert
// 610e8828e5e8ad080ca4f2cc dep 1
// 610e8828e5e8ad080ca4f2cd dep 2
