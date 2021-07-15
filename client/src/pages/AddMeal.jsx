import React from "react";
import Joi from "joi-browser";
import Form from "../components/Form";
import ConditionalModal from "../components/ConditionalModal";
import { sortCaret } from "./../modules/tableModule";
import {
  deleteUserMeal,
  postUserMeal,
  pushLocalUserMeal,
  deleteLocalUserMealById,
} from "../services/mealService";
import IncreaseDecreaseInput from "../components/IncreaseDecreaseInput";
import Page from "../components/Page";
import "../styles/App.css";
import { toast } from "react-toastify";

class AddMeal extends Form {
  state = {
    data: {
      brand_name: "",
      item_name: "",
    },
    errors: {},
    searchClicked: false,
    inputClicked: false,
    show: false,
    searchQuery: "",
    products: [],
    ingredients: [],
    inputValue: "0",
  };

  schema = {
    brand_name: Joi.string().required().allow(null).allow(""),
    item_name: Joi.string().required().label("Meal Name"),
  };

  handleShow = () => {
    this.setState({ show: true });
  };

  handleClose = () => {
    this.setState({ show: false });
    if (this.state.searchClicked) this.setState({ searchClicked: false });
    if (this.state.inputClicked) this.setState({ inputClicked: false });
  };

  handleSearchClicked = () => {
    this.handleShow();
    this.setState({ searchClicked: true });
  };

  handleInputClicked = () => {
    this.handleShow();
    this.setState({ inputClicked: true });
  };

  sumNutrientField = (fieldName) => {
    let sum = 0;
    for (const i in this.state.ingredients) {
      let amount = this.state.ingredients[i].fields[fieldName];
      if (typeof amount !== Number) {
        amount = Number(amount);
      }
      if (this.state.ingredients[i].fields.servings) {
        amount *= this.state.ingredients[i].fields.servings;
      }
      sum += amount;
    }
    return sum.toFixed(2);
  };

  handleSubmit = async () => {
    const errors = this.validate();
    if (errors) {
      this.setState({ errors });
      console.log(errors);
      return;
    }

    const ingredientsList = [];
    for (const i in this.state.ingredients) {
      let obj = {};
      obj._id = this.state.ingredients[i]._id;
      obj.servings = this.state.ingredients[i].fields.servings;
      if (this.state.ingredients[i].item_name)
        obj.item_name = this.state.ingredients[i].item_name;
      if (this.state.ingredients[i].searched_meal) obj.searched_meal = true;
      ingredientsList.push(obj);
    }

    try {
      const totalCalories = this.sumNutrientField("nf_calories");
      const totalProtein = this.sumNutrientField("nf_protein");
      const totalCarbs = this.sumNutrientField("nf_total_carbohydrate");
      const totalFat = this.sumNutrientField("nf_total_fat");

      const serverObj = {
        brand_name: this.state.data.brand_name,
        item_name: this.state.data.item_name,
        ingredients: ingredientsList,
        liked: false,
        nf_calories: totalCalories,
        nf_protein: totalProtein,
        nf_total_carbohydrate: totalCarbs,
        nf_total_fat: totalFat,
      };
      console.log("serverObj in AddMeal", serverObj);

      const response = await postUserMeal(serverObj);
      console.log("data", response.data);
      if (response.status === 200) pushLocalUserMeal(response.data);

      this.props.history.push("/meals/mine");
    } catch (error) {
      console.log(error);
    }
  };

  handleSearchChanged = (e) => {
    this.setState({ searchQuery: e.target.value });
  };

  removeIngredient = async (meal) => {
    const originalIngredients = [...this.state.ingredients];
    let currIngredients = [...this.state.ingredients];
    console.log(currIngredients);
    currIngredients = currIngredients.filter((i) => i._id !== meal._id);
    this.setState({ ingredients: currIngredients });

    // Deletes only the meals created from input because those get pushed to the db
    if (meal.fields.isInputted) {
      try {
        const response = await deleteUserMeal(meal);
        if (response.status === 200) deleteLocalUserMealById(meal._id);
      } catch (error) {
        toast.error("An unexpected error has occurred");
        this.setState({ ingredients: originalIngredients });
      }
    }
  };

