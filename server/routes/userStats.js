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
      dailyStats: {
        mealsConsumed: [],
        totalCaloriesConsumed: 0,
      },
    },
  });

  try {
    await userStats.save();

    res.send(userStats);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

const validateDailyStats = (user) => {
  const schema = Joi.object({
    age: Joi.number().required().min(1),
    bodyWeight: Joi.number().required().min(1),
    gender: Joi.string().trim().required(),
    height: Joi.number().required(),
    exerciseLevel: Joi.string().trim().required(),
    maintenanceCalories: Joi.number().required(),
    currentCalories: Joi.number().required(),
    dietPlan: Joi.string().required(),
    mealsConsumed: Joi.array().required(),
    totalCaloriesConsumed: Joi.number().required(),
  });

  return schema.validate(user);
};

router.put("/dailystats", auth, async (req, res) => {
  const result = validateDailyStats(req.body);
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
        dailyStats: {
          mealsConsumed: req.body.mealsConsumed,
          totalCaloriesConsumed: req.body.totalCaloriesConsumed,
        },
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
