var mongoose = require("mongoose");
const Joi = require("@hapi/joi"); //for validating data in mongoose

const modelSchema = new mongoose.Schema(
  {
    text: String,
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    userName: String,
    date: String,
    time: String,
  },
  { timestamps: true }
);

// modelSchema.statics.validate = function (data) {
//   const schema = Joi.object({
//     // _id: Joi.string(),
//     habbitName: Joi.string().required(),
//     habbitDescription: Joi.string().required(),
//     challange: Joi.string().required(),
//   }).options({ abortEarly: false });
//   return schema.validate(data);
// };

// modelSchema.statics.validateUpdate = function (data) {
//   const schema = Joi.object({
//     habbitName: Joi.string(),
//     habbitDescription: Joi.string(),
//     challange: Joi.string(),
//   }).options({ abortEarly: false });
//   return schema.validate(data);
// };

const Message = mongoose.model("Message", modelSchema);
module.exports.Message = Message;
// module.exports.validate = validate;
// module.exports.validateUpdate = validateUpdate;
