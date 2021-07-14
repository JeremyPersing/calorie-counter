import React from "react";
import Joi from "joi-browser";
import Form from "./Form";
import { putUserMeal, updateLocalUserMeal } from "../services/mealService";

class MealModificationForm extends Form {
  state = {
    data: {
      brand_name: this.props.meal.brand_name,
      ingredients: this.props.meal.ingredients || [],
      item_name: this.props.meal.item_name,
      nf_calories: this.props.meal.nf_calories,
      nf_protein: this.props.meal.nf_protein,
      nf_total_carbohydrate: this.props.meal.nf_total_carbohydrate,
      nf_total_fat: this.props.meal.nf_total_fat,
      servings: this.props.meal.servings || 1,
    },
    priorMeal: this.props.meal,
    errors: {},
  };

  schema = {
    brand_name: Joi.string().required(),
    item_name: Joi.string().required().label("Meal Name"),
    ingredients: Joi.array().label("Ingredients"),
    nf_calories: Joi.number().min(0).required().label("Calories"),
    nf_protein: Joi.number().min(0).required().label("Protein"),
    nf_total_carbohydrate: Joi.number().min(0).required().label("Carbs"),
    nf_total_fat: Joi.number().min(0).required().label("Fat"),
    servings: Joi.number().min(0).required().label("Servings"),
  };

  componentDidMount() {
    let currSelected = JSON.parse(localStorage.getItem("currentMealSelected"));
    // Makes sure that when the user refreshes the page, the most recent version of the updated
    // meal is being displayed
    if (currSelected !== this.props.priorMeal)
      this.setState({ priorMeal: currSelected });
  }

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

  render() {
    return (
      <div>
        <form>
          <label>Brand</label>
          {this.renderInput("brand_name", "Brand")}
          <label>Item</label>
          {this.renderInput("item_name", "Ingredient Name")}
          <label>Calories/Serving</label>
          {this.renderInput("nf_calories", "Calories/Serving", "number")}
          <label>Protein/Serving</label>
          {this.renderInput("nf_protein", "Protein/Serving (g)", "number")}
          <label>Carbs/Serving</label>
          {this.renderInput(
            "nf_total_carbohydrate",
            "Carbs/Serving (g)",
            "number"
          )}
          <label>Fat/Serving</label>
          {this.renderInput("nf_total_fat", "Fat/Serving (g)", "number")}
          <label>Number of Servings</label>
          {this.renderInput("servings", "Servings", "number")}
        </form>
        <button
          className="btn btn-primary w-100"
          disabled={this.validate()}
          onClick={this.handleSubmit}
        >
          Save
        </button>
      </div>
    );
  }
}

export default MealModificationForm;
