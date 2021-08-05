import React from "react";
import Joi from "joi-browser";
import Form from "../components/Form";
import ConditionalModal from "../components/ConditionalModal";
import DeleteIcon from "../components/DeleteIcon";
import {
  getUserMealById,
  deleteUserMeal,
  postUserMeal,
  pushLocalUserMeal,
} from "../services/mealService";
import { sumNutrientField } from "../utils/sumNutrientField";
import nutritionixService from "../services/nutritionixService";
import Page from "../components/Page";
import "../styles/App.css";
import { toast } from "react-toastify";
import SearchImageModal from "../components/SearchImageModal";

class AddMeal extends Form {
  state = {
    data: {
      brand_name: "",
      food_name: "",
      thumb: "",
    },
    errors: {},
    searchClicked: false, // For the ingredient input modal
    inputClicked: false, // For the ingredient input modal
    show: false, // To show either ingredient modals
    showImageSearch: false, // To the image search modal
    searchQuery: "",
    products: [],
    ingredients: [],
  };

  schema = {
    brand_name: Joi.string().required().allow(null).allow(""),
    food_name: Joi.string().required().label("Meal Name"),
    thumb: Joi.string().allow(null).allow(""),
  };

  handleShow = () => this.setState({ show: true });
  handleClose = () => {
    this.setState({ show: false });
    if (this.state.searchClicked) this.setState({ searchClicked: false });
    if (this.state.inputClicked) this.setState({ inputClicked: false });
  };
  handleShowImageSearch = () => this.setState({ showImageSearch: true });
  handleCloseImageSearch = () => this.setState({ showImageSearch: false });

  handleSearchClicked = () => {
    this.handleShow();
    this.setState({ searchClicked: true });
  };

  handleInputClicked = () => {
    this.handleShow();
    this.setState({ inputClicked: true });
  };

  handleSubmit = async () => {
    const errors = this.validate();
    if (errors) {
      this.setState({ errors });
      return;
    }

    const currIngredients = this.state.ingredients;
    const ingredientsList = [];
    for (const i in currIngredients) {
      let obj = {
        serving_weight: currIngredients[i].serving_weight_grams,
        food: currIngredients[i].food_name,
        calories: currIngredients[i].nf_calories,
        serving_qty: currIngredients[i].serving_qty
          ? currIngredients[i].serving_qty
          : 1,
        serving_unit: currIngredients[i].serving_unit
          ? currIngredients[i].serving_unit
          : "meal",
        created_meal: currIngredients[i].created_meal ? true : false,
      };
      ingredientsList.push(obj);
    }

    try {
      const totalCalories = sumNutrientField(
        this.state.ingredients,
        "nf_calories"
      );
      const totalProtein = sumNutrientField(
        this.state.ingredients,
        "nf_protein"
      );
      const totalCarbs = sumNutrientField(
        this.state.ingredients,
        "nf_total_carbohydrate"
      );
      const totalFat = sumNutrientField(this.state.ingredients, "nf_total_fat");
      const totalServingWeight = sumNutrientField(
        this.state.ingredients,
        "serving_weight_grams"
      );

      const brand_name = this.state.brand_name ? this.state.brand_name : null;
      const thumb = this.state.data.thumb
        ? this.state.data.thumb
        : "https://d2eawub7utcl6.cloudfront.net/images/nix-apple-grey.png";

      const serverObj = {
        food_name: this.state.data.food_name,
        brand_name: brand_name,
        serving_qty: 1,
        serving_unit: "meal",
        serving_weight_grams: totalServingWeight,
        nf_calories: totalCalories,
        nf_protein: totalProtein,
        nf_total_carbohydrate: totalCarbs,
        nf_total_fat: totalFat,
        nix_item_id: null,
        thumb: thumb,
        sub_recipe: ingredientsList,
        liked: false,
        created_meal: true,
        user_meal: true,
      };

      const response = await postUserMeal(serverObj);
      if (response.status === 200) pushLocalUserMeal(response.data);

      this.props.history.push("/meals/mine");
    } catch (error) {
      if (error.response.status === 409) {
        toast.error(
          "A meal with that name already exists. Try changing the name or searching for that meal."
        );
      }
    }
  };

  handleSearchChanged = (e) => {
    this.setState({ searchQuery: e.target.value });
  };

