var mongoose = require("mongoose");
const Joi = require("@hapi/joi"); //for validating data in mongoose

const modelSchema = new mongoose.Schema({
  email: String,
  password: String,
  name: String,
});

const Admin = mongoose.model("Admin", modelSchema);
module.exports.Admin = Admin;
