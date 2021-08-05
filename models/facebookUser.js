const dotenv = require("dotenv");
dotenv.config();
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const Joi = require("Joi");

const facebookUserSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 1, maxlength: 50 },
  email: {
    type: String,
    unique: true,
    required: true,
    minlength: 3,
    maxlength: 255,
  },
  id: { type: String, required: true },
});

facebookUserSchema.methods.generateAuthToken = function () {
  return jwt.sign({ _id: this._id }, process.env.jwtPrivateKey);
};

const FacebookUser = mongoose.model("FacebookUser", facebookUserSchema);

const validateFacebookRequest = (user) => {
  const schema = Joi.object({
    name: Joi.string().trim().required().min(1).max(50),
    email: Joi.string().trim().required().min(3).max(255).email(),
    id: Joi.string().required().min(1).max(255),
  });

  return schema.validate(user);
};

exports.FacebookUser = FacebookUser;
exports.validateFacebookRequest = validateFacebookRequest;
