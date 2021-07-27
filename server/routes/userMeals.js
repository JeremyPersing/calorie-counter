const { UserMeals, validateRequest } = require("../models/userMeals");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const auth = require("../middleware/auth");

const getMealByMealNameAndBrand = async (userId, mealName, mealBrand) => {
  let { meals } = await UserMeals.findOne({ user_id: userId }).set("food_name");

  if (meals.length === 0) return;

  let meal;
  for (const i in meals) {
    if (mealBrand !== "null") {
      if (
        meals[i].brand_name === mealBrand &&
        meals[i].food_name === mealName
      ) {
        meal = meals[i];
        break;
      }
    } else {
      if (meals[i].brand_name === null && meals[i].food_name === mealName) {
        meal = meals[i];
        break;
      }
    }
  }

  return meal;
};

const getMealById = async (userId, mealId) => {
  let res = await UserMeals.findById(userId).set("food_name");
  const meals = res.meals;

  if (meals.length === 0) return;

  let meal;
  for (let i in meals) {
    let currId = meals[i]._id.toString();

    if (currId === mealId) {
      meal = meals[i];
      break;
    }
  }

  console.log("MEAL", meal);

  return meal;
};

const getConsumedMealById = async (userId, mealId) => {
  let res = await UserMeals.findById(userId).set("food_name");
  const meals = res.consumed_meals;

  if (meals.length === 0) return;

  let meal;
  for (let i in meals) {
    let currId = meals[i]._id.toString();

    if (currId === mealId) {
      meal = meals[i];
      break;
    }
  }

  return meal;
}

const getMealByName = async (userId, mealName) => {
  let { meals } = await UserMeals.findOne({ user_id: userId }).set("food_name");

  if (meals.length === 0) return;

  const index = meals.findIndex((m) => m.food_name === mealName);

  if (index === -1) return;

  return meals[index];
};
// Works
router.get("/", auth, async (req, res) => {
  const { meals } = await UserMeals.findOne({ user_id: req.user._id });
  res.send(meals);
});

router.get("/consumedmeals", auth, async(req, res) => {
  const {consumed_meals} = await UserMeals.findOne({user_id: req.user._id});
  res.send(consumed_meals)
})

// Works
router.get("/liked", auth, async (req, res) => {
  const userAccount = await UserMeals.findOne({ user_id: req.user._id });

  const meals = userAccount.meals.filter((m) => m.liked === true);
  res.send(meals);
});

