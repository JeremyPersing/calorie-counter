import axios from "axios";

// store in the backend in .env file then do a get request for the key
// const apiKey = "450ef34ea0mshb5c5d952b4fececp14971ejsn1cc5cd843330";

const appId = "569e8218";
const appKey = "060a446755c10e2b489b8b92c34200d8";
const remoteUserId = 0;

/*export const getMealByName = (queryString) => {
  const options = {
    method: "GET",
    url: "https://nutritionix-api.p.rapidapi.com/v1_1/search/" + queryString,
    params: {
      fields:
        "item_name,item_id,brand_name,nf_calories,nf_total_fat,nf_total_carbohydrate,nf_protein",
    },
    headers: {
      "x-rapidapi-key": apiKey,
      "x-rapidapi-host": "nutritionix-api.p.rapidapi.com",
    },
  };
  return axios.request(options);
};*/

export const getMealByName = (queryString) => {
  const options = {
    method: "get",
    url: "https://trackapi.nutritionix.com/v2/search/instant",
    params: {
      query: queryString,
    },
    headers: {
      "x-app-id": appId,
      "x-app-key": appKey,
      "x-remote-user-id": remoteUserId,
    },
  };
  return axios.request(options);
};

export const getMealDetails = (mealName) => {
  const options = {
    method: "post",
    url: "https://trackapi.nutritionix.com/v2/natural/nutrients",
    data: {
      query: mealName,
      include_subrecipe: true,
    },
    headers: {
      "x-app-id": appId,
      "x-app-key": appKey,
      "x-remote-user-id": remoteUserId,
    },
  };
  return axios.request(options);
};

export const getMealByNixItemId = (id) => {
  const options = {
    method: "get",
    url: "https://trackapi.nutritionix.com/v2/search/item",
    params: {
      "nix_item_id": id,
    },
    headers: {
      "x-app-id": appId,
      "x-app-key": appKey,
      "x-remote-user-id": remoteUserId,
    },
  };
  return axios.request(options);
};

export default {
  getMealByName,
  getMealDetails,
  getMealByNixItemId,
};
