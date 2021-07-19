import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Page from "../components/Page";
import MealsTab from "../components/MealsTab";
import SearchMealsDisplay from "../components/SearchMealsDisplay";
import {
  putUserMeal,
  getUserMeals,
  getLocalUserMeals,
  setLocalUserMeals,
  updateLocalUserMeal,
} from "../services/mealService";

function MyMeals(props) {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function getMeals() {
      const meals = await getUserMeals();
      const { data } = meals;

      setLocalUserMeals(data);
      setProducts(data);
    }
    getMeals();
  }, []);

  const filterByValue = (array, string) => {
    let matchingObjects = [];
    string = string.replace(/\s/g, "").trim().toLowerCase();

    for (const i in array) {
      const arr = Object.values(array[i]);
      const obj = arr[0];

      const itemName = obj.item_name.replace(/\s/g, "").trim().toLowerCase();
      const brandName = obj.brand_name.replace(/\s/g, "").trim().toLowerCase();

      if (itemName.includes(string) || brandName.includes(string)) {
        matchingObjects.push(array[i]);
      }
    }

    return matchingObjects;
  };

  return (
    <>
      <Page>
        <MealsTab className="mt-2 mb-2 center" />

        <div className="text-center mt-3">
          <h5>Create Your Own Meals</h5>
          <Link to="/meals/add">
            <button className="btn btn-primary btn-sm shadow-sm mt-3">
              Create a Meal
            </button>
          </Link>
          {getLocalUserMeals().length > 0 ? (
            <SearchMealsDisplay
              getUserMeals={true}
              products={products}
              setProducts={setProducts}
            />
          ) : (
            <div>
              <p>
                Create items specific to your needs. If we don't have the food{" "}
                <br /> option you're looking for, feel free to create it.
              </p>
            </div>
          )}
          <div></div>
        </div>
      </Page>
    </>
  );
}

export default MyMeals;
