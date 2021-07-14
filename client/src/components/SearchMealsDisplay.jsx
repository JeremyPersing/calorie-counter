import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import animationData from "../lotties/lf30_editor_2nt0sohi.json";
import {
  filterCreatedMeals,
  getLocalUserMeals,
  getCreatedMeals,
} from "../services/mealService";
import nutritionixService from "../services/nutritionixService";
import likify from "../utils/likifyMeals";
import Search from "./Search";
import UncontrolledLottie from "./UncontrolledLottie";
import PaginatedMealDisplay from "./PaginatedMealsDisplay";
import "../styles/MealsTable.css";

function SearchMealsDisplay(props) {
  const { setProducts, products } = props;
  const [playLottie, setPlayLottie] = useState(false);
  const [displayVisible, setdisplayVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function getMeals() {
      const prevSearchQuery = localStorage.getItem("searchQuery");

      if (prevSearchQuery) setSearchQuery(prevSearchQuery);

      let meals;
      // let meals = [...mealsObj.common, ...mealsObj.branded];
      if (products.length === 0) {
        meals = JSON.parse(localStorage.getItem("searchedMeals"));

        if (!meals) return; // only show the table if something we have meals
      } else {
        meals = products;
      }

      setProducts(meals);
      setdisplayVisible(true);
    }
    getMeals();
  }, []);

  const handleChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const getProducts = async () => {
    try {
      setdisplayVisible(false); // A new search should allow for a new loading logo & table
      setPlayLottie(true);

      const { data: usersMeals } = await filterCreatedMeals(searchQuery);
      console.log(usersMeals);
      let possibleMeals = [...usersMeals];

      console.log(possibleMeals);
      let result = await nutritionixService.getMealByName(searchQuery);
      result = [...result.data.common, ...result.data.branded];

      // Returns the meals that are not already in the user's meals
      let res;
      if (possibleMeals.length > 0) {
        res = result.filter(
          (searchedMeal) =>
            !usersMeals.some((userMeal) =>
              searchedMeal.nix_item_id
                ? searchedMeal.nix_item_id === userMeal.nix_item_id
                : searchedMeal.food_name.toLowerCase().trim() ===
                  userMeal.food_name.toLowerCase().trim()
            )
        );
      } else res = result;

      let searchedMealsLikified = await likify.likifyAllMeals(res);

      possibleMeals = [...possibleMeals, ...searchedMealsLikified];
      localStorage.setItem("searchedMeals", JSON.stringify(possibleMeals));

      setProducts(possibleMeals);
      setPlayLottie(false);
      setdisplayVisible(true);
    } catch (error) {
      toast.error("An error has occurred");
      console.log(error);
      setPlayLottie(false);
    }
  };

  const handleClick = () => {
    try {
      if (searchQuery === "") {
        toast.warning("Input a value into the search field");
        return;
      }
      localStorage.setItem("searchQuery", searchQuery);
      getProducts();
    } catch (error) {
      toast.error("Something's gone wrong ...");
    }
  };

  return (
    <div>
      <Search
        className="col-md-6 offset-md-3 d-flex mt-4 mb-4"
        onChange={handleChange}
        onClick={handleClick}
        value={searchQuery}
        placeholder="Search by Name or Brand"
      />
      {playLottie ? <UncontrolledLottie animationData={animationData} /> : null}
      {displayVisible && (
        <PaginatedMealDisplay
          products={products}
          setProducts={setProducts}
          pageLimit={12}
          pageNeighbors={1}
        />
      )}
    </div>
  );
}

export default SearchMealsDisplay;
