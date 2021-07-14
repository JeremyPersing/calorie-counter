import React from "react";
import Joi from "joi-browser";
import Form from "./Form";
import { postUserMeal, pushLocalUserMeal } from "../services/mealService";

class IngredientInputForm extends Form {
  // props for this class are meal, ingredientList, handleClose

  state = {
    data: {
      brand_name: "",
      item_name: "",
      nf_calories: "",
      nf_protein: "",
      nf_total_carbohydrate: "",
      nf_total_fat: "",
      servings: "",
    },
    errors: {},
  };

  schema = {
    brand_name: Joi.string().required(),
    item_name: Joi.string().required().label("Ingredient Name"),
    nf_calories: Joi.number().min(0).required().label("Calories"),
    nf_protein: Joi.number().min(0).required().label("Protein"),
    nf_total_carbohydrate: Joi.number().min(0).required().label("Carbs"),
    nf_total_fat: Joi.number().min(0).required().label("Fat"),
    servings: Joi.number().min(0).required().label("Servings"),
  };

  componentDidMount() {
    const { meal } = this.props;
    if (meal)
      this.setState({
        brand_name: meal.brand_name,
        item_name: meal.item_name,
        nf_calories: meal.nf_calories,
        nf_protein: meal.nf_protein,
        nf_total_carbohydrate: meal.nf_total_carbohydrate,
        nf_total_fat: meal.nf_total_fat,
        servings: meal.servings,
      });
  }

  handleSubmit = async (e) => {
    e.preventDefault();

    const errors = this.validate();
    if (errors) {
      this.setState({ errors });
      return;
    }

    const ingredient = this.state.data;
    ingredient.liked = false;
    ingredient.ingredients = [];
    ingredient.servings = Number(this.state.data.servings);
    try {
      const response = await postUserMeal(ingredient);
      if (response.status === 200) {
        // This will be used in AddMeal.jsx removeIngredient()
        // to call the server to delete meal from db
        response.data.fields.isInputted = true;
        pushLocalUserMeal(response.data);
      }

      this.props.ingredientList.push(response.data);
      this.props.handleClose();
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("brand_name", "Brand")}
          {this.renderInput("item_name", "Ingredient Name")}
          {this.renderInput("nf_calories", "Calories/Serving", "number")}
          {this.renderInput("nf_protein", "Protein/Serving (g)", "number")}
          {this.renderInput(
            "nf_total_carbohydrate",
            "Carbs/Serving (g)",
            "number"
          )}
          {this.renderInput("nf_total_fat", "Fat/Serving (g)", "number")}
          {this.renderInput("servings", "Servings", "number")}
          {this.renderButton("Add", "w-100")}
        </form>
      </div>
    );
  }
}

export default IngredientInputForm;
