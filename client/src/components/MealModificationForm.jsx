import React from "react";
import Joi from "joi-browser";
import Form from "./Form";
import DeleteIcon from "./DeleteIcon";
import AddIcon from "./AddIcon";
import IngredientInputForm from "./IngredientInputForm";
import SearchImageModal from "./SearchImageModal";
import SearchMealsDisplay from "./SearchMealsDisplay";
import Dropdown from "react-bootstrap/Dropdown";
import Modal from "react-bootstrap/Modal";
import {
  getUserMealById,
  putUserMeal,
  updateLocalUserMeal,
} from "../services/mealService";
import { toast } from "react-toastify";
import {
  getMealByNixItemId,
  getMealDetails,
} from "./../services/nutritionixService";

class MealModificationForm extends Form {
  state = {
    data: {
      brand_name: this.props.meal.brand_name,
      sub_recipe: this.props.meal.sub_recipe,
      nf_calories: this.props.meal.nf_calories,
      nf_protein: this.props.meal.nf_protein,
      nf_total_carbohydrate: this.props.meal.nf_total_carbohydrate,
      nf_total_fat: this.props.meal.nf_total_fat,
      thumb: this.props.meal.photo.thumb,
    },
    errors: {},
    meal_ingredients: this.props.meal.sub_recipe, // Used for when an ingredient gets added to meal
    showImageModal: false,
    priorMeal: this.props.meal,
    showIngredientInputModal: false,
    value: "",
    products: [],
    showSearchMealsDisplayModal: false,
  };

  schema = {
    brand_name: Joi.string().allow("").allow(null),
    sub_recipe: Joi.array().label("Ingredients"),
    nf_calories: Joi.number().min(0).required().label("Calories"),
    nf_protein: Joi.number().min(0).required().label("Protein"),
    nf_total_carbohydrate: Joi.number().min(0).required().label("Carbs"),
    nf_total_fat: Joi.number().min(0).required().label("Fat"),
    thumb: Joi.string().allow("").allow(null),
  };

  setProducts = (prods) => {
    this.setState({ products: prods });
  };

  componentDidMount() {
    let currSelected = JSON.parse(localStorage.getItem("currentMealSelected"));
    console.log("currSelected", currSelected);
    // Makes sure that when the user refreshes the page, the most recent version of the updated
    // meal is being displayed
    if (currSelected !== this.props.priorMeal)
      this.setState({ priorMeal: currSelected });
  }

  handleShowImageModal = () => {
    this.setState({ showImageModal: true });
  };

  handleCloseImageModal = () => {
    this.setState({ showImageModal: false });
  };

  handleShowIngredientInputModal = () => {
    this.setState({ showIngredientInputModal: true });
  };

  handleCloseIngredientInputModal = () => {
    this.setState({ showIngredientInputModal: false });
  };

  handleShowSearchMealsDisplayModal = () => {
    this.setState({ showSearchMealsDisplayModal: true });
  };

  handleCloseSearchMealsDisplayModal = () => {
    this.setState({ showSearchMealsDisplayModal: false });
  };

  handleSubmit = async () => {
    const errors = this.validate();
    if (errors) {
      this.setState({ errors });
      return;
    }

    const priorMeal = this.state.priorMeal;
    const meal = this.state.data;

    meal.food_name = priorMeal.food_name;
    meal.serving_qty = priorMeal.serving_qty;
    meal.serving_unit = priorMeal.serving_unit;
    meal.serving_weight_grams = priorMeal.serving_weight_grams;
    meal.nix_item_id = priorMeal.nix_item_id;
    meal.liked = priorMeal.liked;
    meal.created_meal = priorMeal.created_meal;
    meal.user_meal = priorMeal.user_meal;
    meal._id = priorMeal._id;
    meal.nf_calories = Number(meal.nf_calories);
    meal.nf_protein = Number(meal.nf_protein);
    meal.nf_total_carbohydrate = Number(meal.nf_total_carbohydrate);
    meal.nf_total_fat = Number(meal.nf_total_fat);
    meal.sub_recipe = this.state.meal_ingredients;

    if (!meal.brand_name) meal.brand_name = null;
    if (!meal.thumb) {
      meal.thumb =
        "https://d2eawub7utcl6.cloudfront.net/images/nix-apple-grey.png";
    }

    console.log("meal before put", meal);
    try {
      const response = await putUserMeal(meal);
      console.log("response from put", response);
      if (response.status === 200) {
        // This will be used in AddMeal.jsx removeIngredient()
        // to call the server to delete meal from db
        localStorage.setItem("userMeals", JSON.stringify(response.data.meals));

        this.props.setMeal(meal);
        localStorage.setItem("currentMealSelected", JSON.stringify(meal));
        this.props.handleClose();
      }
    } catch (error) {
      toast.error("Could not update meal");
    }
  };

