const mealsConsumed = [
  {
    brand_name: "Black Angus",
    item_id: "5e561a389b8dbfdb7e6c3a71",
    item_name: "Hamburger",
    nf_calories: 255.57,
    nf_protein: 17.4,
    nf_total_carbohydrate: 0.5,
    nf_total_fat: 20,
    servings: 2,
  },
  {
    brand_name: "Black Bear Diner",
    item_id: "513fc9cc673c4fbc2600684f",
    item_name: "2 Sweet Cream Pancakes",
    nf_calories: 990,
    nf_protein: 22,
    nf_total_carbohydrate: 193,
    nf_total_fat: 15,
    servings: 1,
  },
];

let likedMeals = [
  {
    brand_name: "Black Bear Diner",
    item_id: "513fc9cc673c4fbc2600684f",
    item_name: "2 Sweet Cream Pancakes",
    nf_calories: 990,
    nf_protein: 22,
    nf_total_carbohydrate: 193,
    nf_total_fat: 15,
    servings: 1,
  },
  {
    brand_name: "Black Bear Diner",
    item_id: "513fc9cc673c4fbc2600676f",
    item_name: "Chocolate Chip Pancakes",
    nf_calories: 1240,
    nf_protein: 20,
    nf_serving_size_qty: 1,
    nf_serving_size_unit: "serving",
    nf_total_carbohydrate: 185,
    nf_total_fat: 31,
  },
];

// let createdMeals = [
//   {
//     brand_name: "Black Bear Diner",
//     item_id: "513fc9cc673c4fbc2600676f",
//     item_name: "Chocolate Chip Pancakes",
//     nf_calories: 1240,
//     nf_protein: 20,
//     nf_serving_size_qty: 1,
//     nf_serving_size_unit: "serving",
//     nf_total_carbohydrate: 185,
//     nf_total_fat: 31,
//   },
//   {
//     brand_name: "Black Bear Diner",
//     item_id: "513fc9cc673c4fbc2600684f",
//     item_name: "2 Sweet Cream Pancakes",
//     nf_calories: 990,
//     nf_protein: 22,
//     nf_total_carbohydrate: 193,
//     nf_total_fat: 15,
//     servings: 1,
//   },
// ];

export function setLikedMeal(meal) {
  likedMeals.push(meal);
  console.log("after adding to liked meals", likedMeals);
}
export function getLikedMeals() {
  return likedMeals;
}
export function deleteLikedMeal(meal) {
  const newLikedMeals = likedMeals.filter(
    (item) => item.item_id !== meal.item_id
  );
  likedMeals = [...newLikedMeals];
  console.log("liked meals", newLikedMeals);
  return newLikedMeals;
}

export function setMealConsumed(meal) {
  let mealEatenPrior = false;

  mealsConsumed.forEach((m) => {
    if (m.item_id === meal.item_id) {
      m.servings += meal.servings;
      mealEatenPrior = true;
      return;
    }
  });

  if (!mealEatenPrior) mealsConsumed.push(meal);
}
export function getMealsConsumed() {
  return mealsConsumed;
}

export function getTotalDailyCaloriesConsumed() {
  let totalCaloriesConsumed = 0;
  mealsConsumed.forEach((item) => {
    totalCaloriesConsumed += item.nf_calories * item.servings;
  });
  return totalCaloriesConsumed;
}

export default {
  setLikedMeal,
  getLikedMeals,
  deleteLikedMeal,
  setMealConsumed,
  getMealsConsumed,
  getTotalDailyCaloriesConsumed,
};
