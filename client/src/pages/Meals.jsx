import React, { useState } from "react";
import Page from "../components/Page";
import MealsTab from "../components/MealsTab";
import { sortCaret } from "../modules/tableModule";
import SearchMealsTable from "../components/SearchMealsDisplay";
import LikeIcon from "../components/LikeIcon";
import {
  postSearchedMeal,
  putCreatedMeal,
  updateLocalUserMeal,
  pushLocalUserMeal,
  deleteCreatedMeal,
  deleteLocalUserMealById,
  getLocalUserMeals,
} from "../services/mealService";
import AddedIcon from "../components/AddedComponent";
import MealCard from "../components/MealCard";

function Meals(props) {
  const [products, setProducts] = useState([]);

  const updateMeal = async (mealObj) => {
    delete mealObj.item_id;
    const response = await putCreatedMeal(mealObj);
    if (response.status === 200) updateLocalUserMeal(response.data);
  };

  const handleLike = {
    onClick: async (e, column, columnIndex, row, rowIndex) => {
      const productsBefore = [...products];
      const index = productsBefore.indexOf(row);
      const meal = productsBefore[index];

      meal.fields.liked = !meal.fields.liked;
      if (meal.fields.liked && !meal.fields.added) {
        meal.fields.added = true;
        meal.fields.addedComponent = <AddedIcon added={meal.fields.added} />;
      }
      meal.fields.likeComponent = <LikeIcon liked={meal.fields.liked} />;

      let serverObj = {
        brand_name: meal.fields.brand_name,
        item_name: meal.fields.item_name,
        item_id: meal.fields.item_id,
        ingredients: meal.fields.ingredients,
        liked: meal.fields.liked,
        nf_calories: meal.fields.nf_calories,
        nf_protein: meal.fields.nf_protein,
        nf_total_carbohydrate: meal.fields.nf_total_carbohydrate,
        nf_total_fat: meal.fields.nf_total_fat,
        _id: meal._id,
      };

      const updatedProducts = [...productsBefore];
      updatedProducts[index] = meal;
      setProducts(updatedProducts);

      try {
        // Only push to the server if the meal doesn't exist on the db yet
        // Otherwise just update, it does allow for the insertion of 2 objects
        // with the same id, so this is why the findIndex() is present
        const userMeals = getLocalUserMeals();
        const index = userMeals.findIndex((m) => m._id === meal._id);
        if (index === -1) {
          const response = await postSearchedMeal(serverObj);
          console.log(response);
          if (response.status === 200) pushLocalUserMeal(response.data);
        } else {
          await updateMeal(serverObj);
        }
      } catch (error) {
        if (error.response.status === 500) {
          await updateMeal(serverObj);
        }
        setProducts(productsBefore);
      }
    },
  };

  const handleAdd = {
    onClick: async (e, column, columnIndex, row, rowIndex) => {
      const productsBefore = [...products];
      const index = productsBefore.indexOf(row);
      const meal = productsBefore[index];
      console.log(meal);

      meal.fields.added = !meal.fields.added;
      if (!meal.fields.added) {
        meal.fields.liked = false;
        meal.fields.likeComponent = <LikeIcon liked={meal.fields.liked} />;
      }
      meal.fields.addedComponent = <AddedIcon added={meal.fields.added} />;

      let serverObj = {
        brand_name: meal.fields.brand_name,
        item_name: meal.fields.item_name,
        item_id: meal.fields.item_id,
        ingredients: meal.fields.ingredients,
        liked: meal.fields.liked,
        nf_calories: meal.fields.nf_calories,
        nf_protein: meal.fields.nf_protein,
        nf_total_carbohydrate: meal.fields.nf_total_carbohydrate,
        nf_total_fat: meal.fields.nf_total_fat,
        _id: meal._id,
      };

      const updatedProducts = [...productsBefore];
      updatedProducts[index] = meal;
      setProducts(updatedProducts);

      try {
        if (meal.fields.added === true) {
          const response = await postSearchedMeal(serverObj);
          console.log(response);
          if (response.status === 200) pushLocalUserMeal(response.data);
        } else {
          const response = await deleteCreatedMeal(serverObj);
          if (response.status === 200) deleteLocalUserMealById(meal._id);
        }
      } catch (error) {
        setProducts(productsBefore);
      }
    },
  };

  const cellEvents = {
    onClick: (e, column, columnIndex, row, rowIndex) => {
      

      // const location = {
      //   pathname: "/meals/" + meal.item_id,
      //   meal,
      // };

      // props.history.push(location);
    },
  };

  return (
    <Page>
      <MealsTab className="mt-2 mb-2 center" />
      <SearchMealsTable setProducts={setProducts} products={products} />
    </Page>
  );
}

export default Meals;
