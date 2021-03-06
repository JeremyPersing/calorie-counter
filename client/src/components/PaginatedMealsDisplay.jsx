import React, { useState } from "react";
import MealCard from "./MealCard";
import Pagination from "./Pagination";

function PaginatedMealsDisplay(props) {
  const [currProducts, setCurrProducts] = useState([]);
  const [currPage, setCurrPage] = useState(1);
  const [totalPages, setTotalPages] = useState();
  const {
    products,
    setProducts,
    pageLimit,
    pageNeighbors,
    onMealClick,
    addMealSearch,
    searchMeals,
    likedMeals,
    getUserMeals,
  } = props;

  const onPageChanged = (data) => {
    const { currentPage, totalPages, pageLimit } = data;

    const offset = (currentPage - 1) * pageLimit;

    const currentProducts = products.slice(offset, offset + pageLimit);

    setCurrProducts(currentProducts);
    setCurrPage(currentPage);
    setTotalPages(totalPages);
  };

  const headerClass = [
    "text-dark py-2 pr-4 m-0",
    currPage ? "border-gray border-right" : "",
  ]
    .join(" ")
    .trim();

  return (
    <div>
      <div className="row d-flex flex-row">
        <div className="w-100 px-4 py-2 mb-3 d-flex flex-row flex-wrap align-items-center justify-content-between">
          <div className="d-flex flex-row align-items-center">
            {products && (
              <h2 className={headerClass}>
                <strong className="text-secondary">{products.length}</strong>{" "}
                Meals
              </h2>
            )}
            {currPage ? (
              <span className="current-page d-inline-block h-100 pl-4 text-secondary">
                Page <span className="font-weight-bold">{currPage}</span> /{" "}
                <span className="font-weight-bold">{totalPages}</span>
              </span>
            ) : null}
          </div>
        </div>
        {currProducts.map((item, index) => (
          <MealCard
            key={index}
            likedMeals={likedMeals}
            searchMeals={searchMeals}
            getUserMeals={getUserMeals}
            onMealClick={onMealClick}
            addMealSearch={addMealSearch}
            meal={item}
            products={products}
            setProducts={setProducts}
          />
        ))}
      </div>
      <div className="d-flex flex-row py-3 align-items-center justify-content-center">
        <Pagination
          totalRecords={products}
          pageLimit={pageLimit}
          pageNeighbors={pageNeighbors}
          onPageChanged={onPageChanged}
        />
      </div>
    </div>
  );
}

export default PaginatedMealsDisplay;