  setProducts = (arr) => {
    this.setState({ products: arr });
  };
  // Contains info to add to the ingredients array
  cellEvents = {
    onClick: (e, column, columnIndex, row, rowIndex) => {
      let meal = row;

      let ingredientsArr = this.state.ingredients;
      const index = ingredientsArr.findIndex((m) => m._id === meal._id);

      if (index !== -1) {
        ingredientsArr[index].fields.servings += 1;
        this.setState({ ingredients: ingredientsArr });
        this.handleClose();
        return;
      }

      // This is put into place for so wen a user clicks his specific meal later
      // that the nutritionix backend get called

      meal.item_name = meal.fields.item_name;
      meal.searched_meal = true;

      this.setState({ ingredients: [meal, ...ingredientsArr] });
      this.handleClose();
    },
  };

  keyField = "fields.item_id";

  columns = [
    {
      dataField: "fields.item_name",
      text: "Name",
      sort: true,
      sortCaret: (order, column) => sortCaret(order, column),
      events: this.cellEvents,
    },
    {
      dataField: "fields.brand_name",
      text: "Brand",
      sort: true,
      sortCaret: (order, column) => sortCaret(order, column),
      events: this.cellEvents,
    },
    {
      dataField: "fields.nf_calories",
      text: "Calories / Serving",
      sort: true,
      sortCaret: (order, column) => sortCaret(order, column),
      events: this.cellEvents,
    },
  ];

  render() {
    for (const i in this.state.ingredients) {
      if (!this.state.ingredients[i].fields.servings) {
        this.state.ingredients[i].fields.servings = 1;
      }
    }
    return (
      <>
        <Page>
          <h5 className="text-center mt-3">Create a Meal</h5>
          <div className="d-flex justify-content-center">
            <div className="create-meal-form">
              {this.renderInput("brand_name", "Brand")}
              {this.renderInput("item_name", "Meal Name")}
              {this.state.ingredients.length !== 0 ? (
                <div className="text-center">
                  <h5 className="pt-3">Ingredients</h5>

                  {this.state.ingredients.map((i) => (
                    <div key={i._id} className="d-flex justify-content-between">
                      <ul className="mt-3 p-2 text-center">
                        {i.fields.item_name}
                      </ul>
                      <IncreaseDecreaseInput
                        className="p-2"
                        inputValue={i.fields.servings}
                        setInputValue={(value) => {
                          let ingredients = this.state.ingredients;
                          let index = ingredients.indexOf(i);

                          ingredients[index].fields.servings = value;
                          this.setState({ ingredients });
                        }}
                      />
                      <i
                        onClick={() => this.removeIngredient(i)}
                        className="p-2 align-self-center fa fa-trash-o delete-icon"
                        aria-hidden="true"
                      />
                    </div>
                  ))}

                  <p className="pt-3">
                    Calories: {this.sumNutrientField("nf_calories")}
                  </p>
                </div>
              ) : null}
              {this.state.ingredients.length > 0 ? (
                <div className="text-center mt-3">
                  <button
                    onClick={this.handleSubmit}
                    disabled={this.validate()}
                    className=" btn btn-primary"
                  >
                    Create Meal
                  </button>
                </div>
              ) : null}
            </div>
          </div>
          <div className="mt-3 d-flex justify-content-center">
            <button
              className="btn btn-secondary btn-sm shadow-sm mr-1"
              onClick={this.handleSearchClicked}
            >
              Search Ingredient
            </button>
            <button
              className="btn btn-secondary btn-sm shadow-sm ml-1"
              onClick={this.handleInputClicked}
            >
              Input Ingredient
            </button>
          </div>
          <ConditionalModal
            show={this.state.show}
            handleClose={this.handleClose}
            condition={this.state.searchClicked}
            headerOne="Search for Your Ingredient"
            headerTwo="Input Your Ingredient"
            ingredientList={this.state.ingredients}
            setProducts={this.setProducts}
            products={this.state.products}
            keyField={this.keyField}
            columns={this.columns}
          />
        </Page>
      </>
    );
  }
}

export default AddMeal;
