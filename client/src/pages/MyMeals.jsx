import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Page from "../components/Page";
import MealsTab from "../components/MealsTab";
import SearchMealsDisplay from "../components/SearchMealsDisplay";
import {
  getUserMeals,
  getLocalUserMeals,
  setLocalUserMeals,
} from "../services/mealService";

function MyMeals(props) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function getMeals() {
      const meals = await getUserMeals();
      const { data } = meals;
      console.log("meals in MyMeals", data);

      setLocalUserMeals(data);
      setProducts(data);
    }
    getMeals();
  }, []);

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
            <div className="mt-2">
              <p>
                Create items specific to your needs. If we don't have the food{" "}
                <br /> option you're looking for, feel free to create it.
              </p>
            </div>
          )}
        </div>
      </Page>
    </>
  );
}

export default MyMeals;
