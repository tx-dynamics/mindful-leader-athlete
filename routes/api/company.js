const express = require("express");
const router = express.Router();
const _ = require("lodash");
const jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const config = require("config");

const companyService = require("../../models/company/companyService");
const challangeService = require("../../models/challange/challangeService");

module.exports.createCompany = async (req, res) => {
  console.log("createCompany", req.body);
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

module.exports.getCompanyDepartments = async (req, res) => {
  const domain = user.email.substring(user.email.lastIndexOf("@") + 1);
  const company = await companyService.findOne({
    companyDomain: domain,
  });
  if (!company)
    return res
      .status(400)
      .send({ error: "Company with this email domain does not exist." });
};

module.exports.getSingleCompany = async (req, res) => {
  console.log("getSingleCompany params", req.params.id);
  // console.log("Departments", req.body.data.departments);
  try {
    //let data = req.body.data;
    let company = await companyService.findOne({ _id: req.params.id });
    return res.status(200).send(company);
  } catch (e) {
    console.log(e);
    return res.status(400).send({ error: e.message });
  }
};

module.exports.updateCompany = async (req, res) => {
  console.log("getSingleCompany params", req.params.id);
  console.log("Company", req.body);
  try {
    let data = req.body;
    let company = await companyService.findOneAndUpdate(
      { _id: req.params.id },
      data
    );
    return res.status(200).send(company);
  } catch (e) {
    console.log(e);
    return res.status(400).send({ error: e.message });
  }
};

module.exports.query = async (req, res) => {
  let user = await companyService.find();
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
  const records = await companyService.findSkipSortLimit(
    conditions,
    skip,
    sort,
    query.pageSize
  );
  const total = await companyService.countDocuments(conditions);

  res.send({ data: records, page: query.page, total });
};
