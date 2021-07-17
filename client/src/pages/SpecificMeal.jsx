import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import Page from "../components/Page";
import Heading from "../components/Heading";
import InformationCard from "../components/InformationCard";
import Card from "../components/Card";
import { toast } from "react-toastify";
import "../styles/SpecificMeal.css";
import {
  getUserMealByNameAndBrand,
  getMealById,
  getLocalUserMeals,
  postSearchedMeal,
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
  const [playLottie, setPlayLottie] = useState(false);
  let history = useHistory();

  useEffect(() => {
    async function getMeal() {
      let urlArray = props.location.pathname.split("/");
      let mealId;

      // user created meal
      if (urlArray.length === 4) mealId = [urlArray[2], urlArray[3]];
      else mealId = urlArray[2]; // Can either be a name or 24 char string
      console.log("mealId", mealId);

      setPlayLottie(true);
      // Using localstorage to have persistant meal in the case that user refreshes
      // We only set this when the user clicks on an item and is taken to this page
      let meal = JSON.parse(localStorage.getItem("currentMealSelected"));

      if (!meal || mealId !== meal.food_name || mealId !== meal.nix_item_id) {
        try {
          const nixIdRegex = /^[a-f\d]{24}$/i;

          // User created meal
          if (Array.isArray(mealId)) {
            console.log(mealId[0]);
            console.log(mealId[1]);
            meal = await getUserMealByNameAndBrand(mealId[0], mealId[1]);
            meal = meal.data;
          } else {
            if (mealId.match(nixIdRegex)) {
              console.log("matches ");
              meal = await nutritionixService.getMealByNixItemId(mealId);
            } else {
              meal = await nutritionixService.getMealDetails(mealId);
            }
            meal = meal.data.foods[0];
          }

          localStorage.setItem("currentMealSelected", JSON.stringify(meal));
        } catch (error) {
          console.log(error);
        }
      }

      // See if the meal exists in the user's meals so they can possibly edit / delete

      // const index = JSON.parse(localStorage.getItem("userMeals")).findIndex(
      //   (m) => m._id === meal.item_id
      // );
      // if (index !== -1) setLocalUserMeal(true);

      setMeal(meal);

      setPlayLottie(false);
    }
    getMeal();
  }, [props.location.pathname]);

  const displayHeader = () => {
    if (meal.brand_name === undefined || meal.brand_name === null) {
      return meal.food_name;
    }
    return meal.brand_name + " " + meal.food_name;
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleAdd = async () => {
    if (servings <= 0) {
      return toast.error("Please enter a valid input");
    }
    handleClose();
    const obj = {
      brand_name: meal.brand_name,
      item_id: meal.item_id,
      item_name: meal.item_name,
      ingredients: meal.ingredients || [],
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

  const handleAddToMyMeals = async () => {
    const serverObj = {
      brand_name: meal.brand_name,
      item_name: meal.item_name,
      item_id: meal.item_id,
      ingredients: [],
      nf_calories: meal.nf_calories,
      nf_total_fat: meal.nf_total_fat,
      nf_total_carbohydrate: meal.nf_total_carbohydrate,
      nf_protein: meal.nf_protein,
      servings: 1,
      liked: false,
      _id: meal.item_id,
    };

    try {
      setLocalUserMeal(true);
      const response = await postSearchedMeal(serverObj);
      if (response.status === 200) pushLocalUserMeal(response.data);
    } catch (error) {
      setLocalUserMeal(false);
      console.log(error);
    }
  };
  const handleDelete = async () => {
    try {
      const response = await deleteMealById(meal.item_id);
      if (response.status === 200) deleteLocalUserMealById(meal.item_id);

      history.goBack();
    } catch (error) {
      toast.error("Please add this meal to delete it");
    }
  };

  const handleIngredientClick = (ingredientObj) => {
    console.log(ingredientObj);
    const mealName = ingredientObj.food;

    const location = {
      pathname: "/meals/" + mealName,
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
            <InformationCard
              className="col-lg-6 mb-4"
              color="primary"
              title="Calories/Serving"
              text={meal.nf_calories + " calories"}
            />
            <InformationCard
              className="col-lg-6 mb-4"
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
                <button
                  className="btn btn-secondary btn-sm shadow-sm"
                  onClick={handleShowEdit}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger btn-sm shadow-sm"
                  onClick={handleDelete}
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
            <button className="btn btn-secondary" onClick={handleClose}>
              Close
            </button>
            <button className="btn btn-primary" onClick={handleAdd}>
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
            <button className="btn btn-secondary" onClick={handleCloseEdit}>
              Close
            </button>
          </Modal.Footer>
        </Modal>
      </Page>
    </div>
  );
}

export default SpecificMeal;
