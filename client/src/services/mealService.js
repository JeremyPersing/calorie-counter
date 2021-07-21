import http from "./httpService";
import { apiUrl } from "../config.json";
import { getJwt } from "./authService";

// Useful for the Specific Meal page and not having to call the server
export function createUserMealsDocument() {
  http.setJwt(getJwt());
  return http.post(apiUrl + "/usermeals/createaccount");
}

export function getLocalUserMeals() {
  let arr = JSON.parse(localStorage.getItem("userMeals") || "[]");
  return arr;
}

export function filterLocalUserMeals(filterCriteria) {
  let arr = JSON.parse(localStorage.getItem("userMeals"));
  console.log("arr in localUserMeals", arr);
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

export function pushLocalUserMeal(meal) {
  let arr = JSON.parse(localStorage.getItem("userMeals") || "[]");
  arr.push(meal);
  setLocalUserMeals(arr);
}

export function deleteLocalUserMealById(id) {
  let arr = JSON.parse(localStorage.getItem("userMeals") || "[]");
  arr = arr.filter((m) => m._id !== id);
  setLocalUserMeals(arr);
}

export function getUserMeals() {
  http.setJwt(getJwt());
  return http.get(apiUrl + "/usermeals");
}

export function getUserMealById(mealId) {
  http.setJwt(getJwt());
  return http.get(apiUrl + "/usermeals/id/" + mealId);
}

export function getUserMealByName(mealName) {
  http.setJwt(getJwt());
  return http.get(apiUrl + "/usermeals/" + mealName);
}

export function getLikedMeals() {
  http.setJwt(getJwt());
  return http.get(apiUrl + "/usermeals/liked");
}

export function getUserMealByNameAndBrand(name, brand) {
  http.setJwt(getJwt());
  return http.get(apiUrl + "/usermeals/" + name + "/" + brand);
}

export function filterCreatedMeals(query) {
  http.setJwt(getJwt());
  return http.get(apiUrl + "/usermeals/search/" + query);
}

export function deleteUserMeal(meal) {
  http.setJwt(getJwt());
  return http.delete(apiUrl + "/usermeals/" + meal._id);
}

export function deleteMealById(id) {
  http.setJwt(getJwt());
  return http.delete(apiUrl + "/usermeals/" + id);
}

export function putUserMeal(meal) {
  http.setJwt(getJwt());
  const id = meal._id;
  delete meal._id;
  return http.put(apiUrl + "/usermeals/" + id, meal);
}

export function postUserMeal(meal) {
  http.setJwt(getJwt());
  return http.post(apiUrl + "/usermeals", meal);
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
