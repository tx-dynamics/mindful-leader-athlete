var mongoose = require("mongoose");
const Joi = require("@hapi/joi"); //for validating data in mongoose

const modelSchema = new mongoose.Schema(
  {
    companyName: String,
    companyDomain: String,
    departments: [
      {
        pod: String,
      },
    ],
  },
  { timestamps: true }
);

modelSchema.statics.validate = function (data) {
  const schema = Joi.object({
    // _id: Joi.string(),
    companyName: Joi.string().required(),
    companyDomain: Joi.string().required(),
    departments: Joi.array({
      pod: Joi.string().required(),
    }),
  }).options({ abortEarly: false });
  return schema.validate(data);
};

modelSchema.statics.validateUpdate = function (data) {
  const schema = Joi.object({
    companyName: Joi.string(),
    companyDomain: Joi.string(),
    departments: Joi.array(),
  }).options({ abortEarly: false });
  return schema.validate(data);
};

const Company = mongoose.model("Company", modelSchema);
module.exports.Company = Company;
// module.exports.validate = validate;
// module.exports.validateUpdate = validateUpdate;
