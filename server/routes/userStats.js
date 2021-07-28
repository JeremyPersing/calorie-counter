const { UserStats, validateRequest } = require("../models/userStats");
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Joi = require("joi");

// req.user is set to a decoded jwt in the auth middleware and we can connect to each
// userStats id with that in place
router.get("/", auth, async (req, res) => {
  const userStats = await UserStats.findById(req.user._id);

  if (!userStats) return res.status(404).send(`404: Not found`);

  res.send(userStats);
});

router.put("/", auth, async (req, res) => {
  const result = validateRequest(req.body);
  if (result.error) {
    return res.status(400).send(result.error.message);
  }

  const userStats = await UserStats.findByIdAndUpdate(
    req.user._id,
    {
      userStats: {
        age: req.body.age,
        bodyWeight: req.body.bodyWeight,
        currentCalories: req.body.currentCalories,
        dietPlan: req.body.dietPlan,
        exerciseLevel: req.body.exerciseLevel,
        gender: req.body.gender,
        height: req.body.height,
        maintenanceCalories: req.body.maintenanceCalories,
      },
    },
    {
      new: true,
    }
  );

  if (!userStats) return res.status(404).send(`404: Not found`);

  res.send(userStats);
});

router.post("/", auth, async (req, res) => {
  const result = validateRequest(req.body);

  if (result.error) {
    return res.status(400).send(result.error.message);
  }

  const dateOne = new Date();
  const dateThree = new Date();
  const dateSix = new Date();
  const dateNine = new Date();
  dateThree.setDate(dateThree.getDate() + 3 * 7);
  dateSix.setDate(dateSix.getDate() + 6 * 7);
  dateNine.setDate(dateNine.getDate() + 9 * 7);

  const userStats = new UserStats({
    _id: req.user._id,
    userStats: {
      age: req.body.age,
      bodyWeight: req.body.bodyWeight,
      currentCalories: req.body.currentCalories,
      dietPlan: req.body.dietPlan,
      exerciseLevel: req.body.exerciseLevel,
      gender: req.body.gender,
      height: req.body.height,
      maintenanceCalories: req.body.maintenanceCalories,
      dietStartDate: dateOne.toString(),
      dietThreeWeekDate: dateThree.toString(),
      dietSixWeekDate: dateSix.toString(),
      dietNineWeekDate: dateNine.toString(),
    },
  });

  try {
    await userStats.save();

    res.send(userStats);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

router.put("/dailystats", auth, async (req, res) => {
  const result = validateRequest(req.body);
  if (result.error) {
    return res.status(400).send(result.error.message);
  }

  const userStats = await UserStats.findByIdAndUpdate(
    req.user._id,
    {
      userStats: {
        age: req.body.age,
        bodyWeight: req.body.bodyWeight,
        currentCalories: req.body.currentCalories,
        dietPlan: req.body.dietPlan,
        exerciseLevel: req.body.exerciseLevel,
        gender: req.body.gender,
        height: req.body.height,
        maintenanceCalories: req.body.maintenanceCalories,
      },
    },
    {
      new: true,
    }
  );

  if (!userStats) return res.status(404).send(`404: Not found`);

  res.send(userStats);
});

router.put("/newdiet", auth, async (req, res) => {
  const result = validateRequest(req.body);
  if (result.error) {
    return res.status(400).send(result.error.message);
  }

  const dateOne = new Date();
  const dateThree = new Date();
  const dateSix = new Date();
  const dateNine = new Date();
  dateThree.setDate(dateThree.getDate() + 3 * 7);
  dateSix.setDate(dateSix.getDate() + 6 * 7);
  dateNine.setDate(dateNine.getDate() + 9 * 7);




  const userStats = await UserStats.findByIdAndUpdate(
    req.user._id,
    {
      userStats: {
        age: req.body.age,
        bodyWeight: req.body.bodyWeight,
        currentCalories: req.body.currentCalories,
        dietPlan: req.body.dietPlan,
        exerciseLevel: req.body.exerciseLevel,
        gender: req.body.gender,
        height: req.body.height,
        maintenanceCalories: req.body.maintenanceCalories,
        dietStartDate: dateOne.toString(),
        dietThreeWeekDate: dateThree.toString(),
        dietSixWeekDate: dateSix.toString(),
        dietNineWeekDate: dateNine.toString(),
      },
    },
    {
      new: true,
    }
  );

  if (!userStats) return res.status(404).send(`404: Not found`);

  res.send(userStats);
});

module.exports = router;
