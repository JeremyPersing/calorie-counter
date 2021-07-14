import React, { useState, useEffect } from "react";
import Page from "../components/Page";
import MealsTab from "../components/MealsTab";
import {
  getLikedMeals,
  putUserMeal,
  updateLocalUserMeal,
} from "../services/mealService";
import MealsTable from "./../components/MealsTable";
import LikeIcon from "../components/LikeIcon";
import { sortCaret } from "./../modules/tableModule";

function LikedMeals(props) {
  const [likedMeals, setLikedMeals] = useState([]);

  useEffect(() => {
    async function likify() {
      const { data: likedMeals } = await getLikedMeals();

      likedMeals.forEach((item) => {
        item.fields.likeComponent = (
          <LikeIcon key={item._id} liked={item.fields.liked} />
        );
      });

      setLikedMeals(likedMeals);
    }

    likify();
  }, []);

  const handleDislike = {
    onClick: async (e, column, columnIndex, row, rowIndex) => {
      const productsBefore = [...likedMeals];
      const index = productsBefore.findIndex((m) => m._id === row._id);

      let meal = productsBefore[index];

      meal.fields.liked = !meal.fields.liked;

      let arr = [...productsBefore];
      arr.splice(index, 1);

      setLikedMeals(arr);

      meal = {
        ingredients: meal.fields.ingredients,
        liked: meal.fields.liked,
        brand_name: meal.fields.brand_name,
        item_name: meal.fields.item_name,
        nf_calories: meal.fields.nf_calories,
        nf_protein: meal.fields.nf_protein,
        nf_total_carbohydrate: meal.fields.nf_total_carbohydrate,
        nf_total_fat: meal.fields.nf_total_fat,
        servings: meal.fields.servings,
        _id: meal._id,
      };

      try {
        const response = await putUserMeal(meal);
        if (response.status === 200) updateLocalUserMeal(response.data);
      } catch (error) {
        console.log(error.response);
        setLikedMeals(productsBefore);
      }
    },
  };

  const cellEvents = {
    onClick: (e, column, columnIndex, row, rowIndex) => {
      let meal = row.fields;

      const location = {
        pathname: "/meals/" + row._id,
        meal,
      };

      props.history.push(location);
    },
  };

  const keyField = "item_id";
  const columns = [
    {
      dataField: "fields.item_name",
      text: "Name",
      sort: true,
      sortCaret: (order, column) => sortCaret(order, column),
      events: cellEvents,
    },
    {
      dataField: "fields.brand_name",
      text: "Brand",
      sort: true,
      sortCaret: (order, column) => sortCaret(order, column),
      events: cellEvents,
    },
    {
      dataField: "fields.nf_calories",
      text: "Cal / Serving",
      sort: true,
      sortCaret: (order, column) => sortCaret(order, column),
      events: cellEvents,
    },
    {
      dataField: "fields.likeComponent",
      text: "",
      events: handleDislike,
    },
  ];

  return (
    <>
      <Page>
        <MealsTab className="mt-2 mb-2 center" />

        <div>
          {likedMeals.length === 0 ? (
            <div className="mt-3 text-center">
              <h5>You have no liked meals</h5>
              <button
                className="btn btn-primary mt-3"
                onClick={() => props.history.push("/meals/search")}
              >
                Find Meals
              </button>
            </div>
          ) : (
            <MealsTable
              keyField={keyField}
              columns={columns}
              data={likedMeals}
            />
          )}
        </div>
      </Page>
    </>
  );
}

export default LikedMeals;
