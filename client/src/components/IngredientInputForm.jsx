import React from "react";
import Joi from "joi-browser";
import Form from "./Form";
import { postUserMeal, pushLocalUserMeal } from "../services/mealService";
import SearchImageModal from "./SearchImageModal";
import DeleteIcon from "./DeleteIcon";

class IngredientInputForm extends Form {
  // props for this class are meal, ingredientList, handleClose

  state = {
    data: {
      food_name: "",
      brand_name: null,
      serving_qty: null,
      serving_unit: "",
      serving_weight_grams: null,
      nf_calories: null,
      nf_protein: null,
      nf_total_carbohydrate: null,
      nf_total_fat: null,
      thumb: "",
    },
    errors: {},
    show: false,
  };

  schema = {
    food_name: Joi.string().required().label("Ingredient Name"),
    brand_name: Joi.string().allow(null).allow(""),
    serving_qty: Joi.number().min(0).allow(null).allow(""),
    serving_unit: Joi.string().allow(null).allow(""),
    serving_weight_grams: Joi.number()
      .min(0)
      .required()
      .label("Weight of Serving"),
    nf_calories: Joi.number().min(0).required().label("Calories"),
    nf_protein: Joi.number().min(0).required().label("Protein"),
    nf_total_carbohydrate: Joi.number().min(0).required().label("Carbs"),
    nf_total_fat: Joi.number().min(0).required().label("Fat"),
    thumb: Joi.string().allow(""),
  };

  handleSubmit = async () => {
    const errors = this.validate();
    if (errors) {
      this.setState({ errors });
      return;
    }

    const meal = this.state.data;
    console.log("meal b4", meal);

    // Sanitize the data
    meal.serving_qty = Number(meal.serving_qty);
    meal.serving_weight_grams = Number(meal.serving_weight_grams);
    meal.nf_calories = Number(meal.nf_calories);
    meal.nf_protein = Number(meal.nf_protein);
    meal.nf_total_carbohydrate = Number(meal.nf_total_carbohydrate);
    meal.nf_total_fat = Number(meal.nf_total_fat);
    if (!meal.serving_qty) meal.serving_qty = 1;
    if (!meal.serving_unit) meal.serving_unit = "meal";
    if (!meal.thumb)
      meal.thumb =
        "https://d2eawub7utcl6.cloudfront.net/images/nix-apple-grey.png";

    // Add additional necessary fields
    meal.liked = false;
    meal.nix_item_id = null;
    meal.created_meal = true;
    meal.user_meal = true;
    meal.sub_recipe = [];

    console.log("meal after more info", meal);

    try {
      const { data } = await postUserMeal(meal);
      console.log(data);

      this.props.ingredientList.push(data);
      this.props.handleClose();
    } catch (error) {
      console.log(error);
    }
  };

  handleShow = () => this.setState({ show: true });
  handleClose = () => this.setState({ show: false });

  handleImageClicked = (imgUrl) => {
    const data = { ...this.state.data };
    data.thumb = imgUrl;

    this.setState({ data });
    this.setState({ show: false });
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
          {this.renderInput("food_name", "Ingredient Name")}
          {this.renderInput("nf_calories", "Calories/Serving", "number")}
          {this.renderInput("nf_protein", "Protein/Serving (g)", "number")}
          {this.renderInput(
            "nf_total_carbohydrate",
            "Carbs/Serving (g)",
            "number"
          )}
          {this.renderInput("nf_total_fat", "Fat/Serving (g)", "number")}
          {this.renderInput(
            "serving_weight_grams",
            "Weight of Serving (g)",
            "number"
          )}
          <div className="text-center">Optional</div>
          {this.renderInput("brand_name", "Brand")}
          <div className="form-row" style={{ marginTop: "-10px" }}>
            <span className="col-sm-6" style={{ marginBottom: "-10px" }}>
              {this.renderInput(
                "serving_qty",
                "Quantity of Ingredient/Serving"
              )}
            </span>
            <span className="col-sm-6">
              {this.renderInput(
                "serving_unit",
                "Serving Unit (cup, oz, slice, etc)"
              )}
            </span>
          </div>
          {!this.state.data.thumb ? (
            <button
              className="btn btn-secondary btn-user btn-block"
              onClick={this.handleShow}
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
            onClick={this.handleSubmit}
            disabled={this.validate()}
            className="btn btn-primary btn-user btn-block"
            type="submit"
          >
            Add Meal
          </button>
        </div>
        <SearchImageModal
          show={this.state.show}
          handleClose={this.handleClose}
          onImageClick={this.handleImageClicked}
        />
      </div>
    );
  }
}

export default IngredientInputForm;
