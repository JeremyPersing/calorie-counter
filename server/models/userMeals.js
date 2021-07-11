const mongoose = require("mongoose");
const Joi = require("Joi");

const validateRequest = (meal) => {
  // We don't need the field key when validating the body of the request only
  // when putting it in the database
  // const schema = Joi.object({

  //   servings: Joi.number().min(0.25),

  const schema = Joi.object({
    food_name: Joi.string().required().min(1).max(100).trim(),
    brand_name: Joi.string().min(1).max(100).trim(),
    serving_qty: Joi.number().required(),
    serving_unit: Joi.string().required().min(1).max(100).trim(),
    serving_weight_grams: Joi.number().required(),
    nf_calories: Joi.number().required().min(0),
    nf_protein: Joi.number().required().min(0),
    nf_total_carbohydrate: Joi.number().required().min(0),
    nf_total_fat: Joi.number().required().min(0),
    nix_item_id: Joi.string().max(24),
    thumb: Joi.string().min(7).required(),
    sub_recipe: Joi.array(),
    liked: Joi.boolean().required(),
    created_meal: Joi.boolean().required(),
    user_meal: Joi.boolean().required(),
  });

  return schema.validate(meal);
};

const validateSearchRequest = (meal) => {
  const schema = Joi.object({
    brand_name: Joi.string().required(),
    item_name: Joi.string().required(),
    item_id: Joi.string().required(),
    ingredients: Joi.array().items(Joi.string()),
    liked: Joi.boolean(),
    nf_calories: Joi.number().required().min(0),
    nf_protein: Joi.number().required().min(0),
    nf_total_carbohydrate: Joi.number().required().min(0),
    nf_total_fat: Joi.number().required().min(0),
    _id: Joi.string().required(),
    servings: Joi.number().min(0.25),
  });

  return schema.validate(meal);
};

const mealSchema = new mongoose.Schema({
  food_name: { type: String, required: true, trim: true },
  brand_name: { type: String, trim: true },
  serving_qty: { type: Number, required: true },
  serving_unit: { type: String, required: true, trim: true },
  serving_weight_grams: { type: Number, required: true },
  nf_calories: { type: Number, required: true },
  nf_protein: { type: Number, required: true },
  nf_total_carbohydrate: { type: Number, required: true },
  nf_total_fat: { type: Number, required: true },
  nix_item_id: { type: String },
  photo: { type: Object, required: true },
  sub_recipe: { type: Array },
  liked: { type: Boolean, required: true },
  created_meal: { type: Boolean, required: true },
  user_meal: { type: Boolean, required: true },
});

const userMealsSchema = {
  user_id: { type: String, required: true },
  meals: {
    type: [mealSchema],
    default: [],
  },
};

const UserMeals = mongoose.model("UserMeals", userMealsSchema);

exports.UserMeals = UserMeals;
exports.validateRequest = validateRequest;
exports.validateSearchRequest = validateSearchRequest;
