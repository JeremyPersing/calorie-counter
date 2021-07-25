import React, { useState, useEffect } from "react";
import Page from "../components/Page";
import MealsTab from "../components/MealsTab";
import { getLikedMeals } from "../services/mealService";
import SearchMealsDisplay from "../components/SearchMealsDisplay";

function LikedMeals() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function likify() {
      const { data } = await getLikedMeals();
      console.log("Liked Meals: ", data);

      setProducts(data);
    }

    likify();
  }, []);

  return (
    <>
      <Page>
        <MealsTab className="mt-2 mb-2 center" />
        <SearchMealsDisplay
          products={products}
          setProducts={setProducts}
          likedMeals={true}
        />
      </Page>
    </>
  );
}

export default LikedMeals;
