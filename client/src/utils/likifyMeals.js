
// This should only take in searched meals, none of the user's meals
// Because of this, all of these meals will not be liked, and the
// meals that are liked should be present in the user's meals
const likifyAllMeals = (searchedMeals) => {

  for (const i in searchedMeals) {
    if (!searchedMeals[i].liked) searchedMeals[i].liked = false;
  }
  return searchedMeals;
};

export default {
  likifyAllMeals,
};
