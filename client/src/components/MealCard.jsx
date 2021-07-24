import React, { useState } from "react";
import "../styles/MealCard.css";
import { useHistory } from "react-router-dom";
import nutritionixService from "../services/nutritionixService";
import LikeIcon from "./LikeIcon";
import MealAddedIcon from "./MealAddedIcon";
import { toast } from "react-toastify";
import {
  postUserMeal,
  putUserMeal,
  deleteUserMeal,
  deleteLocalUserMealById,
} from "../services/mealService";
import DeleteMealModal from "./DeleteMealModal";
import { pushLocalUserMeal } from "./../services/mealService";

function MealCard(props) {
  // props allows the user to pass an onClick function, and allows to specify if the
  // curr meals are being displayed due to a search from user creating a meal
  let history = useHistory();

  // Has additional props of onMealClick and addMealSearch
  const { meal, products, setProducts, getUserMeals, searchMeals, likedMeals } =
    props;

  // const [currMeal, setCurrMeal] = useState(meal);
  const [show, setShow] = useState(false);

  // When the user deletes a created meal, currMeal state gets set to null
  // and nothing gets returned
  if (meal === null) return null;

  const img = {
    backgroundImage: `url(${meal.photo.thumb})`,
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleClick = () => {
    console.log("mealCard clicked", meal);
    const mealName = meal.food_name;
    let pathName = "/meals/" + mealName; // Generic meal

    // Represents non user created meals that are brand specific
    if (meal.nix_item_id) pathName = "/meals/" + meal.nix_item_id;

    if (meal.created_meal)
      pathName = "/meals/" + meal.food_name + "/" + meal.brand_name;

    const location = {
      pathname: pathName,
      meal: meal,
    };

    history.push(location);
  };

  const updateLocalSearchedMeals = (products) => {
    if (searchMeals)
      localStorage.setItem("searchedMeals", JSON.stringify(products));
  };

  const updateMealInSearchedMeals = (meal) => {
    const searchedMeals = JSON.parse(localStorage.getItem("searchedMeals"));

    const index = searchedMeals.findIndex(
      (m) => m.food_name === meal.food_name
    );

    if (index > -1) {
      searchedMeals[index] = meal;
      localStorage.setItem("searchedMeals", JSON.stringify(searchedMeals));
    }
  };

  const handleLike = async () => {
    const originalProds = [...products];
    const prods = [...products];
    const originalMeal = { ...meal };
    const tempMeal = { ...meal };

    const index = prods.findIndex((m) => m.food_name === meal.food_name);

    tempMeal.liked = !tempMeal.liked;
    prods[index] = tempMeal;
    tempMeal.user_meal = true;

    if (likedMeals) prods.splice(index, 1);

    setProducts(prods);

    try {
      // The meal already fits the required schema and is in the user's meals

      if (originalMeal._id && originalMeal.user_meal) {
        let serverObj = {
          food_name: tempMeal.food_name,
          brand_name: tempMeal.brand_name,
          serving_qty: tempMeal.serving_qty,
          serving_unit: tempMeal.serving_unit,
          serving_weight_grams: tempMeal.serving_weight_grams,
          nf_calories: tempMeal.nf_calories,
          nf_protein: tempMeal.nf_protein,
          nf_total_carbohydrate: tempMeal.nf_total_carbohydrate,
          nf_total_fat: tempMeal.nf_total_fat,
          nix_item_id: tempMeal.nix_item_id,
          thumb: tempMeal.photo.thumb,
          sub_recipe: tempMeal.sub_recipe,
          liked: tempMeal.liked,
          created_meal: tempMeal.created_meal,
          user_meal: tempMeal.user_meal,
          _id: tempMeal._id,
        };

        await putUserMeal(serverObj);
        updateLocalSearchedMeals(prods);
        updateMealInSearchedMeals(tempMeal);
        return;
      }

      // The meal doesn't fit the required schema and isn't in the user's meals
      // This meal has a brand and must fetch a different url
      let temporaryMeal;
      if (meal.nix_item_id) {
        temporaryMeal = await nutritionixService.getMealByNixItemId(
          meal.nix_item_id
        );
      } else {
        temporaryMeal = await nutritionixService.getMealDetails(meal.food_name);
      }
      temporaryMeal = temporaryMeal.data.foods[0];

      let serverObj = {
        food_name: temporaryMeal.food_name,
        brand_name: temporaryMeal.brand_name,
        serving_qty:
          temporaryMeal.serving_qty === null ? 1 : temporaryMeal.serving_qty,
        serving_unit:
          temporaryMeal.serving_unit === null
            ? "meal"
            : temporaryMeal.serving_unit,
        serving_weight_grams: temporaryMeal.serving_weight_grams,
        nf_calories: temporaryMeal.nf_calories,
        nf_protein: temporaryMeal.nf_protein,
        nf_total_carbohydrate: temporaryMeal.nf_total_carbohydrate,
        nf_total_fat: temporaryMeal.nf_total_fat,
        nix_item_id: temporaryMeal.nix_item_id,
        thumb: temporaryMeal.photo.thumb,
        sub_recipe: temporaryMeal.sub_recipe ? temporaryMeal.sub_recipe : [],
        liked: true,
        created_meal: false,
        user_meal: true,
      };

      const { data } = await postUserMeal(serverObj);

      prods[index] = data;

      setProducts(prods);

      updateLocalSearchedMeals(prods);
      return;
    } catch (error) {
      console.error(error);
      toast.error("An unexpected error has occurred");

      setProducts(originalProds);
      updateLocalSearchedMeals(originalProds);
    }
  };

  const handleAdd = async () => {
    const originalProds = [...products];
    const prods = [...products];
    const index = prods.indexOf(meal);
    const tempMeal = { ...meal };

    if (tempMeal.user_meal) tempMeal.user_meal = !tempMeal.user_meal;
    else tempMeal.user_meal = true;

    prods[index] = tempMeal;
    setProducts(prods);

    try {
      // This meal is not a user meal yet so you have to call nutritionix
      let tempMeal;
      if (meal.nix_item_id) {
        tempMeal = await nutritionixService.getMealByNixItemId(
          meal.nix_item_id
        );
      } else {
        tempMeal = await nutritionixService.getMealDetails(meal.food_name);
      }
      tempMeal = tempMeal.data.foods[0];

      let serverObj = {
        food_name: tempMeal.food_name,
        brand_name: tempMeal.brand_name,
        serving_qty: tempMeal.serving_qty ? tempMeal.serving_qty : 1,
        serving_unit: tempMeal.serving_unit ? tempMeal.serving_unit : "meal",
        serving_weight_grams: tempMeal.serving_weight_grams,
        nf_calories: tempMeal.nf_calories,
        nf_protein: tempMeal.nf_protein,
        nf_total_carbohydrate: tempMeal.nf_total_carbohydrate,
        nf_total_fat: tempMeal.nf_total_fat,
        nix_item_id: tempMeal.nix_item_id,
        thumb: tempMeal.photo.thumb,
        sub_recipe: tempMeal.sub_recipe ? tempMeal.sub_recipe : [],
        liked: meal.liked,
        created_meal: false,
        user_meal: true,
      };

      const { data } = await postUserMeal(serverObj);

      prods[index] = data;
      setProducts(prods);

      pushLocalUserMeal(data);
      updateLocalSearchedMeals(prods);
    } catch (error) {
      console.error(error);
      toast.error("Unable to add meal");
      setProducts(originalProds);

      updateLocalSearchedMeals(originalProds);
    }
  };

  const handleDelete = async () => {
    handleClose();
    const originalProds = [...products];
    const prods = [...products];
    const tempMeal = { ...meal };

    if (tempMeal.created_meal) {
      const index = prods.findIndex((m) => m._id === tempMeal._id);

      if (index > -1) prods.splice(index, 1);
      else return;

      setProducts(prods);

      updateLocalSearchedMeals(prods);
    } else {
      if (tempMeal.liked) tempMeal.liked = !tempMeal.liked;

      const index = prods.findIndex((m) => m._id === tempMeal._id);
      if (getUserMeals || likedMeals) {
        if (index > -1) {
          prods.splice(index, 1);
        }

        setProducts(prods);
      } else {
        tempMeal.user_meal = false;
        prods[index] = tempMeal;

        setProducts(prods);
      }
      updateLocalSearchedMeals(prods);
    }

    try {
      await deleteUserMeal(meal);
      deleteLocalUserMealById(meal._id);
    } catch (error) {
      console.error(error);
      toast.error("Unable to delete meal");

      setProducts(originalProds);
      updateLocalSearchedMeals(originalProds);
    }
  };

  return (
    <>
      {/*  */}
      <div className="col-md-6 col-xl-4">
        <div className="card">
          <div className="meal-card-body">
            <div
              className="media align-items-center"
              onClick={
                props.onMealClick ? () => props.onMealClick(meal) : handleClick
              }
            >
              <span style={img} className="avatar avatar-xl mr-3"></span>
              <div className="media-body overflow-hidden">
                <p className="card-text mb-0 text-capitalize">
                  {meal.brand_name
                    ? meal.brand_name + " " + meal.food_name
                    : meal.food_name}
                </p>
                <p className="card-text mt-2">
                  {meal.nf_calories && meal.nf_calories + " cals"}
                </p>
              </div>
            </div>
            {!props.addMealSearch && (
              <div className="d-flex justify-content-end">
                <div>
                  <LikeIcon liked={meal.liked} onClick={handleLike} />
                  <MealAddedIcon
                    className="mr-2 ml-4"
                    added={meal.user_meal}
                    onClick={meal.user_meal ? handleShow : handleAdd}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <DeleteMealModal
        show={show}
        handleClose={handleClose}
        currMeal={meal}
        handleDelete={handleDelete}
      />
    </>
  );
}

export default MealCard;
