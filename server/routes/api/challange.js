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

const todayIteration = (index, user, habbitId, date, challange) =>
  new Promise(async (resolve, reject) => {
    try {
      const userHabbit = await userHabbitService.findOne({
        user: { $eq: user }, //req.body.user
        habbit: { $eq: habbitId },
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

      challange.habbits[index - 1] = {
        ...challange.habbits[index - 1],
        ...pair,
      };
      //console.log("NewChallange", challange.habbits[index]);

      console.log("Index", index - 1);
      // index++;
      resolve(challange);
    } catch (error) {
      reject(error);
    }
  });
const todayCheckHabbitState = (challange, user, date) =>
  new Promise(async (resolve, reject) => {
    try {
      // console.log("challange inside: ", challange, user, date);
      var flag = 0,
        updatedChallage;
      // var stateArr = [];
      var habbits = challange.habbits;
      const Promises = habbits.map(async (habbit) => {
        console.log("Habb: ", habbit);
        flag++;
        updatedChallage = await todayIteration(
          flag,
          user,
          habbit._id,
          date,
          challange
        );

        // const getPromise = () =>

        // await getPromise();
      });
      await Promise.all(Promises);
      // return challange;
      resolve(updatedChallage);
    } catch (error) {
      reject(error);
    }
  });

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
const checkHabbitState = (challange, user, date, weekStart, weekEnd) =>
  new Promise(async (resolve, reject) => {
    try {
      // console.log("challange inside: ", challange, user, date);
      var flag = 0,
        updatedChallage;
      // var stateArr = [];
      var habbits = challange.habbits;
      const Promises = habbits.map(async (habbit) => {
        console.log("Habb: ", habbit);
        flag++;
        updatedChallage = await iteration(
          flag,
          user,
          habbit._id,
          date,
          challange,
          weekStart,
          weekEnd
        );

        // const getPromise = () =>

        // await getPromise();
      });
      await Promise.all(Promises);
      // return challange;
      resolve(updatedChallage);
    } catch (error) {
      reject(error);
    }
  });

module.exports.getTodaysChallange = async (req, res) => {
  try {
    var currentDate = moment().format("YYYY-MM-DD");
    var challange = await challangeService.findOne({
      startDate: { $lte: currentDate },
      expiryDate: { $gte: currentDate },
      company: { $eq: req.body.companyId },
    });
    if (!challange) return res.status(200).send({ msg: "No challange found" });
    // console.log("challange res: ", challange);
    // console.log("challange habbits: ", challange.habbits);

    const updatedChallage = await todayCheckHabbitState(
      challange,
      req.body.userId,
      currentDate
    );
    console.log("updated challange res: ", updatedChallage.habbits);
    //console.log("updated challange habbits: ", updatedChallage.habbits);
    return res.status(200).send(updatedChallage);
  } catch (e) {
    console.log(e);
    return res.status(400).send({ error: e.message });
  }
};

module.exports.getDateWiseChallange = async (req, res) => {
  try {
    console.log("Date: ", req.body.date);
    // var currentDate = moment().format("YYYY-MM-DD");
    var currentDate = moment(req.body.date).format("YYYY-MM-DD");
    console.log("Date: ", currentDate);
    const weekStart = moment(req.body.date)
      .day("sunday")
      .format("YYYY-MM-DD");
    console.log(weekStart);
    var weekEnd = moment(req.body.date)
      .day("sunday")
      .add(6, "days")
      .format("YYYY-MM-DD");
    console.log(weekEnd);

    var challange = await challangeService.findOne({
      startDate: { $lte: currentDate },
      expiryDate: { $gte: currentDate },
      company: { $eq: req.body.companyId },
    });
    if (!challange) return res.status(200).send({ msg: "No challange found" });
    // console.log("challange res: ", challange);
    // console.log("challange habbits: ", challange.habbits);

    var updatedChallage = await checkHabbitState(
      challange,
      req.body.userId,
      currentDate,
      weekStart,
      weekEnd
    );
    updatedChallage = {
      ...updatedChallage,
      ...{ weekStart: weekStart },
      ...{ weekEnd: weekEnd },
    };
    console.log("updated challange res: ", updatedChallage);
    return res.status(200).send(updatedChallage);
  } catch (e) {
    console.log(e);
    return res.status(400).send({ error: e.message });
  }
};
module.exports.getTomorrowsChallange = async (req, res) => {
  try {
    var tomorrow = moment()
      .add(1, "days")
      .format("YYYY-MM-DD");
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
    var yesterday = moment()
      .subtract(1, "days")
      .format("YYYY-MM-DD");
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

    var challangeExist = await challangeService.findOne({
      expiryDate: { $gte: req.body.data.startDate },
      company: { $eq: company._id },
    });
    console.log("challangeExist: ", challangeExist);
    if (challangeExist)
      return res.status(400).send({
        error:
          "Challange in this date range already exist for respective company",
      });

    data.company = company._id;
    let challange = await challangeService.save(data);
    return res.status(200).send(challange);
  } catch (e) {
    console.log(e);
    return res.status(400).send({ error: "Something went wrong on server" });
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

module.exports.deleteChallange = async (req, res) => {
  try {
    await challangeService.findByIdAndRemove(req.params.id);
    return res.status(200).send({
      msg: "The record with the given ID has been Deleted.",
      status: 200,
    });
  } catch (e) {
    console.log(e);
    return res.status(400).send({ error: e.message });
  }
};
