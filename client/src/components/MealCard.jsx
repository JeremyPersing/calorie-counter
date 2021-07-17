import React, { useState } from "react";
import "../styles/MealCard.css";
import { useHistory } from "react-router-dom";
import nutritionixService from "../services/nutritionixService";
import LikeIcon from "./LikeIcon";
import AddedIcon from "./AddedIcon";
import { toast } from "react-toastify";
import {
  postUserMeal,
  putUserMeal,
  deleteUserMeal,
} from "../services/mealService";
import Modal from "react-bootstrap/Modal";

function MealCard(props) {
  // props allows the user to pass an onClick function, and allows to specify if the
  // curr meals are being displayed due to a search from user creating a meal
  let history = useHistory();
  const { meal, products, setProducts } = props;
  const [currMeal, setCurrMeal] = useState(meal);
  const [show, setShow] = useState(false);

  // When the user deletes a created meal, currMeal state gets set to null
  // and nothing gets returned
  if (currMeal === null) return null;

  const img = {
    backgroundImage: `url(${currMeal.photo.thumb})`,
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleClick = () => {
    console.log(meal);
    const mealName = meal.food_name;
    let pathName = "/meals/" + mealName; // Generic meal

    // Represents non user created meals that are brand specific
    if (meal.nix_item_id) pathName = "/meals/" + meal.nix_item_id;

    if (meal.created_meal)
      pathName = "/meals/" + meal.food_name + "/" + meal.brand_name;

    console.log(pathName);

    const location = {
      pathname: pathName,
    };

    history.push(location);
  };

  const handleLike = async () => {
    console.log("handling like");
    const originalProds = [...products];
    const prods = [...products];
    const originalMeal = { ...currMeal };
    const tempMeal = { ...currMeal };

    const index = prods.findIndex((m) => m.food_name === currMeal.food_name);
    console.log("index when liked", index);
    tempMeal.liked = !tempMeal.liked;
    prods[index] = tempMeal;
    tempMeal.user_meal = true;

    setProducts(prods);
    setCurrMeal(tempMeal);

    try {
      // The meal already fits the required schema and is in the user's meals

      if (originalMeal._id && originalMeal.user_meal) {
        console.log("originalMeal._id && originalMeal.user_meal");
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
        return localStorage.setItem("searchedMeals", JSON.stringify(prods));
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
      setCurrMeal(data);
      setProducts(prods);

      return localStorage.setItem("searchedMeals", JSON.stringify(prods));
    } catch (error) {
      console.error(error);
      toast.error("An unexpected error has occurred");
      setCurrMeal(originalMeal);
      setProducts(originalProds);
      localStorage.setItem("searchedMeals", JSON.stringify(originalProds));
    }
  };

  // DO HANDLEADD NEXT, FOLLOWING THE SAME TEMPLATE AS ABOVE

  const handleAdd = async () => {
    const originalProds = [...products];
    const originalMeal = { ...meal };
    const prods = [...products];
    const index = prods.indexOf(currMeal);
    const tempMeal = { ...meal };

    if (tempMeal.user_meal) tempMeal.user_meal = !tempMeal.user_meal;
    else tempMeal.user_meal = true;

    prods[index] = tempMeal;
    setProducts(prods);
    setCurrMeal(tempMeal);

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
      console.log("rempMeal res after handleAdd", tempMeal);

      let serverObj = {
        food_name: tempMeal.food_name,
        brand_name: tempMeal.brand_name,
        serving_qty: tempMeal.serving_qty === null ? 1 : tempMeal.serving_qty,
        serving_unit:
          tempMeal.serving_unit === null ? "meal" : tempMeal.serving_unit,
        serving_weight_grams: tempMeal.serving_weight_grams,
        nf_calories: tempMeal.nf_calories,
        nf_protein: tempMeal.nf_protein,
        nf_total_carbohydrate: tempMeal.nf_total_carbohydrate,
        nf_total_fat: tempMeal.nf_total_fat,
        nix_item_id: tempMeal.nix_item_id,
        thumb: tempMeal.photo.thumb,
        sub_recipe: tempMeal.sub_recipe ? tempMeal.sub_recipe : [],
        liked: currMeal.liked,
        created_meal: false,
        user_meal: true,
      };

      console.log("serverObj", serverObj);

      const { data } = await postUserMeal(serverObj);

      prods[index] = data;
      setCurrMeal(data);
      setProducts(prods);

      return localStorage.setItem("searchedMeals", JSON.stringify(prods));
    } catch (error) {
      console.error(error);
      toast.error("Unable to add meal");
      setProducts(originalProds);
      setCurrMeal(originalMeal);
      localStorage.setItem("searchedMeals", JSON.stringify(originalProds));
    }
  };

  const handleDelete = async () => {
    handleClose();
    console.log("Deleting");
    const originalProds = [...products];
    const prods = [...products];
    const originalMeal = { ...currMeal };
    const tempMeal = { ...currMeal };

    if (tempMeal.created_meal) {
      console.log("meal that is a created_meal");
      const index = prods.findIndex((m) => m._id === tempMeal._id);

      if (index > -1) {
        console.log(index);

        prods.splice(index, 1);
      } else return;

      setProducts(prods);
      setCurrMeal(null);
      localStorage.setItem("searchedMeals", JSON.stringify(prods));
    } else {
      if (tempMeal.liked) tempMeal.liked = !tempMeal.liked;

      const index = prods.findIndex((m) => m._id === tempMeal._id);
      tempMeal.user_meal = false;
      prods[index] = tempMeal;
      console.log("index", index);
      console.log("tempMeal that was not created", tempMeal);

      setCurrMeal(tempMeal);
      setProducts(prods);

      console.log(prods);
      localStorage.setItem("searchedMeals", JSON.stringify(prods));
    }

    try {
      await deleteUserMeal(currMeal);
    } catch (error) {
      console.error(error);
      toast.error("Unable to delete meal");
      setCurrMeal(originalMeal);
      setProducts(originalProds);
      localStorage.setItem("searchedMeals", JSON.stringify(originalProds));
    }
  };

  return (
    <>
      <div className="col-md-6 col-xl-4">
        <div className="card">
          <div className="meal-card-body">
            <div
              className="media align-items-center"
              onClick={
                props.onMealClick
                  ? () => props.onMealClick(currMeal)
                  : handleClick
              }
            >
              <span style={img} className="avatar avatar-xl mr-3"></span>
              <div className="media-body overflow-hidden">
                <p className="card-text mb-0 text-capitalize">
                  {currMeal.brand_name
                    ? currMeal.brand_name + " " + currMeal.food_name
                    : currMeal.food_name}
                </p>
              </div>
            </div>
            {!props.addMealSearch && (
              <div className="d-flex justify-content-end">
                <div>
                  <LikeIcon liked={currMeal.liked} onClick={handleLike} />
                  <AddedIcon
                    className="mr-2 ml-4"
                    added={currMeal.user_meal}
                    onClick={currMeal.user_meal ? handleShow : handleAdd}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title>Are you sure?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currMeal.created_meal
            ? "Are you sure you want to permanently delete your created meal?"
            : "Are you sure you want to delete this item from your meals?"}
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-danger" onClick={handleDelete}>
            Delete
          </button>
          <button className="btn btn-secondary" onClick={handleClose}>
            Cancel
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default MealCard;
