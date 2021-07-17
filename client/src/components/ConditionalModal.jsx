import React from "react";
import Modal from "react-bootstrap/Modal";
import SearchMealsDisplay from "./SearchMealsDisplay";
import IngredientInputForm from "./IngredientInputForm";

function ConditionalModal(props) {
  const {
    show,
    handleClose,
    condition,
    headerOne,
    headerTwo,
    ingredientList,
    setProducts,
    products,
    onMealClick,
  } = props;

  return (
    <div>
      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header>
          <Modal.Title>{condition ? headerOne : headerTwo}</Modal.Title>
          <i
            className="fa fa-times exit"
            aria-hidden="true"
            onClick={handleClose}
          ></i>
        </Modal.Header>
        <Modal.Body>
          {condition && show ? (
            <SearchMealsDisplay
              setProducts={setProducts}
              products={products}
              pageLimit={6}
              addMealSearch={true}
              onClick={onMealClick}
            />
          ) : (
            <IngredientInputForm
              handleClose={handleClose}
              ingredientList={ingredientList}
            />
          )}
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-secondary" onClick={handleClose}>
            Close
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ConditionalModal;
