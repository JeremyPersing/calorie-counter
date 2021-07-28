const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");
const Joi = require("joi");

const userStatsSchema = new mongoose.Schema({
  userStats: {
    age: { type: Number, required: true },
    bodyWeight: { type: Number, required: true },
    gender: { type: String, required: true },
    height: { type: Number, required: true },
    exerciseLevel: { type: String, required: true },
    maintenanceCalories: { type: Number, required: true },
    currentCalories: { type: Number, required: true },
    dietPlan: { type: String, required: true },
    dietStartDate: {type: Date, required: true},
    dietThreeWeekDate: {type: Date, required: true},
    dietSixWeekDate: {type: Date, required: true},
    dietNineWeekDate: {type: Date, required: true},
  },
});

const UserStats = mongoose.model("UserStats", userStatsSchema);

const validateRequest = (user) => {
  const schema = Joi.object({
    age: Joi.number().required().min(1),
    bodyWeight: Joi.number().required().min(1),
    gender: Joi.string().trim().required(),
    height: Joi.number().required(),
    exerciseLevel: Joi.string().trim().required(),
    maintenanceCalories: Joi.number().required(),
    currentCalories: Joi.number().required(),
    dietPlan: Joi.string().required(),
  });

  return schema.validate(user);
};

exports.UserStats = UserStats;
exports.validateRequest = validateRequest;
