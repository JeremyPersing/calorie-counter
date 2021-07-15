import axios from "axios";

const apiKey = "22505356-2a4483d932144354de59c3ade";

export const getImagesByQuery = (queryString) => {
  const options = {
    method: "get",
    url: "https://pixabay.com/api/",
    params: {
      key: apiKey,
      q: queryString,
      lang: "en",
      image_type: "photo",
      orientation: "horizontal",
      category: "food",
      safesearch: "true",
    },
  };
  return axios.request(options);
};

export default {
  getImagesByQuery,
};