  removeIngredient = async (meal) => {
    const originalIngredients = [...this.state.ingredients];
    let currIngredients = [...this.state.ingredients];

    currIngredients = currIngredients.filter((m) => m !== meal);
    this.setState({ ingredients: currIngredients });

    // Deletes only the meals created from input because those get pushed to the db
    if (meal.created_meal) {
      try {
        await deleteUserMeal(meal);
        // if (response.status === 200) deleteLocalUserMealById(meal._id);
      } catch (error) {
        toast.error("An unexpected error has occurred");
        this.setState({ ingredients: originalIngredients });
      }
    }
  };

  setProducts = (arr) => {
    this.setState({ products: arr });
  };

  handleMealClicked = async (meal) => {
    try {
      let res;
      if (meal.user_meal) {
        res = await getUserMealById(meal._id);
        res = res.data;
      } // Ingredient tied to specific brand
      else if (meal.nix_item_id) {
        res = await nutritionixService.getMealByNixItemId(meal.nix_item_id);
        res = res.data.foods[0];
      } // Generic ingredient
      else {
        res = await nutritionixService.getMealDetails(meal.food_name);
        res = res.data.foods[0];
      }

      let ingredientsArr = [...this.state.ingredients];
      ingredientsArr.push(res);

      this.setState({ ingredients: ingredientsArr });

      this.handleClose();
    } catch (error) {
      toast.error("Unable to add meal");
      this.handleClose();
    }
  };

  handleImageClicked = (imgUrl) => {
    const data = { ...this.state.data };
    data.thumb = imgUrl;
    this.setState({ data });
    this.handleCloseImageSearch();
  };

  handleDeleteImage = () => {
    const data = { ...this.state.data };
    data.thumb = "";
    this.setState({ data });
  };

  render() {
    return (
      <>
        <Page>
          <h5 className="text-center mt-3">Create a Meal</h5>
          <div>
            <div className="form-user">
              {this.renderInput("brand_name", "Brand")}
              {this.renderInput("food_name", "Meal Name")}
              {/* SearchImage button/Image */}
              {!this.state.data.thumb ? (
                <button
                  className="btn btn-secondary btn-user btn-block"
                  onClick={this.handleShowImageSearch}
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
              {/* Ingredients */}
              {this.state.ingredients.length !== 0 ? (
                <div className="text-center">
                  <h5 className="pt-3">Ingredients</h5>
                  {this.state.ingredients.map((i) => (
                    <div
                      key={i.food}
                      className="d-flex justify-content-between"
                    >
                      <span className="text-capitalize col-6">
                        {i.food_name}
                      </span>
                      <span className="col-3">{i.nf_calories}</span>
                      <DeleteIcon
                        className="mt-1 col-3"
                        onClick={() => this.removeIngredient(i)}
                        aria-hidden="true"
                      />
                    </div>
                  ))}

                  <p className="pt-3">
                    <span className="font-weight-bold">Calories</span>:{" "}
                    {sumNutrientField(this.state.ingredients, "nf_calories")}
                  </p>
                </div>
              ) : null}
              {this.state.ingredients.length > 0 ? (
                <div className="text-center mt-3">
                  <button
                    onClick={this.handleSubmit}
                    disabled={this.validate()}
                    className="btn btn-primary btn-user btn-block"
                  >
                    Create Meal
                  </button>
                </div>
              ) : null}
              {/* Ingredient Buttons */}
              <div className="form-row mt-3 justify-content-around">
                <button
                  className="btn btn-secondary btn-user"
                  onClick={this.handleSearchClicked}
                >
                  Search Ingredient
                </button>
                <button
                  className="btn btn-secondary btn-secondary btn-user"
                  onClick={this.handleInputClicked}
                >
                  Input Ingredient
                </button>
              </div>
            </div>
          </div>
          {/* Modals */}
          <SearchImageModal
            show={this.state.showImageSearch}
            onImageClick={this.handleImageClicked}
            handleClose={this.handleCloseImageSearch}
          />
          <ConditionalModal
            onMealClick={this.handleMealClicked}
            show={this.state.show}
            handleClose={this.handleClose}
            condition={this.state.searchClicked}
            headerOne="Search for Your Ingredient"
            headerTwo="Input Your Ingredient"
            ingredientList={this.state.ingredients}
            setIngredientList={(arr) => this.setState({ ingredients: arr })}
            setProducts={this.setProducts}
            products={this.state.products}
          />
        </Page>
      </>
    );
  }
}

export default AddMeal;
