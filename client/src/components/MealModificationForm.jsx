import React from "react";
import Joi from "joi-browser";
import Form from "./Form";
import DeleteIcon from "./DeleteIcon";
import SearchImageModal from "./SearchImageModal";
import { putUserMeal, updateLocalUserMeal } from "../services/mealService";

class MealModificationForm extends Form {
  state = {
    data: {
      brand_name: this.props.meal.brand_name,
      sub_recipe: this.props.meal.sub_recipe,
      food_name: this.props.meal.food_name,
      nf_calories: this.props.meal.nf_calories,
      nf_protein: this.props.meal.nf_protein,
      nf_total_carbohydrate: this.props.meal.nf_total_carbohydrate,
      nf_total_fat: this.props.meal.nf_total_fat,
      thumb: this.props.meal.photo.thumb,
    },
    showImageModal: false,
    priorMeal: this.props.meal,
    errors: {},
  };

  schema = {
    brand_name: Joi.string().required(),
    food_name: Joi.string().required().label("Meal Name"),
    sub_recipe: Joi.array().label("Ingredients"),
    nf_calories: Joi.number().min(0).required().label("Calories"),
    nf_protein: Joi.number().min(0).required().label("Protein"),
    nf_total_carbohydrate: Joi.number().min(0).required().label("Carbs"),
    nf_total_fat: Joi.number().min(0).required().label("Fat"),
    thumb: Joi.string().required(),
  };

  componentDidMount() {
    let currSelected = JSON.parse(localStorage.getItem("currentMealSelected"));
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

  handleSubmit = async (e) => {
    e.preventDefault();

    const errors = this.validate();
    if (errors) {
      this.setState({ errors });
      return;
    }

    const meal = this.state.data;
    meal._id = this.state.priorMeal.item_id;
    meal.liked = this.props.meal.liked;
    meal.servings = Number(this.state.data.servings);

    try {
      const response = await putUserMeal(meal);

      if (response.status === 200) {
        // This will be used in AddMeal.jsx removeIngredient()
        // to call the server to delete meal from db
        // response.data.fields.isInputted = true;
        updateLocalUserMeal(response.data.meals[0]);
        meal.item_id = this.state.priorMeal.item_id;

        this.props.setMeal(meal);
        localStorage.setItem("currentMealSelected", JSON.stringify(meal));
        this.props.handleClose();
      }
    } catch (error) {
      alert(error);
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

  render() {
    return (
      <div>
        <div className="form-user">
          <small className="ml-3">
            <strong>Brand</strong>
          </small>
          {this.renderInput("brand_name", "Brand")}
          <small className="ml-3">
            <strong>Item Name</strong>
          </small>
          {this.renderInput("food_name", "Ingredient Name")}
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
          {this.state.data.sub_recipe.length > 0 && (
            <div>
              <small className="ml-3">
                <strong>Ingredients</strong>
              </small>
              {this.state.data.sub_recipe.map((m) => (
                <span key={m.food_name}>{m.food_name}</span>
              ))}
            </div>
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
      </div>
    );
  }
}

export default MealModificationForm;
