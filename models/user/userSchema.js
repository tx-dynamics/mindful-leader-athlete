var mongoose = require("mongoose");
const Joi = require("@hapi/joi"); //for validating data in mongoose

const modelSchema = new mongoose.Schema(
  {
    fullName: String,
    email: {
      type: String,
      unique: true,
    },
    password: String,
    gender: String,
    birthday: String,
    role: { type: String, default: "user" },
    verified: { type: Boolean, default: false },
    company: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
    department: String,
  },
  { timestamps: true }
);

modelSchema.statics.validate = function (data) {
  const schema = Joi.object({
    _id: Joi.string(),
    fullName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(1024).required(),
    gender: Joi.string(),
    birthday: Joi.string(),
  }).options({ abortEarly: false });
  return schema.validate(data);
};

modelSchema.statics.validateUpdate = function (data) {
  const schema = Joi.object({
    fullName: Joi.string(),
    email: Joi.string().email(),
    gender: Joi.string(),
    birthday: Joi.string(),
  }).options({ abortEarly: false });
  return schema.validate(data);
};

const User = mongoose.model("User", modelSchema);
module.exports.User = User;
// module.exports.validate = validate;
// module.exports.validateUpdate = validateUpdate;
