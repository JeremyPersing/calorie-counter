import http from "./httpService";
import { apiUrl } from "../config.json";
import { getJwt } from "./authService";
import { appendLikeButtonToMeals } from "../utils/likifyMeals";

// Useful for the Specific Meal page and not having to call the server
export function createUserMealsDocument() {
  http.setJwt(getJwt());
  return http.post(apiUrl + "/usermeals/createaccount");
}

export function getLocalUserMeals() {
  let arr = JSON.parse(localStorage.getItem("userMeals") || "[]");
  if (arr.length > 0) {
    arr = appendLikeButtonToMeals(arr);
  }
  return arr;
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

export function getCreatedMeals() {
  http.setJwt(getJwt());
  return http.get(apiUrl + "/usermeals");
}

export function getMealById(id) {
  http.setJwt(getJwt());
  return http.get(apiUrl + "/usermeals/" + id);
}

export function getCreatedMeal(meal) {
  http.setJwt(getJwt());
  return http.get(apiUrl + "/usermeals/" + meal._id);
}

export function filterCreatedMeals(query) {
  http.setJwt(getJwt());
  return http.get(apiUrl + "/usermeals/search/" + query);
}

export function deleteCreatedMeal(meal) {
  http.setJwt(getJwt());
  return http.delete(apiUrl + "/usermeals/" + meal._id);
}

export function deleteMealById(id) {
  http.setJwt(getJwt());
  return http.delete(apiUrl + "/usermeals/" + id);
}

export function putCreatedMeal(meal) {
  http.setJwt(getJwt());
  const id = meal._id;
  delete meal._id;
  return http.put(apiUrl + "/usermeals/" + id, meal);
}

////////////////////////////// LEFT HERE
export function postMeal(meal) {
  http.setJwt(getJwt());
  return http.post(apiUrl + "/usermeals/", meal);
}

// export function postCreatedMeal(meal) {
//   http.setJwt(getJwt());
//   return http.post(apiUrl + "/usermeals", meal);
// }

export function getLikedMeals() {
  http.setJwt(getJwt());
  return http.get(apiUrl + "/usermeals/liked");
}

// export function postSearchedMeal(meal) {
//   http.setJwt(getJwt());
//   return http.post(apiUrl + "/usermeals/search", meal);
// }

export default {
  getLocalUserMeals,
  setLocalUserMeals,
  getCreatedMeals,
  getCreatedMeal,
  deleteCreatedMeal,
  putCreatedMeal,
  // postCreatedMeal,
  getLikedMeals,
  filterCreatedMeals,
};
