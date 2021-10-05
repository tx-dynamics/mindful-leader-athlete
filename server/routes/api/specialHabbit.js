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
const specialHabbitService = require("../../models/specialHabbit/specialHabbitService");
const moment = require("moment");

module.exports.addSpecialHabbit = async (req, res) => {
  // var name = req.body.email.substring(0, req.body.email.lastIndexOf("@"));
  // const domain = req.body.email.substring(req.body.email.lastIndexOf("@") + 1);
  try {
    var currentDate = moment().format("YYYY-MM-DD");
    let data = req.body;
    data.startDate = currentDate;
    data.special = true;
    specialHabbit = await specialHabbitService.save(data);
    return res.status(200).send(specialHabbit);
  } catch (e) {
    console.log(e);
    return res.status(400).send({ error: e.message });
  }
};

module.exports.editSpecialHabbit = async (req, res) => {
  // var name = req.body.email.substring(0, req.body.email.lastIndexOf("@"));
  // const domain = req.body.email.substring(req.body.email.lastIndexOf("@") + 1);
  try {
    let data = req.body;
    data.special = true;
    let specialHabbit = await specialHabbitService.findOneAndUpdate(
      { _id: req.params.id },
      data
    );
    return res.status(200).send(specialHabbit);
  } catch (e) {
    console.log(e);
    return res.status(400).send({ error: e.message });
  }
};
