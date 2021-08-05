const dotenv = require("dotenv");
dotenv.config();
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const Joi = require("Joi");

const googleUserSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 1, maxlength: 50 },
  email: {
    type: String,
    unique: true,
    required: true,
    minlength: 3,
    maxlength: 255,
  },
  googleId: { type: String, required: true },
});

googleUserSchema.methods.generateAuthToken = function () {
  return jwt.sign({ _id: this._id }, process.env.jwtPrivateKey);
};

const GoogleUser = mongoose.model("GoogleUser", googleUserSchema);

const validateGoogleRequest = (user) => {
  const schema = Joi.object({
    name: Joi.string().trim().required().min(1).max(50),
    email: Joi.string().trim().required().min(3).max(255).email(),
    googleId: Joi.string().required().min(1).max(255),
  });

  return schema.validate(user);
};

exports.GoogleUser = GoogleUser;
exports.validateGoogleRequest = validateGoogleRequest;
