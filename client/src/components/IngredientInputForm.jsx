import React from "react";
import Joi from "joi-browser";
import Form from "./Form";
import Search from "./Search";
import { postUserMeal, pushLocalUserMeal } from "../services/mealService";
import { getImagesByQuery } from "../services/pixabayService";
import Modal from "react-bootstrap/Modal";
import Masonry from "react-masonry-css";

class IngredientInputForm extends Form {
  // props for this class are meal, ingredientList, handleClose

  // Ingredient schema for sub_recipe arr
  //   calories: 17.88
  // food: "garlic"
  // ndb_number: 11215
  // recipe_id: 1000143
  // serving_qty: 4
  // serving_unit: "cloves"
  // serving_weight: 12

  // userMeal schema for post
  // food_name: temporaryMeal.food_name,
  // brand_name: temporaryMeal.brand_name,
  // serving_qty:
  //         temporaryMeal.serving_qty === null ? 1 : temporaryMeal.serving_qty,
  // serving_unit:
  //         temporaryMeal.serving_unit === null
  //           ? "meal"
  //           : temporaryMeal.serving_unit,
  // serving_weight_grams: temporaryMeal.serving_weight_grams,
  // nf_calories: temporaryMeal.nf_calories,
  // nf_protein: temporaryMeal.nf_protein,
  // nf_total_carbohydrate: temporaryMeal.nf_total_carbohydrate,
  // nf_total_fat: temporaryMeal.nf_total_fat,
  // nix_item_id: temporaryMeal.nix_item_id,
  // thumb: temporaryMeal.photo.thumb,
  // sub_recipe: temporaryMeal.sub_recipe ? temporaryMeal.sub_recipe : [],
  // liked: true,
  // created_meal: false,
  // user_meal: true,

  state = {
    data: {
      food_name: "",
      brand_name: "",
      serving_qty: "",
      serving_unit: "",
      serving_weight: "",
      nf_calories: "",
      nf_protein: "",
      nf_total_carbohydrate: "",
      nf_total_fat: "",
      thumb: null,
      servings: "",
    },
    errors: {},
    thumb: null,
    show: false,
    searchQuery: "",
    images: null,
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

  handleShow = () => this.setState({ show: true });
  handleClose = () => this.setState({ show: false });

  handleSearchChange = (e) => {
    e.preventDefault();
    this.setState({ searchQuery: e.target.value });
  };

  handleSearchClick = async () => {
    const res = await getImagesByQuery(this.state.searchQuery);
    const arr = res.data.hits;
    console.log(arr);

    this.setState({ images: arr });
  };

  handleImageClicked = (imgUrl) => {
    this.setState({ thumb: imgUrl });
    console.log(imgUrl);
  };

  breakpointColumnsObj = {
    default: 4,
    991: 3,
    515: 2,
    400: 1,
  };

  render() {
    return (
      <div>
        <div className="form-user" onSubmit={this.handleSubmit}>
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
          <button
            className="btn btn-secondary btn-user btn-block"
            onClick={this.handleShow}
          >
            Search Image
          </button>

          <button
            onClick={() => this.doSubmit()}
            disabled={this.validate()}
            className="btn btn-primary btn-user btn-block"
            type="submit"
          >
            Add Meal
          </button>
        </div>
        <Modal
          show={this.state.show}
          onHide={this.handleClose}
          backdrop="static"
          size="lg"
        >
          <Modal.Header>
            <Modal.Title>Search Image</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Search
              className="col-10 offset-1 d-flex mt-4 mb-4"
              onChange={this.handleSearchChange}
              onClick={this.handleSearchClick}
              value={this.state.searchQuery}
              placeholder="Search Food Images..."
            />
            <Masonry
              breakpointCols={this.breakpointColumnsObj}
              className="my-masonry-grid"
              columnClassName="my-masonry-grid_column"
            >
              {this.state.images &&
                this.state.images.map((i) => (
                  <div key={i.id}>
                    <img
                      src={i.previewURL}
                      alt={i.tags[0]}
                      className="ingredient-img"
                      onClick={() => this.handleImageClicked(i.previewURL)}
                    />
                  </div>
                ))}
            </Masonry>
          </Modal.Body>
          <Modal.Footer>
            <button className="btn btn-secondary" onClick={this.handleClose}>
              Close
            </button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default IngredientInputForm;
