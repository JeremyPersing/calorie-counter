import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Page from "../components/Page";
import MealsTab from "../components/MealsTab";
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

function MyMeals(props) {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function getMeals() {
      const meals = await getCreatedMeals();
      const { data } = meals;

      if (getLocalUserMeals().length === 0) {
        setLocalUserMeals(data);
      }
      console.log("Products in MyMeals", data);
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
      Hello
      {/* <div className="d-flex justify-content-center">
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
      /> */}
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
  };

  return (
    <>
      <Page>
        <MealsTab className="mt-2 mb-2 center" />
        <div className="text-center mt-3">
          <h5>Create Your Own Meals</h5>
          {getLocalUserMeals().length > 0
            ? mealsCreatedTable()
            : noCreatedMeals()}
          <div>
            <Link to="/meals/add">
              <button className="btn btn-primary btn-sm shadow-sm">
                Create a Meal
              </button>
            </Link>
          </div>
        </div>
      </Page>
    </>
  );
}

export default MyMeals;
