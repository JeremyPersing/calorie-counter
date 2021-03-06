import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import Page from "../components/Page";
import Heading from "../components/Heading";
import InformationCard from "../components/InformationCard";
import Card from "../components/Card";
import EditConsumedMealModal from "../components/EditConsumedMealModal";
import DeleteMealModal from "../components/DeleteMealModal";
import { toast } from "react-toastify";
import "../styles/SpecificMeal.css";
import {
  getUserMealByNameAndBrand,
  updateLocalSearchedMeal,
  getUserMealByName,
  postUserMeal,
  pushLocalUserMeal,
  deleteMealById,
  getUserMeals,
  deleteLocalUserMealById,
  postConsumedMeal,
} from "../services/mealService";
import nutritionixService from "../services/nutritionixService";
import UncontrolledLottie from "../components/UncontrolledLottie";
import animationData from "../lotties/lf30_editor_2nt0sohi.json";
import MealModificationForm from "../components/MealModificationForm";

function SpecificMeal(props) {
  const [show, setShow] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [servings, setServings] = useState(1);
  const [localUserMeal, setLocalUserMeal] = useState(false); // Allows user to edit/delete meal
  const [meal, setMeal] = useState({});
  // consumedMeal shows correct calories for user's serving consumed w/out changing the original meals data
  const [consumedMeal, setConsumedMeal] = useState({});
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
      toast.error("Could not retrieve meal");
    }
  };

  const getSpecificNutritionixMeal = async (mealId) => {
    try {
      const nixIdRegex = /^[a-f\d]{24}$/i;

      let meal;
      if (mealId.match(nixIdRegex)) {
        meal = await nutritionixService.getMealByNixItemId(mealId);
      } else {
        meal = await nutritionixService.getMealDetails(mealId);
      }

      return meal.data.foods[0];
    } catch (error) {
      toast.error("Could not retrieve meal");
    }
  };

  useEffect(() => {
    async function getMeal() {
      try {
        let urlArray = props.location.pathname.split("/");
        let mealId;

        // user created meal
        if (urlArray.length === 4) mealId = [urlArray[2], urlArray[3]];
        else mealId = urlArray[2]; // Can either be a name or 24 char string

        setPlayLottie(true);
        let meal = props.location.meal;
        if (!meal)
          meal = JSON.parse(localStorage.getItem("currentMealSelected"));

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
            if (Array.isArray(mealId)) {
              meal = await getSpecificUserMeal(mealId);
            }
            // nutritionix meal
            else {
              meal = await getSpecificNutritionixMeal(mealId);
            }
          }
        }

        // Set the current meal to localStorage in case the user refreshes the page
        localStorage.setItem("currentMealSelected", JSON.stringify(meal));

        setThumb(meal.photo.thumb); // Get an error that meal.photo.thumb doesn't exist if try directly in jsx
        setMeal(meal);
        setConsumedMeal(meal);


        // See if the meal is editable or not
        let arr = await getUserMeals();
        arr = arr.data;
        const index = arr.findIndex((m) => m.food_name === meal.food_name);
        if (index > -1) setLocalUserMeal(true);
        else setLocalUserMeal(false);

        setPlayLottie(false);
      } catch (error) {
        toast.error("An unexpected error has occurred");
      }
    }
    getMeal();
  }, [props.location.pathname]);

  const displayHeader = () => {
    if (meal.brand_name && meal.food_name) {
      return meal.brand_name + " " + meal.food_name;
    }
    return meal.food_name;
  };

  const handleClose = () => {
    handleServingsChange(1);
    setShow(false);
  };
  const handleShow = () => setShow(true);

  const handleAddToConsumedMeals = async () => {
    const serverObj = {
      food_name: consumedMeal.food_name,
      brand_name: consumedMeal.brand_name,
      serving_unit: consumedMeal.serving_unit,
      serving_weight_grams: consumedMeal.serving_weight_grams,
      nf_calories: consumedMeal.nf_calories,
      nf_protein: consumedMeal.nf_protein,
      nf_total_carbohydrate: consumedMeal.nf_total_carbohydrate,
      nf_total_fat: consumedMeal.nf_total_fat,
      nix_item_id: consumedMeal.nix_item_id, // can help identify if the user created the meal or not
    };

    !consumedMeal.sub_recipe
      ? (serverObj.sub_recipe = [])
      : (serverObj.sub_recipe = consumedMeal.sub_recipe);
    !consumedMeal.liked ? (serverObj.liked = false) : (serverObj.liked = true);
    !consumedMeal.created_meal
      ? (serverObj.created_meal = false)
      : (serverObj.created_meal = true);
    !consumedMeal.user_meal
      ? (serverObj.user_meal = false)
      : (serverObj.user_meal = true);
    if (consumedMeal._id) serverObj._id = consumedMeal._id;
    serverObj.serving_qty = Number(servings);
    serverObj.thumb = consumedMeal.photo.thumb;

    handleClose();

    try {
      await postConsumedMeal(serverObj);
      history.push("/");
    } catch (error) {
      toast.error("An error occurred adding a meal");
    }
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
      updateLocalSearchedMeal(response.data);

      setMeal(response.data);
      setConsumedMeal(response.data);
    } catch (error) {
      setLocalUserMeal(false);
    }
  };

  const handleDelete = async () => {
    try {
      let response, mealId;
      if (meal._id) {
        response = await deleteMealById(meal._id);
        mealId = meal._id;
      } else {
        let res = await getUserMealByNameAndBrand(
          meal.food_name,
          meal.brand_name
        );

        res = res.data;
        mealId = res._id;
        response = await deleteMealById(res._id);
      }
      if (response.status === 200) deleteLocalUserMealById(mealId);

      updateLocalSearchedMeal(meal);
      handleCloseDeleteModal();
      history.goBack();
    } catch (error) {
      toast.error("Please add this meal to delete it");
    }
  };

  const handleIngredientClick = (ingredientObj) => {
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

  const handleServingsChange = (value) => {
    setServings(value);

    const tempMeal = { ...meal };
    tempMeal.nf_calories *= value;
    tempMeal.nf_protein *= value;
    tempMeal.nf_total_carbohydrate *= value;
    tempMeal.nf_total_fat *= value;

    setConsumedMeal(tempMeal);
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
              className="mt-3-sm d-sm-inline-block btn btn-secondary"
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
                  ? meal.serving_qty.toFixed(2) + " " + meal.serving_unit
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
            <button className="btn btn-primary" onClick={handleShow}>
              Add to Consumed Meals
            </button>
            {localUserMeal ? (
              <div>
                {meal.created_meal && (
                  <button
                    className="btn btn-secondary ml-3 mr-3"
                    onClick={handleShowEdit}
                  >
                    Edit
                  </button>
                )}
                <button
                  className="btn btn-danger ml-3"
                  onClick={handleShowDeleteModal}
                >
                  Delete
                </button>
              </div>
            ) : (
              <button
                className="btn btn-secondary"
                onClick={handleAddToMyMeals}
              >
                Add to Your Meals
              </button>
            )}
          </div>
        </div>
        {/* Modal for added the meal to consumed meals */}
        {consumedMeal && (
          <EditConsumedMealModal
            show={show}
            handleClose={handleClose}
            handleAdd={handleAddToConsumedMeals}
            consumedMeal={consumedMeal}
            servings={servings}
            onChange={(e) => handleServingsChange(e.target.value)}
          />
        )}
        {/* Modal for editing meal */}
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
              setMeal={(meal) => {
                setMeal(meal);
                setConsumedMeal(meal);
                setThumb(meal.photo.thumb);
              }}
              handleClose={handleCloseEdit}
            />
          </Modal.Body>
          <Modal.Footer>
            <button className="btn btn-secondary" onClick={handleCloseEdit}>
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
