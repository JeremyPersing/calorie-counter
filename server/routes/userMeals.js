const {
  UserMeals,
  validateRequest,
  validateSearchRequest,
} = require("../models/userMeals");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const auth = require("../middleware/auth");

const getMealByMealNameAndBrand = async (userId, mealName, mealBrand) => {
  // let meals = await UserMeals.aggregate([
  //   { $unwind: "$meals" },
  //   {
  //     $match: {
  //       brand_name: mealBrand,
  //     },
  //   },
  // ]);

  // console.log(meals);
  console.log(mealName, mealBrand);
  let { meals } = await UserMeals.findOne({ user_id: userId }).set("food_name");

  if (meals.length === 0) return;

  // const brand = mealBrand.trim().toLowerCase();
  // const name = mealName.trim().toLowerCase();

  let meal;
  for (const i in meals) {
    if (meals[i].brand_name === mealBrand && meals[i].food_name === mealName) {
      meal = meals[i];
      break;
    }
  }
  console.log("Meal being returned", meal);

  return meal;
};

// Works
router.get("/", auth, async (req, res) => {
  const { meals } = await UserMeals.findOne({ user_id: req.user._id });
  res.send(meals);
});

// Works
router.get("/liked", auth, async (req, res) => {
  const userAccount = await UserMeals.findOne({ user_id: req.user._id });

  const meals = userAccount.meals.filter((m) => m.liked === true);
  res.send(meals);
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
      let brand_name = meals[i].brand_name
        .trim()
        .replace(/\s/g, "")
        .toLowerCase();

      if (item_name.includes(query)) matches.push(meals[i]);
      else if (brand_name.includes(query)) matches.push(meals[i]);
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

// Works Create the object to hold the user's data once, then put to that object
router.post("/createaccount", auth, async (req, res) => {
  const userMeals = new UserMeals({
    user_id: req.user._id,
    meals: [],
    _id: req.user._id,
  });

  try {
    const meals = await userMeals.save();
    res.send(meals);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

// Works
router.post("/", auth, async (req, res) => {
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
    nix_item_id: req.body.nix_item_id || null,
    photo: {
      thumb: req.body.thumb,
    },
    sub_recipe: req.body.sub_recipe,
    liked: req.body.liked,
    created_meal: req.body.created_meal,
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

// router.post("/search", auth, async (req, res) => {
//   const result = validateSearchRequest(req.body);
//   if (result.error) {
//     return res.status(400).send(result.error.message);
//   }

//   let meal = {
//     fields: {
//       brand_name: req.body.brand_name || "Homemade",
//       item_name: req.body.item_name,
//       item_id: req.body.item_id,
//       ingredients: req.body.ingredients || [],
//       liked: req.body.liked || false,
//       nf_calories: req.body.nf_calories,
//       nf_protein: req.body.nf_protein,
//       nf_total_carbohydrate: req.body.nf_total_carbohydrate,
//       nf_total_fat: req.body.nf_total_fat,
//       servings: req.body.servings || 1,
//     },
//     _id: req.body._id,
//   };

//   try {
//     await UserMeals.findOneAndUpdate(
//       { user_id: req.user._id },
//       { $addToSet: { meals: meal } }
//     );
//     res.send(meal);
//   } catch (error) {
//     res.status(500).send("Internal Server Error");
//   }
// });

// also use for the /search/:id previous connections
router.put("/:id", auth, async (req, res) => {
  const result = validateRequest(req.body);
  if (result.error) return res.status(400).send(result.error.message);

  let meal = {
    fields: {
      brand_name: req.body.brand_name || "Homemade",
      item_name: req.body.item_name,
      ingredients: req.body.ingredients || [],
      liked: req.body.liked || false,
      item_id: req.params.id,
      nf_calories: req.body.nf_calories,
      nf_protein: req.body.nf_protein,
      nf_total_carbohydrate: req.body.nf_total_carbohydrate,
      nf_total_fat: req.body.nf_total_fat,
      servings: req.body.servings || 1,
    },
    _id: req.params.id,
  };

  // Mongoose not allowing to look up and find specific subdocument
  // so find the user document
  try {
    let userObj = await UserMeals.findOne({
      "meals._id": mongoose.Types.ObjectId(req.params.id),
    });

    const meals = userObj.meals;
    const index = meals.findIndex((m) => m._id.toString() === req.params.id);

    userObj.meals[index] = meal;

    const updatedUserObj = await userObj.save();
    res.send(updatedUserObj);
  } catch (error) {
    return res.status(404).send("404: Not Found");
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const meal = await getMealById(req.params.id);
    if (!meal) return res.status(404).send(`404: Not found`);

    const userMeal = await UserMeals.updateOne(
      { user_id: req.user._id },
      {
        $pull: { meals: meal },
      }
    );

    if (!userMeal) return res.status(404).send(`404: Not found`);

    res.send(userMeal);
  } catch (error) {
    return res.status(500).send("500: Internal Server Error");
  }
});

module.exports = router;
