import React, { useState, useEffect } from "react";
import Page from "../components/Page";
import MealsTab from "../components/MealsTab";
import SearchMealsDisplay from "../components/SearchMealsDisplay";

function Meals(props) {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    const meals = JSON.parse(localStorage.getItem("searchedMeals"));
    if (!meals) return;
    setProducts(meals);

    console.log("products in Meals", meals);
  }, []);

  return (
    <Page>
      <MealsTab className="mt-2 mb-2 center" />
      <SearchMealsDisplay
        search={true}
        setProducts={setProducts}
        products={products}
      />
    </Page>
  );
}

export default Meals;
