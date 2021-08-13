const express = require("express");
const router = express.Router();
const _ = require("lodash");
const jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const config = require("config");

const companyService = require("../../models/company/companyService");

module.exports.getAllMessages = async (req, res) => {
  // console.log("createCompany", req.body);
  console.log("Inside messages");
  // console.log("Departments", req.body.data.departments);
  try {
    let data = req.body.data;
    let company = await companyService.save(data);
    return res.status(200).send(company);
  } catch (e) {
    console.log(e);
    return res.status(400).send({ error: e.message });
  }
};
