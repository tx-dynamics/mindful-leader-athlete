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

const habbitWiseAnotherIteration = (
  index,
  habbitId,
  companyId,
  userId,
  users
) =>
  new Promise(async (resolve, reject) => {
    try {
      console.log("User Id: ", userId, "Habbit Id: ", habbitId);
      const userHabbit = await userHabbitService.find({
        habbit: { $eq: habbitId },
        company: { $eq: companyId },
        user: { $eq: userId },
        state: { $eq: "done" },
        special: { $eq: "false" },
      });
      // console.log("User Habbit", userHabbit, "Length: ", userHabbit.length);
      var pair = { score: userHabbit.length };
      // challange.habbits[flag] = { ...challange.habbits[flag], ...pair };
      //console.log("User score added: ", challange.habbits[flag]);
      users[index] = {
        ...users[index],
        ...pair,
      };
      //console.log("NewChallange", challange.habbits[index]);

      console.log("Index", index);
      // index++;
      resolve(users);
    } catch (error) {
      reject(error);
    }
  });

const habbitWiseIteration = (index, habbitId, companyId, challange, users) =>
  new Promise(async (resolve, reject) => {
    try {
      var updatedUsers = [],
        totalScore = 0;
      // flag = 0,

      // const Promises = users.map(async (user) => {
      //   console.log("User Inside habbit: ", user);
      //   flag++;
      for (var flag = 0; flag < users.length; flag++) {
        updatedUsers = await habbitWiseAnotherIteration(
          flag,
          habbitId,
          companyId,
          users[flag]._id,
          users
        );
      }
      for (var flag = 0; flag < users.length; flag++) {
        totalScore += updatedUsers[flag].score;
      }
      // });
      console.log(
        // "Updated Users",
        // updatedUsers,
        "Length: ",
        updatedUsers.length,
        "Total Score: ",
        totalScore
      );

      var pair = { habbitUsers: updatedUsers };
      var totalUsersPair = { totalUsers: updatedUsers.length };
      var totalScorePair = { totalScore: totalScore };
      // console.log("Updated Users: ", updatedUsers);
      const prom = await updatedUsers.sort(
        (a, b) => Number(b.score) - Number(a.score)
      );

      // console.log("Prom: ", prom);
      await Promise.all(prom);
      // console.log("Updated Users sort: ", updatedUsers);
      const sliceUsers = await updatedUsers.slice(0, 3);
      console.log("slice Users : ", sliceUsers);
      // challange.habbits[flag] = { ...challange.habbits[flag], ...pair };
      // console.log("Challange: ", challange.habbits);
      // challange.habbits[index] = {
      //   ...challange.habbits[index],
      //   ...pair,
      // };
      // ...totalUsersPair,
      // ...totalScorePair,

      // console.log("Challange: ", challange.habbits);
      // await Promise.all(Promises);
      // index++;
      resolve(sliceUsers);
    } catch (error) {
      reject(error);
    }
  });

//Get HabbitWise Score -> Habit
module.exports.getHabbitWiseRanking = async (req, res) => {
  console.log("Company Id: ", req.body.companyId);
  var currentDate = moment().format("YYYY-MM-DD");
  try {
    var challange = await challangeService.findOneAndSelect(
      {
        startDate: { $lte: currentDate },
        expiryDate: { $gte: currentDate },
        company: { $eq: req.body.companyId },
      },
      ["_id", "habbits", "challangeTitle"]
    );
    if (!challange) return res.status(400).send({ msg: "No challange found" });
    var users = await userService.findAndSelect(
      { company: req.body.companyId },
      ["fullName"]
    );
    console.log("Challange: ", challange);
    console.log("users: ", users);
    // flag = 0,
    var updatedChallage;
    const arr = challange.habbits;
    const newHabbits = challange.habbits;
    console.log("habbits length: ", arr.length);
    // console.log("newHabbits: ", newHabbits);

    let usersArray = [];
    // const Promises = arr.map(async (us) => {
    for (var flag = 0; flag < arr.length; flag++) {
      const pair = await habbitWiseIteration(
        flag,
        challange.habbits[flag]._id,
        req.body.companyId,
        challange,
        users
      );

      usersArray = usersArray.concat(pair);
    }
    return res.status(200).send({ challange, usersArray });
  } catch (e) {
    console.log(e);
    return res.status(400).send({ error: e.message });
  }
};

const individualIteration = (
  index,
  userId,
  currentDate,
  startDate,
  companyId,
  users
) =>
  new Promise(async (resolve, reject) => {
    try {
      const userHabbit = await userHabbitService.find({
        user: { $eq: userId },
        date: { $lte: currentDate, $gte: startDate },
        company: { $eq: companyId },
        state: { $eq: "done" },
        special: { $eq: "false" },
      });
      console.log("User Habbit", userHabbit, "Length: ", userHabbit.length);
      var pair = { score: userHabbit.length };
      // var pair = { score: userHabbit.length };
      users[index - 1] = { ...users[index - 1], ...pair };
      // challange.habbits[flag] = { ...challange.habbits[flag], ...pair };
      //console.log("User score added: ", challange.habbits[flag]);
      // challange.habbits[index - 1] = {
      //   ...challange.habbits[index - 1],
      //   ...pair,
      // };
      //console.log("NewChallange", challange.habbits[index]);

      console.log("Index", index - 1);
      // index++;
      resolve(users);
    } catch (error) {
      reject(error);
    }
  });