router.get("/:mealname", auth, async (req, res) => {
  try {
    const meal = await getMealByName(req.user._id, req.params.mealname);

    if (!meal) res.status(404).send("Meal could not be found");

    res.send(meal);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

router.get("/id/:id", auth, async (req, res) => {
  try {
    const meal = await getMealById(req.user._id, req.params.id);

    if (!meal) res.status(404).send("Meal could not be found");

    res.send(meal);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

// works
router.get("/search/:query", auth, async (req, res) => {
  let { meals } = await UserMeals.findOne({ user_id: req.user._id }).set(
    "food_name"
  );

  const matches = [];
  let query = req.params.query.trim().toLowerCase();

  if (query !== "") {
    for (const i in meals) {
      let item_name = meals[i].food_name
        .trim()
        .replace(/\s/g, "")
        .toLowerCase();
      let brand_name;
      meals[i].brand_name
        ? (brand_name = meals[i].brand_name
            .trim()
            .replace(/\s/g, "")
            .toLowerCase())
        : (brand_name = "");

      if (item_name.includes(query)) {
        console.log("pushing meal", meals[i]);
        matches.push(meals[i]);
      } else if (brand_name.includes(query)) {
        console.log("pushing meal due to brand name", meals[i]);
        matches.push(meals[i]);
      }
    }
  }

  // if (matches.length === 0) return res.status(404).send("404: Not found");

  res.send(matches);
});
// Needs Work
router.get("/:mealname/:mealbrand", auth, async (req, res) => {
  try {
    // Returns an empty
    let userMeal = await getMealByMealNameAndBrand(
      req.user._id,
      req.params.mealname,
      req.params.mealbrand
    );

    if (!userMeal) return res.status(404).send("404: Not found");

    res.send(userMeal);
  } catch (error) {
    return res.status(500).send("500: Internal Server Error");
  }
});

router.post("/", auth, async (req, res) => {
  const result = validateRequest(req.body);
  if (result.error) return res.status(400).send(result.error.message);

  const potentialMeal = await getMealByName(req.user._id, req.body.food_name);
  if (potentialMeal)
    return res.status(409).send("Meal Already Exists, choose a different name");

  var id = mongoose.Types.ObjectId();

  let meal = {
    food_name: req.body.food_name,
    brand_name: req.body.brand_name || null,
    serving_qty: req.body.serving_qty,
    serving_unit: req.body.serving_unit || "meal",
    serving_weight_grams: req.body.serving_weight_grams,
    nf_calories: req.body.nf_calories,
    nf_protein: req.body.nf_protein,
    nf_total_carbohydrate: req.body.nf_total_carbohydrate,
    nf_total_fat: req.body.nf_total_fat,
    nix_item_id: req.body.nix_item_id,
    photo: {
      thumb: req.body.thumb,
    },
    sub_recipe: req.body.sub_recipe,
    liked: req.body.liked,
    created_meal: req.body.created_meal,
    user_meal: req.body.user_meal,
    _id: id,
  };

  try {
    await UserMeals.findOneAndUpdate(
      { user_id: req.user._id },
      { $addToSet: { meals: meal } }
    );

    res.send(meal);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

// Works Create the object to hold the user's data once, then put to that object
router.post("/createaccount", auth, async (req, res) => {
  const userMeals = new UserMeals({
    user_id: req.user._id,
    meals: [],
    consumed_meals: [],
    _id: req.user._id,
  });

  try {
    const meals = await userMeals.save();
    res.send(meals);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

router.post("/consumedmeals", auth, async (req, res) => {
  if (req.body.sub_recipe === null) req.body.sub_recipe = [];
  const result = validateRequest(req.body)
  console.log(result)
  if (result.error) return res.status(400).send(result.error.message);


  let meal = {
    food_name: req.body.food_name,
    brand_name: req.body.brand_name || null,
    serving_qty: req.body.serving_qty,
    serving_unit: req.body.serving_unit || "meal",
    serving_weight_grams: req.body.serving_weight_grams,
    nf_calories: req.body.nf_calories,
    nf_protein: req.body.nf_protein,
    nf_total_carbohydrate: req.body.nf_total_carbohydrate,
    nf_total_fat: req.body.nf_total_fat,
    nix_item_id: req.body.nix_item_id,
    photo: {
      thumb: req.body.thumb,
    },
    sub_recipe: req.body.sub_recipe,
    liked: req.body.liked,
    created_meal: req.body.created_meal,
    user_meal: req.body.user_meal,
    _id: req.body._id
  };

  try {
    await UserMeals.findOneAndUpdate(
      { user_id: req.user._id },
      { $addToSet: { consumed_meals: meal } }
    );

    res.send(meal)
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
})

// To edit a meal the meal must be part of the user's meals and therefore has an _id key
router.put("/:id", auth, async (req, res) => {
  if (req.body._id) delete req.body._id
  const result = validateRequest(req.body);
  if (result.error) return res.status(400).send(result.error.message);

  let meal = {
    food_name: req.body.food_name,
    brand_name: req.body.brand_name,
    serving_qty: req.body.serving_qty,
    serving_unit: req.body.serving_unit,
    serving_weight_grams: req.body.serving_weight_grams,
    nf_calories: req.body.nf_calories,
    nf_protein: req.body.nf_protein,
    nf_total_carbohydrate: req.body.nf_total_carbohydrate,
    nf_total_fat: req.body.nf_total_fat,
    nix_item_id: req.body.nix_item_id,
    photo: {
      thumb: req.body.thumb,
    },
    sub_recipe: req.body.sub_recipe,
    liked: req.body.liked,
    created_meal: req.body.created_meal,
    user_meal: req.body.user_meal,
  };

  // Mongoose not allowing to look up and find specific subdocument
  // so find the user document
  try {
    let userObj = await UserMeals.findById(req.user._id);

    const meals = userObj.meals;

    let index = -1;
    for (const i in meals) {
      let idString = meals[i]._id.toString();
      if (idString === req.params.id) {
        index = i;
        meal._id = meals[i]._id;
        break;
      }
    }

    if (index === -1) return res.status(404).send("404: Not Found");
    console.log("index", index);
    userObj.meals[index] = meal;

    const updatedUserObj = await userObj.save();
    res.send(updatedUserObj);
  } catch (error) {
    return res.status(404).send("404: Not Found");
  }
});

router.put("/consumedmeals/:id", auth, async(req, res) => {
  if (req.body._id) delete req.body._id
  const result = validateRequest(req.body)
  console.log(result)
  if (result.error) return res.status(400).send(result.error.message)


  let meal = {
    food_name: req.body.food_name,
    brand_name: req.body.brand_name,
    serving_qty: req.body.serving_qty,
    serving_unit: req.body.serving_unit,
    serving_weight_grams: req.body.serving_weight_grams,
    nf_calories: req.body.nf_calories,
    nf_protein: req.body.nf_protein,
    nf_total_carbohydrate: req.body.nf_total_carbohydrate,
    nf_total_fat: req.body.nf_total_fat,
    nix_item_id: req.body.nix_item_id,
    photo: {
      thumb: req.body.thumb,
    },
    sub_recipe: req.body.sub_recipe,
    liked: req.body.liked,
    created_meal: req.body.created_meal,
    user_meal: req.body.user_meal,
    servings: req.body.servings
  };

  try {
    let userObj = await UserMeals.findById(req.user._id);

    const meals = userObj.consumed_meals;

    let index = -1;
    for (const i in meals) {
      let idString = meals[i]._id.toString();
      if (idString === req.params.id) {
        index = i;
        meal._id = meals[i]._id;
        break;
      }
    }

    if (index === -1) return res.status(404).send("404: Not Found");
 
    userObj.consumed_meals[index] = meal;

    const updatedUserObj = await userObj.save();
    res.send(updatedUserObj);
  } catch (error) {
    return res.status(404).send("404: Not Found");
  }
})

router.delete("/:id", auth, async (req, res) => {
  try {
    const meal = await getMealById(req.user._id, req.params.id);
    if (!meal) return res.status(404).send(`404: Not found`);

    const userMeal = await UserMeals.updateOne(
      { user_id: req.user._id },
      {
        $pull: { meals: meal },
      }
    );

    console.log("userMeal", userMeal);
    if (!userMeal) return res.status(404).send(`404: Not found`);

    res.send(userMeal);
  } catch (error) {
    return res.status(500).send("500: Internal Server Error");
  }
});

router.delete("/consumedmeals/:id", auth, async(req,res) => {
  try {
    const meal = await getConsumedMealById(req.user._id, req.params.id);
    if (!meal) return res.status(404).send(`404: Not found`);

    const userMeal = await UserMeals.updateOne(
      {user_id: req.user._id},
      {
        $pull: {consumed_meals: meal}
      }
    )

    if (!userMeal) return res.status(404).send(`404: Not found`);

    res.send(userMeal);
  } catch (error) {
    return res.status(500).send("500: Internal Server Error");
  }
})

module.exports = router;
