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

const checkHabbitState = (challange, user, date) =>
  new Promise(async (resolve, reject) => {
    try {
      console.log("challange inside: ", challange, user, date);
      var flag = 0;
      // var stateArr = [];
      var habbits = challange.habbits;
      const Promises = habbits.map(async (habbit) => {
        console.log("Habb: ", habbit);
        const userHabbit = await userHabbitService.findOne({
          user: { $eq: user }, //req.body.user
          habbit: { $eq: habbit._id },
          date: { $eq: date },
        });
        console.log("User Habbit: ", userHabbit);
        var pair;
        if (!userHabbit) {
          pair = { state: "notDone" };
          // stateArr.push("undone");
        } else {
          pair = { state: userHabbit.state };
          // stateArr.push(userHabbit.state);
        }

        challange.habbits[flag] = { ...challange.habbits[flag], ...pair };
        //console.log("NewChallange", challange.habbits[flag]);

        console.log("Flag", flag);
        flag++;
      });
      await Promise.all(Promises);
      // return challange;
      resolve(challange);
    } catch (error) {
      reject(error);
    }
  });

module.exports.getSingleChallange = async (req, res) => {
  console.log("getSingleChallange params", req.params.id);
  // console.log("Departments", req.body.data.departments);
  try {
    //let data = req.body.data;
    let challange = await challangeService.findOne({ _id: req.params.id });
    return res.status(200).send(challange);
  } catch (e) {
    console.log(e);
    return res.status(400).send({ error: e.message });
  }
};

module.exports.updateChallange = async (req, res) => {
  console.log("getSingleChallange params", req.params.id);
  // console.log("Departments", req.body.data.departments);
  try {
    let data = req.body;
    const company = await companyService.findOne({
      companyName: data.companyName,
    });
    data.company = company._id;
    let challange = await challangeService.findOneAndUpdate(
      { _id: req.params.id },
      data
    );
    return res.status(200).send(challange);
  } catch (e) {
    console.log(e);
    return res.status(400).send({ error: e.message });
  }
};

module.exports.createChallange = async (req, res) => {
  console.log("createChallange", req.body);
  console.log("Habbits", req.body.data.habbits);

  try {
    let data = req.body.data;
    const company = await companyService.findOne({
      companyName: data.companyName,
    });
    data.company = company._id;
    let challange = await challangeService.save(data);
    return res.status(200).send(challange);
  } catch (e) {
    console.log(e);
    return res.status(400).send({ error: e.message });
  }
};

module.exports.getTodaysChallange = async (req, res) => {
  // console.log("Date: ", date);
  try {
    var currentDate = moment().format("YYYY-MM-DD");
    var challange = await challangeService.findOne({
      startDate: { $lte: currentDate },
      expiryDate: { $gte: currentDate },
      company: { $eq: req.body.companyId },
    });
    if (!challange) return res.status(200).send({ msg: "No challange found" });
    console.log("challange res: ", challange);
    // console.log("challange habbits: ", challange.habbits);

    const updatedChallage = await checkHabbitState(
      challange,
      req.body.userId,
      currentDate
    );
    console.log("updated challange res: ", updatedChallage);
    //console.log("updated challange habbits: ", updatedChallage.habbits);
    return res.status(200).send(updatedChallage);
  } catch (e) {
    console.log(e);
    return res.status(400).send({ error: e.message });
  }
};

module.exports.getTomorrowsChallange = async (req, res) => {
  try {
    var tomorrow = moment().add(1, "days").format("YYYY-MM-DD");
    var currentDate = moment().format("YYYY-MM-DD");
    console.log("Tomorrow", tomorrow);
    var challange = await challangeService.findOne({
      startDate: { $lte: currentDate },
      expiryDate: { $gte: currentDate },
      company: { $eq: req.body.companyId },
    });
    if (!challange) return res.status(200).send({ msg: "No challange found" });
    console.log("challange res: ", challange);
    console.log("challange habbits: ", challange.habbits);

    return res.status(200).send(challange);
  } catch (e) {
    console.log(e);
    return res.status(400).send({ error: e.message });
  }
};

module.exports.getYesterdaysChallange = async (req, res) => {
  try {
    var yesterday = moment().subtract(1, "days").format("YYYY-MM-DD");
    var currentDate = moment().format("YYYY-MM-DD");
    console.log("Yesterday", yesterday);
    var challange = await challangeService.findOne({
      startDate: { $lte: currentDate },
      expiryDate: { $gte: currentDate },
      company: { $eq: req.body.companyId },
    });
    if (!challange) return res.status(200).send({ msg: "No challange found" });
    console.log("challange res: ", challange);
    console.log("challange habbits: ", challange.habbits);

    const updatedChallage = await checkHabbitState(
      challange,
      req.body.userId,
      yesterday
    );
    console.log("updated challange res: ", updatedChallage);
    console.log("updated challange habbits: ", updatedChallage.habbits);
    return res.status(200).send(updatedChallage);
  } catch (e) {
    console.log(e);
    return res.status(400).send({ error: e.message });
  }
};

