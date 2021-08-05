import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import animationData from "../lotties/lf30_editor_2nt0sohi.json";
import {
  filterCreatedMeals,
  getLocalLikedMeals,
  filterLocalLikedMeals,
  getLocalUserMeals,
  filterLocalUserMeals,
} from "../services/mealService";
import nutritionixService from "../services/nutritionixService";
import likify from "../utils/likifyMeals";
import Search from "./Search";
import UncontrolledLottie from "./UncontrolledLottie";
import PaginatedMealDisplay from "./PaginatedMealsDisplay";
import "../styles/MealsTable.css";

function SearchMealsDisplay(props) {
  const {
    setProducts,
    products,
    likedMeals, // For meals on LikedMeals page
    searchMeals, // Purpose of the display is to search for new meals
    getUserMeals, // Purpose of the display is to filter current user meals
    // Not necessary props below this point
    addMealSearch, // When the user shouldn't have the option to like/delete meals
    onClick,
    pageLimit,
  } = props;
  const [playLottie, setPlayLottie] = useState(false);
  const [displayVisible, setdisplayVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (searchMeals && getUserMeals)
      return alert("Only select either search or getUserMeals. Not both");

    // Meals.jsx
    if (searchMeals) {
      const prevSearchQuery = localStorage.getItem("searchQuery");

      if (prevSearchQuery) setSearchQuery(prevSearchQuery);
    }

    setdisplayVisible(true);
  }, []);

  const handleChange = (e) => {
    setSearchQuery(e.target.value);
    if (getUserMeals) {
      getHandleGetUserMealsChangedProducts(e.target.value);
    } else if (likedMeals) {
      getHandleLikedMealsChangedProducts(e.target.value);
    }
  };

  const getHandleGetUserMealsChangedProducts = (searchPhrase) => {
    if (searchPhrase === "") {
      let products = getLocalUserMeals();
      setProducts(products);
      return;
    }
    const filtered = filterLocalUserMeals(searchPhrase);
    setProducts(filtered);
  };

  const getHandleLikedMealsChangedProducts = (searchPhrase) => {
    if (searchPhrase === "") {
      let products = getLocalLikedMeals();
      setProducts(products);
      return;
    }
    const filtered = filterLocalLikedMeals(searchPhrase);
    setProducts(filtered);
  };

  const getProducts = async () => {
    try {
      setdisplayVisible(false); // A new search should allow for a new loading logo & table
      setPlayLottie(true);

      if (searchMeals) {
        const { data: usersMeals } = await filterCreatedMeals(searchQuery);
        let possibleMeals = [...usersMeals];

        let result = await nutritionixService.getMealsByName(searchQuery);

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
      } else if (getUserMeals || likedMeals) {
        const filtered = filterLocalUserMeals(searchQuery);
        setProducts(filtered);
      }

      setPlayLottie(false);
      setdisplayVisible(true);
    } catch (error) {
      toast.error("An error has occurred");
      setPlayLottie(false);
    }
  };

  const handleClick = () => {
    try {
      if (searchQuery === "") {
        toast.warning("Input a value into the search field");
        return;
      }
      if (searchMeals) localStorage.setItem("searchQuery", searchQuery);
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
      {products && displayVisible && (
        <PaginatedMealDisplay
          likedMeals={likedMeals}
          searchMeals={searchMeals}
          getUserMeals={getUserMeals}
          onMealClick={onClick}
          addMealSearch={addMealSearch}
          products={products}
          setProducts={setProducts}
          pageLimit={pageLimit || 12}
          pageNeighbors={1}
        />
      )}
    </div>
  );
}

export default SearchMealsDisplay;
