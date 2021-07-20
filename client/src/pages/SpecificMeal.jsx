import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import Page from "../components/Page";
import Heading from "../components/Heading";
import InformationCard from "../components/InformationCard";
import Card from "../components/Card";
import DeleteMealModal from "../components/DeleteMealModal";
import { toast } from "react-toastify";
import "../styles/SpecificMeal.css";
import {
  getUserMealByNameAndBrand,
  getLocalUserMeals,
  getUserMealByName,
  postSearchedMeal,
  postUserMeal,
  pushLocalUserMeal,
  deleteMealById,
  deleteLocalUserMealById,
} from "../services/mealService";
import nutritionixService from "../services/nutritionixService";
import UncontrolledLottie from "../components/UncontrolledLottie";
import animationData from "../lotties/lf30_editor_2nt0sohi.json";

import userData from "../services/getUserDataService";
import MealModificationForm from "../components/MealModificationForm";

function SpecificMeal(props) {
  const [show, setShow] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [servings, setServings] = useState(1);
  const [localUserMeal, setLocalUserMeal] = useState(false); // Allows user to edit/delete meal
  const [meal, setMeal] = useState({});
  const [thumb, setThumb] = useState("");
  const [playLottie, setPlayLottie] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  let history = useHistory();

  const getSpecificUserMeal = async (mealId) => {
    try {
      let meal;
      if (Array.isArray(mealId)) meal = await getUserMealByName(mealId[0]);
      else meal = await getUserMealByName(mealId);

      return meal.data;
    } catch (error) {
      console.log(error);
      toast.error("Could not retrieve meal");
    }
  };

  const getSpecificNutritionixMeal = async (mealId) => {
    try {
      const nixIdRegex = /^[a-f\d]{24}$/i;

      let meal;
      if (mealId.match(nixIdRegex)) {
        console.log("matches ");
        meal = await nutritionixService.getMealByNixItemId(mealId);
      } else {
        meal = await nutritionixService.getMealDetails(mealId);
      }

      return meal.data.foods[0];
    } catch (error) {
      console.log(error);
      toast.error("Could not retrieve meal");
    }
  };

  useEffect(() => {
    async function getMeal() {
      let urlArray = props.location.pathname.split("/");
      let mealId;

      // user created meal
      if (urlArray.length === 4) mealId = [urlArray[2], urlArray[3]];
      else mealId = urlArray[2]; // Can either be a name or 24 char string

      setPlayLottie(true);
      let meal = props.location.meal;
      console.log("MEALLLLLLLL", meal);
      if (!meal) meal = JSON.parse(localStorage.getItem("currentMealSelected"));
      console.log("meal after", meal);
      // User created meal and the back button has not been hit
      if (
        meal.created_meal &&
        (mealId[0] === meal.food_name || mealId === meal.food_name)
      ) {
        // A user created ingredient is clicked
        meal = await getSpecificUserMeal(mealId);
      } else {
        // When clicking on the back button
        if (mealId[0] !== meal.food_name || mealId !== meal.food_name) {
          // User created meal
          if (Array.isArray(mealId)) meal = await getSpecificUserMeal(mealId);
          // nutritionix meal
          else meal = await getSpecificNutritionixMeal(mealId);
        }
      }

      // Set the current meal to localStorage in case the user refreshes the page
      localStorage.setItem("currentMealSelected", JSON.stringify(meal));
      setThumb(meal.photo.thumb); // Get an error that meal.photo.thumb doesn't exist if try directly in jsx
      setMeal(meal);

      // See if the meal is editable or not
      const arr = getLocalUserMeals();
      const index = arr.findIndex(
        (m) =>
          m.food_name === meal.food_name && m.brand_name === meal.brand_name
      );
      console.log("index", index);
      if (index !== -1) setLocalUserMeal(true);

      setPlayLottie(false);
    }
    getMeal();
  }, [props.location.pathname]);

  const displayHeader = () => {
    if (meal.brand_name && meal.food_name) {
      return meal.brand_name + " " + meal.food_name;
    }
    return meal.food_name;
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleAddToConsumedMeals = async () => {
    if (servings <= 0) {
      return toast.error("Please enter a valid input");
    }
    handleClose();
    const obj = {
      food_name: meal.food_name,
      brand_name: meal.brand_name,
      sub_recipe: meal.sub_recipe || [],
      nf_calories: meal.nf_calories,
      nf_total_fat: meal.nf_total_fat,
      nf_total_carbohydrate: meal.nf_total_carbohydrate,
      nf_protein: meal.nf_protein,
      servings: Number(servings),
    };

    userData.setMealConsumed(obj); // Post to the server
    history.push("/");
  };
  const handleCloseEdit = () => setShowEdit(false);
  const handleShowEdit = () => setShowEdit(true);
  const handleShowDeleteModal = () => setShowDeleteModal(true);
  const handleCloseDeleteModal = () => setShowDeleteModal(false);

  const handleAddToMyMeals = async () => {
    const serverObj = {
      food_name: meal.food_name,
      brand_name: meal.brand_name,
      serving_qty: meal.serving_qty ? meal.serving_qty : 1,
      serving_unit: meal.serving_unit ? meal.serving_unit : "meal",
      serving_weight_grams: meal.serving_weight_grams,
      nf_calories: meal.nf_calories,
      nf_protein: meal.nf_protein,
      nf_total_carbohydrate: meal.nf_total_carbohydrate,
      nf_total_fat: meal.nf_total_fat,
      nix_item_id: meal.nix_item_id,
      thumb: meal.photo.thumb,
      sub_recipe: meal.sub_recipe ? meal.sub_recipe : [],
      liked: false,
      created_meal: false,
      user_meal: true,
    };

    try {
      setLocalUserMeal(true);
      const response = await postUserMeal(serverObj);
      if (response.status === 200) pushLocalUserMeal(response.data);

      setMeal(response.data);
    } catch (error) {
      setLocalUserMeal(false);
      console.log(error);
    }
  };
  const handleDelete = async () => {
    try {
      const response = await deleteMealById(meal._id);
      if (response.status === 200) deleteLocalUserMealById(meal._id);

      history.goBack();
    } catch (error) {
      toast.error("Please add this meal to delete it");
    }
  };

  const handleIngredientClick = (ingredientObj) => {
    console.log("ingredientObj", ingredientObj);
    const mealName = ingredientObj.food;
    const obj = {
      food_name: mealName,
      created_meal: ingredientObj.created_meal,
    };

    localStorage.setItem("currentMealSelected", JSON.stringify(obj));

    const location = {
      pathname: "/meals/" + mealName,
      meal: obj,
    };

    history.push(location);
  };

  const getGrams = (num) => {
    if (num === 1) return num + " gram";
    return num + " grams";
  };

  return (
    <div>
      <Page>
        {playLottie ? (
          <UncontrolledLottie animationData={animationData} />
        ) : null}
        <div className={playLottie ? "d-none" : ""}>
          <div className="d-sm-flex align-items-center justify-content-between mb-4 mt-5">
            <Heading className="text-capitalize" text={displayHeader()} />
            <button
              className="mt-3-sm d-sm-inline-block btn btn-secondary btn-sm shadow-sm"
              onClick={() => history.goBack()}
            >
              Back
            </button>
          </div>

          <div className="row">
            <InformationCard className="col-lg-4 mb-4" img={thumb} />
            <InformationCard
              className="col-lg-4 mb-4"
              color="primary"
              title="Calories/Serving"
              text={meal.nf_calories + " calories"}
            />
            <InformationCard
              className="col-lg-4 mb-4"
              color="info"
              title="Serving Size"
              text={
                meal.serving_qty && meal.serving_unit
                  ? meal.serving_qty + " " + meal.serving_unit
                  : meal.serving_weight_grams
                  ? getGrams(meal.serving_weight_grams)
                  : "1 meal"
              }
            />
          </div>
          <div className="row">
            <InformationCard
              className="col-lg-4 mb-4"
              color="success"
              title="Protein/Serving"
              text={getGrams(meal.nf_protein)}
            />
            <InformationCard
              className="col-lg-4 mb-4"
              color="warning"
              title="Carbs/Serving"
              text={getGrams(meal.nf_total_carbohydrate)}
            />
            <InformationCard
              className="col-lg-4 mb-4"
              color="dark"
              title="Fat/Serving"
              text={getGrams(meal.nf_total_fat)}
            />
          </div>
          {meal.sub_recipe && meal.sub_recipe.length > 0 && (
            <div className="row">
              <Card
                className="col-lg-12"
                text="Ingredients"
                body={
                  <div>
                    <div className="row">
                      <span className="font-weight-bold col-4">Name</span>
                      <span className="font-weight-bold col-4">Calories</span>
                      <span className="font-weight-bold col-4">
                        Serving Size
                      </span>
                    </div>
                    <hr></hr>
                    {meal.sub_recipe.map((i) => (
                      <div key={i.food}>
                        <div
                          className="row ingredient pb-2"
                          onClick={() => handleIngredientClick(i)}
                        >
                          <span className="col-4 text-capitalize">
                            {i.food}
                          </span>
                          <span className="col-4">{i.calories}</span>
                          <span className="col-4">
                            {i.serving_unit
                              ? i.serving_qty + " " + i.serving_unit
                              : i.serving_qty}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                }
              />
            </div>
          )}

          <div className="d-flex justify-content-around mb-3">
            <button
              className="btn btn-primary btn-sm shadow-sm"
              onClick={handleShow}
            >
              Add to Consumed Items
            </button>
            {localUserMeal ? (
              <div>
                {meal.created_meal && (
                  <button
                    className="btn btn-secondary btn-sm shadow-sm ml-3 mr-3"
                    onClick={handleShowEdit}
                  >
                    Edit
                  </button>
                )}
                <button
                  className="btn btn-danger btn-sm shadow-sm ml-3"
                  onClick={handleShowDeleteModal}
                >
                  Delete
                </button>
              </div>
            ) : (
              <button
                className="btn btn-secondary btn-sm shadow-sm"
                onClick={handleAddToMyMeals}
              >
                Add to Your Meals
              </button>
            )}
          </div>
        </div>
        {/* Modal for added the meal to consumed meals */}
        <Modal show={show} onHide={handleClose}>
          <Modal.Header>
            <Modal.Title>Enter the Number of Servings You Had</Modal.Title>

            <i
              className="fa fa-times exit"
              aria-hidden="true"
              onClick={handleClose}
            ></i>
          </Modal.Header>
          <Modal.Body className="d-flex justify-content-center">
            <input
              className="form-control"
              type="number"
              value={servings}
              min="0"
              onChange={(e) => setServings(e.target.value)}
            />
          </Modal.Body>

          <Modal.Footer>
            <button
              className="btn btn-secondary btn-sm shadow-sm"
              onClick={handleClose}
            >
              Close
            </button>
            <button
              className="btn btn-primary btn-sm shadow-sm"
              onClick={handleAddToConsumedMeals}
            >
              Add
            </button>
          </Modal.Footer>
        </Modal>
        {/* Modal for the consumed meals */}
        <Modal
          show={showEdit}
          onHide={handleCloseEdit}
          dialogClassName="modal-lg"
        >
          <Modal.Header>
            <Modal.Title>Edit Meal</Modal.Title>
            <i
              className="fa fa-times exit"
              aria-hidden="true"
              onClick={handleCloseEdit}
            ></i>
          </Modal.Header>
          <Modal.Body>
            <MealModificationForm
              meal={meal}
              setMeal={setMeal}
              handleClose={handleCloseEdit}
            />
          </Modal.Body>
          <Modal.Footer>
            <button
              className="btn btn-secondary btn-sm shadow-sm"
              onClick={handleCloseEdit}
            >
              Close
            </button>
          </Modal.Footer>
        </Modal>
        {/* Modal for confirming if the user really wants to delete the curr meal */}
        <DeleteMealModal
          show={showDeleteModal}
          handleClose={handleCloseDeleteModal}
          currMeal={meal}
          handleDelete={handleDelete}
        />
      </Page>
    </div>
  );
}

export default SpecificMeal;
