var mongoose = require("mongoose");
const Joi = require("@hapi/joi"); //for validating data in mongoose

const modelSchema = new mongoose.Schema(
  {
    challangeTitle: String,
    // companyName: String,
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },
    startDate: Date,
    expiryDate: Date,
    habbits: [
      {
        habbitTitle: String,
        habbitDescription: String,
      },
    ],
    //   expiryDate: Date,
  },
  { timestamps: true }
);

// modelSchema.virtual("allHabits", {
//   ref: "Habbit", //The Model to use
//   localField: "_id", //Find in Model, where localField
//   foreignField: "habbit", // is equal to foreignField
// });

// Set Object and Json property to true. Default is set to false
// modelSchema.set("toObject", { virtuals: true });
// modelSchema.set("toJSON", { virtuals: true });

modelSchema.statics.validate = function (data) {
  const schema = Joi.object({
    // _id: Joi.string(),
    challangeTitle: Joi.string().required(),
    company: Joi.string().required(),
    date: Joi.date().required(),
    // expiryDate: Joi.date().required(),
    // habbits: Joi.array({
    //   habbitTitle: Joi.string().required(),
    //   habbitDescription: Joi.string().required(),
    // }),
  }).options({ abortEarly: false });
  return schema.validate(data);
};

modelSchema.statics.validateUpdate = function (data) {
  const schema = Joi.object({
    challangeTitle: Joi.string().required(),
    company: Joi.string().required(),
    date: Joi.date().required(),
    // challangeTitle: Joi.string(),
    // startDate: Joi.date(),
    //  expiryDate: Joi.date(),
    // habbits: Joi.array({
    //   habbitTitle: Joi.string(),
    //   habbitDescription: Joi.string(),
    // }),
  }).options({ abortEarly: false });
  return schema.validate(data);
};

const Challange = mongoose.model("Challange", modelSchema);
module.exports.Challange = Challange;
// module.exports.validate = validate;
// module.exports.validateUpdate = validateUpdate;
