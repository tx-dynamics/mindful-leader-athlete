const express = require("express");
const router = express.Router();
const _ = require("lodash");
const jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const config = require("config");
const moment = require("moment");
const companyService = require("../../models/company/companyService");
const messageService = require("../../models/message/messageService");
const userService = require("../../models/user/userService");

module.exports.getAllMessages = async (req, res) => {
  console.log("Params", req.params.roomId);
  console.log("Inside messages");
  // console.log("Departments", req.body.data.departments);
  try {
    let messages = await messageService.find({ roomId: req.params.roomId });
    return res.status(200).send(messages);
  } catch (e) {
    console.log(e);
    return res.status(400).send({ error: e.message });
  }

  // const user = await userService.find({
  //   _id: "6113d0fe704e961da474cae7",
  //   $or: [
  //     { company: "610e88d9deb681298804dcef" },
  //     { department: "610e88d9deb681298804dcef" },
  //   ],
  // });
  // console.log("User: ", user);
  // var currentDate = moment().format("YYYY-MM-DD");
  // var currentTime = moment().format("HH:mm:ss");
  // console.log("current :", currentDate, "Time: ", currentTime);
};
