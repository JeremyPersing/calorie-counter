import LikeIcon from "../components/LikeIcon";
import { getLikedMeals } from "../services/mealService";

export const appendLikeButtonToMeals = (mealsArr) => {
  for (let i in mealsArr) {
    try {
      // Would typically use if to see if liked is undefined but that wasnt working
      if (mealsArr[i].fields.liked === undefined)
        mealsArr[i].fields.liked = false;
    } catch (error) {
      console.log("In error statement");
      mealsArr[i].fields.liked = false;
    }

    mealsArr[i].fields.likeComponent = (
      <LikeIcon liked={mealsArr[i].fields.liked} />
    );
  }
  return mealsArr;
};

export const likifySearchedMeals = (searchedMeals, likedMeals) => {
  // item_id values for all the liked meals
  const keysForLikedMeals = likedMeals.reduce(function (obj, hash) {
    obj[hash.fields.item_id] = true;
    return obj;
  }, {});

  let mealsInSearch = [];

  for (let i in searchedMeals) {
    if (keysForLikedMeals[searchedMeals[i].fields.item_id]) {
      searchedMeals[i].fields.liked = true;
    } else {
      searchedMeals[i].fields.liked = false;
    }

    searchedMeals[i].fields.likeComponent = (
      <LikeIcon liked={searchedMeals[i].fields.liked} />
    );
    mealsInSearch.push(searchedMeals[i]);
  }
  console.log("mealsInSearch", mealsInSearch);
  return mealsInSearch;
};

export const getLikifiedMeals = async (possibleMeals) => {
  const { data: likedMeals } = await getLikedMeals();
  const searchedMeals = possibleMeals;

  return likifySearchedMeals(searchedMeals, likedMeals);
};

export default {
  likifySearchedMeals,
  getLikifiedMeals,
};
