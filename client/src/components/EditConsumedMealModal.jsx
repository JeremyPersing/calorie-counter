import React from "react";
import ReadOnlyInput from "./ReadOnlyInput";
import Modal from "react-bootstrap/Modal";

function EditConsumedMealModal(props) {
  const { show, handleClose, handleAdd, consumedMeal, servings, onChange } =
    props;

  const roundTwoDecimalPlaces = (value) => {
    if (value) return value.toFixed(2);
    return value;
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header>
        <Modal.Title>Enter the Number of Servings You Had</Modal.Title>
        <i
          className="fa fa-times exit"
          aria-hidden="true"
          onClick={handleClose}
        ></i>
      </Modal.Header>
      <Modal.Body className="d-flex justify-content-center">
        <div className="form-user">
          <small className="ml-3">
            <strong>Total Calories</strong>
          </small>
          <ReadOnlyInput
            value={roundTwoDecimalPlaces(consumedMeal.nf_calories)}
          />
          <small className="ml-3">
            <strong>Total Protein (g)</strong>
          </small>
          <ReadOnlyInput
            value={roundTwoDecimalPlaces(consumedMeal.nf_protein)}
          />
          <small className="ml-3">
            <strong>Total Carbohydrates (g)</strong>
          </small>
          <ReadOnlyInput
            value={roundTwoDecimalPlaces(consumedMeal.nf_total_carbohydrate)}
          />
          <small className="ml-3">
            <strong>Total Fat (g)</strong>
          </small>
          <ReadOnlyInput
            value={roundTwoDecimalPlaces(consumedMeal.nf_total_fat)}
          />
          <small className="ml-3">
            <strong>Servings</strong>
          </small>
          <input
            className="form-control form-control-user"
            type="number"
            plaveholder="Servings"
            value={servings}
            min="0"
            onChange={onChange}
          />
        </div>
      </Modal.Body>

      <Modal.Footer>
        <button
          disabled={Number(servings) === 0 ? true : false}
          className="btn btn-primary"
          onClick={handleAdd}
        >
          {props.edit ? "Edit" : "Add"}
        </button>
        <button className="btn btn-secondary" onClick={handleClose}>
          Close
        </button>
      </Modal.Footer>
    </Modal>
  );
}

export default EditConsumedMealModal;
