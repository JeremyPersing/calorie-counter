const { User } = require("../models/user");
const { GoogleUser, validateGoogleRequest } = require("../models/googleUser");
const {
  FacebookUser,
  validateFacebookRequest,
} = require("../models/facebookUser");
const _ = require("lodash");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const Joi = require("joi");

router.post("/", async (req, res) => {
  const result = validateRequest(req.body);
  if (result.error) return res.status(400).send(result.error.message);

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid email or password");

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid email or password");

  const token = user.generateAuthToken();

  res.send(token);
});

router.post("/google", async (req, res) => {
  const result = validateGoogleRequest(req.body);
  if (result.error) return res.status(400).send(result.error.message);

  let user = await GoogleUser.findOne({ email: req.body.email });
  if (!user)
    return res
      .status(400)
      .send("User not registered. Head to the register page");

  const token = user.generateAuthToken();

  res.send(token);
});

router.post("/facebook", async (req, res) => {
  const result = validateFacebookRequest(req.body);
  if (result.error) return res.status(400).send(result.error.message);

  let user = await FacebookUser.findOne({ email: req.body.email });

  if (!user)
    return res
      .status(400)
      .send("User not registered. Head to the register page");

  const token = user.generateAuthToken();

  res.send(token);
});

const validateRequest = (user) => {
  const schema = Joi.object({
    email: Joi.string().required().min(5).max(255).email(),
    password: Joi.string().required().min(5).max(255),
  });

  return schema.validate(user);
};

module.exports = router;