// Get Individual Score -> Individual
module.exports.getIndividualRanking = async (req, res) => {
  var theStart, theEnd;
  if (req.body.monthName) {
    const nameMonth = moment()
      .month(req.body.monthName)
      .format("YYYY-MM-DD");
    theStart = moment(nameMonth)
      .startOf("month")
      .format("YYYY-MM-DD");

    theEnd = moment(theStart)
      .add(29, "days")
      .format("YYYY-MM-DD");
  } else if (req.body.startDate) {
    theEnd = moment().format("YYYY-MM-DD"); //Current Date
    theStart = req.body.startDate;
  }

  console.log("Company Id: ", req.body.companyId);
  console.log("Start Date: ", req.body.startDate); //Challange start
  // var currentDate = moment().format("YYYY-MM-DD");
  try {
    var users = await userService.findAndSelect(
      { company: req.body.companyId },
      ["_id", "fullName", "company"]
    );

    console.log("Users: ", users);
    var flag = 0,
      updatedUsers;
    const Promises = users.map(async (us) => {
      // const userHabbit = await userHabbitService.find({
      //   user: { $eq: us._id },
      //   date: { $lte: currentDate, $gte: req.body.startDate },
      //   company: { $eq: us.company },
      //   state: { $eq: "done" },
      // special:{ $eq: "false"}
      // });
      // console.log("User Habbit", userHabbit, "Length: ", userHabbit.length);
      // var pair = { score: userHabbit.length };
      // users[flag] = { ...users[flag], ...pair };
      // console.log("User score added: ", users[flag]);
      flag++;
      updatedUsers = await individualIteration(
        flag,
        us._id,
        theEnd,
        theStart,
        us.company,
        users
      );
    });

    await Promise.all(Promises);
    console.log("New Users: ", updatedUsers);
    console.log("theStart: ", theStart);
    console.log("theEnd: ", theEnd);

    return res.status(200).send(updatedUsers);
  } catch (e) {
    console.log(e);
    return res.status(400).send({ error: e.message });
  }
};

const departmentWiseIteration = (
  index,
  userId,
  currentDate,
  startDate,
  departmentId,
  users
) =>
  new Promise(async (resolve, reject) => {
    try {
      const userHabbit = await userHabbitService.find({
        user: { $eq: userId },
        date: { $lte: currentDate, $gte: startDate },
        department: { $eq: departmentId },
        state: { $eq: "done" },
        special: { $eq: "false" },
      });
      console.log("User Habbit", userHabbit, "Length: ", userHabbit.length);
      var pair = { score: userHabbit.length };
      users[index - 1] = { ...users[index - 1], ...pair };

      console.log("Index", index - 1);
      // index++;
      resolve(users);
    } catch (error) {
      reject(error);
    }
  });

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
    var flag = 0,
      updatedUsers;
    const Promises = users.map(async (us) => {
      flag++;
      updatedUsers = await departmentWiseIteration(
        flag,
        us._id,
        currentDate,
        req.body.startDate,
        us.department,
        users
      );
    });

    await Promise.all(Promises);
    console.log("New Users: ", updatedUsers);
    return res.status(200).send(updatedUsers);
  } catch (e) {
    console.log(e);
    return res.status(400).send({ error: e.message });
  }
};

const companyDepartmentsIteration = (
  index,
  departmentId,
  theEnd,
  theStart,
  company
) =>
  new Promise(async (resolve, reject) => {
    try {
      const userHabbit = await userHabbitService.find({
        department: { $eq: departmentId },
        date: { $lte: theEnd, $gte: theStart },
        state: { $eq: "done" },
        special: { $eq: "false" },
      });
      console.log("User Habbit", userHabbit, "Length: ", userHabbit.length);
      var pair = { score: userHabbit.length };
      company.departments[index - 1] = {
        ...company.departments[index - 1],
        ...pair,
      };

      console.log("Index", index - 1);
      // index++;
      resolve(company);
    } catch (error) {
      reject(error);
    }
  });

// All me departments rank hon ge -> ALL
module.exports.getCompanyDepartmentsRanking = async (req, res) => {
  var theStart, theEnd;
  if (req.body.monthName) {
    const nameMonth = moment()
      .month(req.body.monthName)
      .format("YYYY-MM-DD");
    theStart = moment(nameMonth)
      .startOf("month")
      .format("YYYY-MM-DD");

    theEnd = moment(theStart)
      .add(29, "days")
      .format("YYYY-MM-DD");
  } else if (req.body.startDate) {
    theEnd = moment().format("YYYY-MM-DD"); //Current Date
    theStart = req.body.startDate;
  }

  try {
    var company = await companyService.findOneAndSelect(
      { _id: req.body.companyId },
      ["_id", "departments", "companyName"]
    );
    console.log("company: ", company);
    var flag = 0,
      updatedCompany;
    const arr = company.departments;
    const Promises = arr.map(async (us) => {
      // const userHabbit = await userHabbitService.find({
      //   department: { $eq: us._id },
      //   date: { $lte: currentDate, $gte: req.body.startDate },
      //   state: { $eq: "done" },
      // special:{ $eq: "false"}
      // });
      // console.log("User Habbit", userHabbit, "Length: ", userHabbit.length);
      // var pair = { score: userHabbit.length };
      // company.departments[flag] = { ...company.departments[flag], ...pair };
      // console.log("User score added: ", company.departments[flag]);
      flag++;
      updatedCompany = await companyDepartmentsIteration(
        flag,
        us._id,
        theEnd,
        theStart,
        company
      );
    });

    await Promise.all(Promises);
    console.log("New company: ", updatedCompany);
    console.log(theEnd);
    console.log(theStart);
    // console.log(monthEnd);
    return res.status(200).send(updatedCompany);
  } catch (e) {
    console.log(e);
    return res.status(400).send({ error: e.message });
  }
};
