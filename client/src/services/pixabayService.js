import { apiUrl } from "../config.json";
import http from "./httpService";

const apiEndpoint = apiUrl + "/pixabay";
export const getImagesByQuery = (queryString) => {
  return http.post(apiEndpoint, { query: queryString });
};

export default {
  getImagesByQuery,
};
