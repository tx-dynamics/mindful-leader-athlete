var mongoose = require("mongoose");
const Joi = require("@hapi/joi"); //for validating data in mongoose

const modelSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    habbitTitle: String,
    habbitDescription: String,
    department: String,
    company: String,
    challange: String,
    startDate: String,
    expiryDate: String,
    //   expiryDate: Date,
  },
  { timestamps: true }
);

// modelSchema.statics.validate = function (data) {
//   const schema = Joi.object({
//     // _id: Joi.string(),
//     challangeTitle: Joi.string().required(),
//     company: Joi.string().required(),
//     date: Joi.date().required(),
//   }).options({ abortEarly: false });
//   return schema.validate(data);
// };

// modelSchema.statics.validateUpdate = function (data) {
//   const schema = Joi.object({
//     challangeTitle: Joi.string().required(),
//     company: Joi.string().required(),
//     date: Joi.date().required(),
//     // challangeTitle: Joi.string(),
//     // startDate: Joi.date(),
//     //  expiryDate: Joi.date(),
//     // habbits: Joi.array({
//     //   habbitTitle: Joi.string(),
//     //   habbitDescription: Joi.string(),
//     // }),
//   }).options({ abortEarly: false });
//   return schema.validate(data);
// };

const SpecialHabbit = mongoose.model("SpecialHabbit", modelSchema);
module.exports.SpecialHabbit = SpecialHabbit;
// module.exports.validate = validate;
// module.exports.validateUpdate = validateUpdate;
