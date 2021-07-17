import React, { useState } from "react";
import Page from "../components/Page";
import MealsTab from "../components/MealsTab";
import SearchMealsDisplay from "../components/SearchMealsDisplay";

function Meals(props) {
  const [products, setProducts] = useState([]);

  return (
    <Page>
      <MealsTab className="mt-2 mb-2 center" />
      <SearchMealsDisplay setProducts={setProducts} products={products} />
    </Page>
  );
}

export default Meals;
