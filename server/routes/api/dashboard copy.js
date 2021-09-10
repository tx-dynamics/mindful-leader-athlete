const express = require("express");
const router = express.Router();
const _ = require("lodash");
const jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const config = require("config");
const moment = require("moment");
const challangeService = require("../../models/challange/challangeService");
const companyService = require("../../models/company/companyService");
const userHabbitService = require("../../models/UserHabbit/userHabbitService");
const userService = require("../../models/user/userService");

const iteration = (
  index,
  user,
  habbitId,
  date,
  challange,
  weekStart,
  weekEnd
) =>
  new Promise(async (resolve, reject) => {
    try {
      const userHabbit = await userHabbitService.find({
        user: { $eq: user }, //req.body.user
        habbit: { $eq: habbitId },
        date: { $gte: weekStart, $lte: weekEnd },
      });
      console.log("User Habbit: ", userHabbit);
      var pair = [];
      const datePromise = userHabbit.map((hab) => {
        const dateFormatted = moment(hab.date).format("YYYY-MM-DD");
        pair.push(dateFormatted);
      });

      var newPairArray = [];

      for (var i = 0; i < 7; i++) {
        const onlyDate = moment(weekStart)
          .add(i, "days")
          .format("YYYY-MM-DD");
        console.log("Only Date:", onlyDate);
        if (pair.includes(onlyDate)) {
          var newPair = { weekDay: "done" };
          newPairArray.push(newPair);
        } else {
          var newPair = { weekDay: "notDone" };
          newPairArray.push(newPair);
        }
      }

      console.log("NewPair Array: ", newPairArray);
      await Promise.all(datePromise);
      console.log("HAB DATE: ", newPairArray);
      // var pair;
      // if (!userHabbit) {
      //   pair = { state: "notDone" };
      // } else {
      //   pair = { state: userHabbit.state };
      // }

      challange.habbits[index - 1] = {
        ...challange.habbits[index - 1],
        ...{ dates: newPairArray, doneOrNot: pair },
      };
      //console.log("NewChallange", challange.habbits[index]);

      console.log("Index", index - 1);
      // index++;
      resolve(challange);
    } catch (error) {
      reject(error);
    }
  });

//Get HabbitWise Score -> Habit
module.exports.getHabbitWiseRanking = async (req, res) => {
  console.log("Company Id: ", req.body.companyId);
  var currentDate = moment().format("YYYY-MM-DD");
  try {
    const challange = await challangeService.findOneAndSelect(
      {
        startDate: { $lte: currentDate },
        expiryDate: { $gte: currentDate },
        company: { $eq: req.body.companyId },
      },
      ["_id", "habbits", "challangeTitle"]
    );
    console.log("Challange: ", challange);

    var flag = 0;
    const arr = challange.habbits;

    const Promises = arr.map(async (us) => {
      const userHabbit = await userHabbitService.find({
        habbit: { $eq: us._id },
        company: { $eq: req.body.companyId },
        state: { $eq: "done" },
      });
      console.log("User Habbit", userHabbit, "Length: ", userHabbit.length);
      var pair = { score: userHabbit.length };
      challange.habbits[flag] = { ...challange.habbits[flag], ...pair };
      //console.log("User score added: ", challange.habbits[flag]);
      flag++;
    });

    await Promise.all(Promises);
    console.log("New challange: ", challange);
    return res.status(200).send(challange);
  } catch (e) {
    console.log(e);
    return res.status(400).send({ error: e.message });
  }
};

// Get Individual Score -> Individual
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

// Pod me department k sare logo ki -> POD - Pod me jo employees a rhe wo sirf department k hain
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

// All me departments rank hon ge -> ALL
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
