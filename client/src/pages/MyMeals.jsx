import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Page from "../components/Page";
import LikeIcon from "../components/LikeIcon";
import MealsTab from "../components/MealsTab";
import { sortCaret } from "./../modules/tableModule";
import {
  putUserMeal,
  getCreatedMeals,
  getLocalUserMeals,
  setLocalUserMeals,
  updateLocalUserMeal,
} from "../services/mealService";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import paginationService from "../services/paginationService";
import { appendLikeButtonToMeals } from "../utils/likifyMeals";

function MyMeals(props) {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  /* useEffect(() => {
    async function getMeals() {
      const meals = await getCreatedMeals();
      const { data } = meals;
      let properData = appendLikeButtonToMeals(data);

      if (getLocalUserMeals().length === 0) {
        setLocalUserMeals(properData);
      }
      console.log("Products in MyMeals", properData);
      setProducts(properData);
    }
    getMeals();
  }, []);

  const handleLike = {
    onClick: async (e, column, columnIndex, row, rowIndex) => {
      const productsBefore = [...products];
      const index = productsBefore.indexOf(row);
      let meal = productsBefore[index];

      meal.fields.liked = !meal.fields.liked;
      meal.fields.likeComponent = <LikeIcon liked={meal.fields.liked} />;

      const serverObj = {
        ingredients: meal.fields.ingredients,
        liked: meal.fields.liked,
        brand_name: meal.fields.brand_name,
        item_name: meal.fields.item_name,
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
        const response = await putUserMeal(serverObj);
        if (response.status === 200) updateLocalUserMeal(response.data);
      } catch (error) {
        setProducts(productsBefore);
      }
    },
  };

  const cellEvents = {
    onClick: (e, column, columnIndex, row, rowIndex) => {
      let meal = row.fields;

      const location = {
        pathname: "/meals/" + meal.item_id,
        meal,
      };

      props.history.push(location);
    },
  };

  const keyField = "fields.item_id";

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
      events: handleLike,
    },
  ];

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

  const handleChange = (e) => {
    setSearchQuery(e.target.value);
    if (e.target.value === "") {
      const arr = getLocalUserMeals();
      return setProducts(arr);
    }

    const results = filterByValue(getLocalUserMeals(), e.target.value);
    return setProducts(results);
  };

  const handleClear = () => {
    handleChange({
      target: {
        value: "",
      },
    });
    setSearchQuery("");
  };

  const mealsCreatedTable = () => (
    <div>
      <div className="d-flex justify-content-center">
        <input
          type="text"
          value={searchQuery}
          onChange={handleChange}
          placeholder="Search by Name or Brand"
        />
        <button className="btn btn-secondary ml-1" onClick={handleClear}>
          Clear
        </button>
      </div>
      <BootstrapTable
        keyField={keyField}
        data={products}
        columns={columns}
        pagination={paginationFactory(paginationService.paginationOptions)}
        bordered={false}
        rowClasses="row-classes"
        noDataIndication="Table is empty"
      />
    </div>
  );

  const noCreatedMeals = () => {
    return (
      <div>
        <p>
          Create items specific to your needs. If we don't have the food <br />{" "}
          option you're looking for, feel free to create it.
        </p>
      </div>
    );
  };*/

  return (
    <>
      MyMealsPage
      {/* <Page>
        <MealsTab className="mt-2 mb-2 center" />
        <div className="text-center mt-3">
          <h5>Create Your Own Meals</h5>
          {getLocalUserMeals().length > 0
            ? mealsCreatedTable()
            : noCreatedMeals()}
          <div>
            <Link to="/meals/add">
              <button className="btn btn-primary">Create a Meal</button>
            </Link>
          </div>
        </div>
      </Page> */}
    </>
  );
}

export default MyMeals;