module.exports.getChallangeForDate = async (req, res) => {
  try {
    //var tomorrow = moment().add(1, "days").format("YYYY-MM-DD");
    var challange = await challangeService.findOne({
      date: { $eq: req.body.date },
      company: { $eq: req.body.companyId },
    });
    if (!challange) return res.status(200).send({ msg: "No challange found" });
    console.log("challange res: ", challange);
    console.log("challange habbits: ", challange.habbits);

    const updatedChallage = await checkHabbitState(challange, req.body.userId);
    console.log("updated challange res: ", updatedChallage);
    console.log("updated challange habbits: ", updatedChallage.habbits);
    return res.status(200).send(updatedChallage);
  } catch (e) {
    console.log(e);
    return res.status(400).send({ error: e.message });
  }
};

module.exports.completeHabbit = async (req, res) => {
  //User Id, Habbit ID, Date//{user, habbit, date(conditional), department, company}
  console.log("completeHabbit", req.body);
  var currentDate = moment().format("YYYY-MM-DD");
  try {
    let data = req.body;
    data.date = currentDate;
    const userHabbitFound = await userHabbitService.findOne({
      user: { $eq: data.user },
      habbit: { $eq: data.habbit },
      department: { $eq: data.department },
      company: { $eq: data.company },
      date: { $eq: data.date },
    });
    if (userHabbitFound) {
      console.log("Already Done");
      const removedUser = await userHabbitService.findOneAndRemove({
        user: { $eq: data.user },
        habbit: { $eq: data.habbit },
        department: { $eq: data.department },
        company: { $eq: data.company },
        date: { $eq: currentDate },
      });
      console.log("REMOVED: ", removedUser);
      return res.status(200).send("Done");
    }
    let userHabbit = await userHabbitService.save(data);
    console.log("User Done: ", userHabbit);
    return res.status(200).send("Done");
  } catch (e) {
    console.log(e);
    return res.status(400).send({ error: e.message });
  }
};

module.exports.updateUserHabbitState = async (req, res) => {
  //User Id, Habbit ID, Date//{user, habbit, date}
  var currentDate = moment().format("YYYY-MM-DD");
  console.log("completeHabbit", req.body);
  try {
    // let data = req.body;
    // data.state = data.state == "done" ? "notDone" : "done";
    // userHabbit = await userHabbitService.save(data);
    // userHabbitService.findOne({});
    userHabbit = await userHabbitService.findOneAndRemove({
      user: { $eq: userId },
      habbit: { $eq: habbitId },
      date: { $eq: currentDate },
    });
    return res.status(200).send(userHabbit);
  } catch (e) {
    console.log(e);
    return res.status(400).send({ error: e.message });
  }
};

module.exports.query = async (req, res) => {
  let user = await challangeService.find();
  if (!user) return res.status(400).send({ error: "Sorry no user found!" });

  console.log("sss");
  const query = req.body.query;
  console.log(query);
  // console.log(query);
  let conditions = {};
  if (query.search) {
    conditions.$or = [
      { companyName: { $regex: ".*" + query.search + ".*" } },
      // { email: { $regex: ".*" + query.search + ".*" } },
    ];
  }
  let skip = query.page * query.pageSize;
  let sort = {};
  if (query.orderBy) {
    sort[query.orderBy.field] = query.orderDirection == "asc" ? 1 : -1;
  }
  console.log("ss");
  const records = await challangeService.findPopulateSkipSortLimit(
    conditions,
    "company",
    skip,
    sort,
    query.pageSize
  );
  const total = await challangeService.countDocuments(conditions);

  res.send({ data: records, page: query.page, total });
};

// {
//   path: "company",
//   // filtering field, you can use mongoDB syntax
//   match: { _id: "610e88d9deb681298804dcee" },
//   // Explicitly exclude `_id`, see http://bit.ly/2aEfTdB
//   select: "companyName -_id",
// }

// const moment = require("moment");
// const Document = require("../models/document");
// const schedule = require("node-schedule");
// const notifications = require("../notifications");
// module.exports = async function () {
//   const doc = await Document.find().populate("company");
//   doc.forEach((doc, i) => {
//     let a = moment(doc.expiry);
//     let b = moment();

//     if (a.diff(b, "days") >= 0 && a.diff(b, "minutes") >= 0) {
//       console.log(
//         "days",
//         a.diff(b, "days"),
//         "minutes",
//         a.diff(b, "minutes"),
//         "name",
//         doc.name
//       );
//       let date = new Date(doc.expiry);
//       schedule.scheduleJob(date, function () {
//         console.log("The answer to life, the universe, and everything!");
//         notifications.docExpiryEmail(doc.company, doc);
//       });
//     }
//   });
// };
