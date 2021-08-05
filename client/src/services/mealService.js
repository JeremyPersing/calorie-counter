import http from "./httpService";
import { apiUrl } from "../config.json";
import { getJwt } from "./authService";

const currUrl = apiUrl + "/usermeals"

// Useful for the Specific Meal page and not having to call the server
export function createUserMealsDocument() {
  http.setJwt(getJwt());
  return http.post(apiUrl + "/usermeals/createaccount");
}

export function getLocalUserMeals() {
  let arr = JSON.parse(localStorage.getItem("userMeals") || "[]");
  return arr;
}

export function getLocalLikedMeals() {
  let arr =  JSON.parse(localStorage.getItem("userMeals") || "[]");
  arr = arr.filter(m => m.liked === true)
  return arr
}

export function filterLocalUserMeals(filterCriteria) {
  let arr = JSON.parse(localStorage.getItem("userMeals"));
  if (arr.length === 0) return;

  let arrayWithFiltered = [];
  for (const i in arr) {
    // brand_name can be null so check before comparing
    if (arr[i].food_name && arr[i].brand_name) {
      if (
        arr[i].food_name.toLowerCase().includes(filterCriteria.toLowerCase()) ||
        arr[i].brand_name.toLowerCase().includes(filterCriteria.toLowerCase())
      ) {
        arrayWithFiltered.push(arr[i]);
      }
    } else if (
      arr[i].food_name.toLowerCase().includes(filterCriteria.toLowerCase())
    ) {
      arrayWithFiltered.push(arr[i]);
    }
  }

  return arrayWithFiltered;
}

export function filterLocalLikedMeals(filterCriteria) {
  let arr = getLocalLikedMeals();
  if (arr.length === 0) return;

  let arrayWithFiltered = [];
  for (const i in arr) {
    // brand_name can be null so check before comparing
    if (arr[i].food_name && arr[i].brand_name) {
      if (
        arr[i].food_name.toLowerCase().includes(filterCriteria.toLowerCase()) ||
        arr[i].brand_name.toLowerCase().includes(filterCriteria.toLowerCase())
      ) {
        arrayWithFiltered.push(arr[i]);
      }
    } else if (
      arr[i].food_name.toLowerCase().includes(filterCriteria.toLowerCase())
    ) {
      arrayWithFiltered.push(arr[i]);
    }
  }

  return arrayWithFiltered;
}

export function setLocalUserMeals(array) {
  let validatedArr = [...new Set(array)];
  localStorage.setItem("userMeals", JSON.stringify(validatedArr));
}

export function updateLocalUserMeal(meal) {
  let arr = JSON.parse(localStorage.getItem("userMeals"));
  const index = arr.findIndex((m) => m._id === meal._id);
  arr[index] = meal;
  setLocalUserMeals(arr);
}

// Finds a meal in the searched meal array with the same name and brand as the argument
// then updates that meal in the array, used in Specific Meal when a meal is added
export function updateLocalSearchedMeal(meal) {
  const searchedMeals = JSON.parse(localStorage.getItem("searchedMeals"));
  const index = searchedMeals.findIndex((m) => m.food_name === meal.food_name);

  if (index > -1) {
    searchedMeals[index] = meal;
    localStorage.setItem("searchedMeals", JSON.stringify(searchedMeals));
  }
  return;
}

export function pushLocalUserMeal(meal) {
  let arr = JSON.parse(localStorage.getItem("userMeals") || "[]");
  // Make sure the meal doesn't already exist in the user's meals
  const index = arr.findIndex((m) => m.food_name === meal.food_name)
  if (index === -1) arr.push(meal);
  setLocalUserMeals(arr);
}

export function deleteLocalUserMealById(id) {
  let arr = JSON.parse(localStorage.getItem("userMeals") || "[]");
  arr = arr.filter((m) => m._id !== id);
  setLocalUserMeals(JSON.stringify(arr));
}

// End of local functions

export function getUserMeals() {
  http.setJwt(getJwt());
  return http.get(currUrl);
}

export function getConsumedMeals() {
  http.setJwt(getJwt());
  return http.get(currUrl + "/consumedmeals");
}

export function getUserMealById(mealId) {
  http.setJwt(getJwt());
  return http.get(currUrl + "/id/" + mealId);
}

export function getUserMealByName(mealName) {
  http.setJwt(getJwt());
  return http.get(currUrl + "/" + mealName);
}

export function getLikedMeals() {
  http.setJwt(getJwt());
  return http.get(currUrl + "/liked");
}

export function getUserMealByNameAndBrand(name, brand) {
  http.setJwt(getJwt());
  return http.get(currUrl + "/" + name + "/" + brand);
}

export function filterCreatedMeals(query) {
  http.setJwt(getJwt());
  return http.get(currUrl + "/search/" + query);
}

export function deleteUserMeal(meal) {
  http.setJwt(getJwt());
  return http.delete(currUrl + "/" + meal._id);
}

export function deleteMealById(id) {
  http.setJwt(getJwt());
  return http.delete(currUrl + "/" + id);
}

export function deleteConsumedMeal(meal) {
  http.setJwt(getJwt());
  return http.delete(currUrl + "/consumedmeals/" + meal._id);
}

export function deleteConsumedMealById(id) {
  http.setJwt(getJwt());
  return http.delete(currUrl + "/consumedmeals/" + id);
}

export function putUserMeal(meal) {
  http.setJwt(getJwt());
  const id = meal._id;

  return http.put(currUrl + "/" + id, meal);
}

export function putConsumedMeal(meal) {
  http.setJwt(getJwt());
  const id = meal._id;

  return http.put(currUrl + "/consumedmeals/" + id, meal)
}

export function postUserMeal(meal) {
  http.setJwt(getJwt());
  return http.post(currUrl + "/", meal);
}

export function postConsumedMeal(meal) {
  http.setJwt(getJwt());
  return http.post(currUrl + "/consumedmeals", meal);
}

export default {
  getLocalUserMeals,
  setLocalUserMeals,
  getUserMeals,
  deleteUserMeal,
  putUserMeal,
  postUserMeal,
  getLikedMeals,
  filterCreatedMeals,
};
