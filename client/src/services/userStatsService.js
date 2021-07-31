import http from "./httpService";
import { apiUrl } from "../config.json";
import { getJwt } from "./authService";

const apiEndpoint = apiUrl + "/userstats";

export const postUserStats = (userStats) => {
  http.setJwt(getJwt());
  return http.post(apiEndpoint, {
    age: userStats.age,
    bodyWeight: userStats.bodyWeight,
    gender: userStats.gender,
    height: userStats.height,
    exerciseLevel: userStats.exerciseLevel,
    maintenanceCalories: userStats.maintenanceCalories,
    currentCalories: userStats.currentCalories,
    dietPlan: userStats.dietPlan,
  });
};

export const getUserStats = () => {
  http.setJwt(getJwt());
  return http.get(apiEndpoint);
};

export const putUserStats = (userStats) => {
  http.setJwt(getJwt());
  return http.put(apiEndpoint, {
    age: userStats.age,
    bodyWeight: userStats.bodyWeight,
    gender: userStats.gender,
    height: userStats.height,
    exerciseLevel: userStats.exerciseLevel,
    maintenanceCalories: userStats.maintenanceCalories,
    currentCalories: userStats.currentCalories,
    dietPlan: userStats.dietPlan,
    dietStartDate: userStats.dietStartDate,
    dietThreeWeekDate: userStats.dietThreeWeekDate,
    dietSixWeekDate: userStats.dietSixWeekDate,
    dietNineWeekDate: userStats.dietNineWeekDate,
  });
};

export const updateUserDietPlan = (userStats) => {
  http.setJwt(getJwt());
  return http.put(apiEndpoint + "/newdiet", {
    age: userStats.age,
    bodyWeight: userStats.bodyWeight,
    gender: userStats.gender,
    height: userStats.height,
    exerciseLevel: userStats.exerciseLevel,
    maintenanceCalories: userStats.maintenanceCalories,
    currentCalories: userStats.currentCalories,
    dietPlan: userStats.dietPlan,
  });
}