  handleImageClicked = (imgUrl) => {
    const data = { ...this.state.data };
    data.thumb = imgUrl;

    this.setState({ data });
    this.setState({ showImageModal: false });
  };

  handleDeleteImage = () => {
    const data = { ...this.state.data };
    data.thumb = null;
    this.setState({ data });
  };

  handleDeleteIngredient = (ingredientObj) => {
    let ingredientsArr = this.state.meal_ingredients.filter(
      (m) => m !== ingredientObj
    );

    this.setState({ meal_ingredients: ingredientsArr });
  };

  addMealIcon = () => {
    const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
      <div
        ref={ref}
        onClick={(e) => {
          e.preventDefault();
          onClick(e);
        }}
      >
        {children}
      </div>
    ));

    const CustomMenu = React.forwardRef(
      ({ children, style, className, "aria-labelledby": labeledBy }, ref) => {
        return (
          <div
            ref={ref}
            style={style}
            className={className}
            aria-labelledby={labeledBy}
          >
            <ul className="list-unstyled">
              {React.Children.toArray(children).filter(
                (child) =>
                  !this.state.value ||
                  child.props.children
                    .toLowerCase()
                    .startsWith(this.state.value)
              )}
            </ul>
          </div>
        );
      }
    );

    return (
      <Dropdown>
        <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
          <AddIcon />
        </Dropdown.Toggle>

        <Dropdown.Menu as={CustomMenu}>
          <Dropdown.Item
            eventKey="1"
            onClick={this.handleShowIngredientInputModal}
          >
            Input Ingredient
          </Dropdown.Item>
          <Dropdown.Item
            onClick={this.handleShowSearchMealsDisplayModal}
            eventKey="2"
          >
            Search Ingredient
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
  };

  handleSearchMealsDisplayMealClick = async (meal) => {
    try {
      let resMeal;
      if (meal.user_meal) {
        const currMealSelected = JSON.parse(
          localStorage.getItem("currentMealSelected")
        );
        if (currMealSelected._id.toString() === meal._id.toString()) {
          throw new Error("Can't add the same ingredient to itself");
        }
        const { data } = await getUserMealById(meal._id);
        resMeal = data;
        console.log("resMeal", resMeal);
      } else if (meal.nix_item_id) {
        const { data } = await getMealByNixItemId(meal.nix_item_id);
        resMeal = data.foods[0];
        console.log("resMeal", resMeal);
      } else {
        const { data } = await getMealDetails(meal.food_name);
        resMeal = data.foods[0];
        console.log("resMeal", resMeal);
      }
      const ingredients_added = [...this.state.ingredients_added];
      ingredients_added.push(resMeal);
      this.setState({ ingredients_added });

      const ingredientObj = {
        serving_weight: resMeal.serving_weight_grams,
        food: resMeal.food_name,
        calories: resMeal.nf_calories,
        serving_qty: resMeal.serving_qty,
        serving_unit: resMeal.serving_unit,
        created_meal: resMeal.created_meal,
      };

      console.log("ingredientObj", ingredientObj);
      //Call the nutritionix server if nutritionix meal
      const ingredientsArr = [...this.state.meal_ingredients];
      ingredientsArr.push(ingredientObj);
      this.setState({ meal_ingredients: ingredientsArr });
      this.handleCloseSearchMealsDisplayModal();
    } catch (error) {
      console.log(error);
      toast.error("Unable to add ingredient");
    }
  };

  render() {
    return (
      <div>
        <div className="form-user">
          <small className="ml-3">
            <strong>Brand</strong>
          </small>
          {this.renderInput("brand_name", "Brand")}
          <small className="ml-3">
            <strong>Calories</strong>
          </small>
          {this.renderInput("nf_calories", "Calories/Serving", "number")}
          <small className="ml-3">
            <strong>Protein (g)</strong>
          </small>
          {this.renderInput("nf_protein", "Protein/Serving (g)", "number")}
          <small className="ml-3">
            <strong>Carbohydrates (g)</strong>
          </small>
          {this.renderInput(
            "nf_total_carbohydrate",
            "Carbs/Serving (g)",
            "number"
          )}
          <small className="ml-3">
            <strong>Fat (g)</strong>
          </small>
          {this.renderInput("nf_total_fat", "Fat/Serving (g)", "number")}
          {this.state.data.sub_recipe.length > 0 ? (
            <div className="mb-3">
              <small className="ml-3 d-flex justify-content-between mb-3">
                <strong>Ingredients</strong>
                {this.addMealIcon()}
              </small>
              {this.state.meal_ingredients.map((m) => (
                <div className="d-flex justify-content-between ml-3 mb-1 ">
                  <span className="text-capitalize" key={m.food}>
                    <small>{m.food}</small>
                  </span>
                  <span className="text-capitalize">
                    <small>{m.calories}</small>
                  </span>
                  <DeleteIcon onClick={() => this.handleDeleteIngredient(m)} />
                </div>
              ))}
            </div>
          ) : (
            <span className="d-flex justify-content-between mb-3">
              <small>
                <strong>Add Ingredient</strong>
              </small>
              <small>{this.addMealIcon()}</small>
            </span>
          )}

          {/* Image */}
          {!this.state.data.thumb ? (
            <button
              className="btn btn-secondary btn-user btn-block"
              onClick={this.handleShowImageModal}
            >
              Search Image
            </button>
          ) : (
            <div className="d-flex justify-content-center img-container">
              <img
                src={this.state.data.thumb}
                alt="meal"
                className="rounded mb-3 ml-1 center"
              />
              <DeleteIcon
                className="img-delete-icon"
                onClick={this.handleDeleteImage}
              />
            </div>
          )}

          <button
            className="btn btn-primary btn-user btn-block"
            disabled={this.validate()}
            onClick={this.handleSubmit}
            type="submit"
          >
            Save
          </button>
        </div>

        <SearchImageModal
          show={this.state.showImageModal}
          handleClose={this.handleCloseImageModal}
          onImageClick={this.handleImageClicked}
        />
        {/* Modal for ingredient input */}
        <Modal
          show={this.state.showIngredientInputModal}
          onHide={this.handleCloseIngredientInputModal}
          backdrop="static"
          size="lg"
        >
          <Modal.Header>
            <Modal.Title>Input Your Ingredient</Modal.Title>
            <i
              className="fa fa-times exit"
              aria-hidden="true"
              onClick={this.handleCloseIngredientInputModal}
            ></i>
          </Modal.Header>
          <Modal.Body>
            <IngredientInputForm
              handleClose={this.handleCloseIngredientInputModal}
              ingredientList={this.state.meal_ingredients}
              pushSmallIngredient={true}
            />
          </Modal.Body>
          <Modal.Footer>
            <button
              className="btn btn-sm shadow-sm btn-secondary"
              onClick={this.handleCloseIngredientInputModal}
            >
              Close
            </button>
          </Modal.Footer>
        </Modal>
        {/* Modal For Searching Ingredient */}
        <Modal
          show={this.state.showSearchMealsDisplayModal}
          onHide={this.handleCloseSearchMealsDisplayModal}
          backdrop="static"
          size="lg"
        >
          <Modal.Header>
            <Modal.Title>Search for Your Ingredient</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <SearchMealsDisplay
              search={true}
              setProducts={this.setProducts}
              products={this.state.products}
              pageLimit={6}
              addMealSearch={true}
              onClick={this.handleSearchMealsDisplayMealClick}
            />
          </Modal.Body>
          <Modal.Footer>
            <button
              className="btn btn-sm shadow-sm btn-secondary"
              onClick={this.handleCloseSearchMealsDisplayModal}
            >
              Close
            </button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default MealModificationForm;
