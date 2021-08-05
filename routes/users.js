const { User, validateRequest } = require("../models/user");
const { GoogleUser, validateGoogleRequest } = require("../models/googleUser");
const {
  FacebookUser,
  validateFacebookRequest,
} = require("../models/facebookUser");
const _ = require("lodash");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const auth = require("../middleware/auth");

router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.send(user);
});

router.post("/", async (req, res) => {
  const result = validateRequest(req.body);
  if (result.error) {
    return res.status(400).send(result.error.message);
  }

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("Email already registered");
  if (!user) user = await FacebookUser.findOne({ email: req.body.email });
  if (user)
    return res.status(400).send("Email already registered with Facebook");
  if (!user) user = await GoogleUser.findOne({ email: req.body.email });
  if (user) return res.status(400).send("Email already registered with Google");

  user = new User({
    name: req.body.name.trim(),
    email: req.body.email.trim(),
    password: req.body.password,
  });

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  await user.save();

  const token = user.generateAuthToken();

  res
    .header("x-auth-token", token)
    .header("access-control-expose-headers", "x-auth-token")
    .send(_.pick(user, ["_id", "name", "email"]));
});

router.post("/google", async (req, res) => {
  const result = validateGoogleRequest(req.body);
  if (result.error) return res.status(400).send(result.error.message);

  let user = await GoogleUser.findOne({ email: req.body.email });
  if (!user) user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered");
  if (!user) user = await FacebookUser.findOne({ email: req.body.email });
  if (user)
    return res.status(400).send("User already registered with Facebook");

  user = new GoogleUser({
    name: req.body.name.trim(),
    email: req.body.email.trim(),
    googleId: req.body.googleId,
  });

  await user.save();

  const token = user.generateAuthToken();

  res
    .header("x-auth-token", token)
    .header("access-control-expose-headers", "x-auth-token")
    .send(_.pick(user, ["_id", "name", "email"]));
});

router.post("/facebook", async (req, res) => {
  const result = validateFacebookRequest(req.body);
  if (result.error) return res.status(400).send(result.error.message);

  let user = await FacebookUser.findOne({ email: req.body.email });
  if (!user) user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered");
  if (!user) user = await GoogleUser.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered with Google");

  user = new FacebookUser({
    name: req.body.name.trim(),
    email: req.body.email.trim(),
    id: req.body.id,
  });

  await user.save();

  const token = user.generateAuthToken();

  res
    .header("x-auth-token", token)
    .header("access-control-expose-headers", "x-auth-token")
    .send(_.pick(user, ["_id", "name", "email"]));
});
module.exports = router;
