import React from "react";
import Modal from "react-bootstrap/Modal";

function DeleteMealModal(props) {
  const { show, currMeal, handleClose, handleDelete } = props;
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header>
        <Modal.Title>Are you sure?</Modal.Title>
        <i
          className="fa fa-times exit"
          aria-hidden="true"
          onClick={handleClose}
        ></i>
      </Modal.Header>
      <Modal.Body>
        {currMeal.created_meal
          ? "Are you sure you want to permanently delete your created meal?"
          : "Are you sure you want to delete this item from your meals?"}
      </Modal.Body>
      <Modal.Footer>
        <button
          className="btn btn-danger btn-sm shadow-sm"
          onClick={handleDelete}
        >
          Delete
        </button>
        <button
          className="btn btn-secondary btn-sm shadow-sm"
          onClick={handleClose}
        >
          Cancel
        </button>
      </Modal.Footer>
    </Modal>
  );
}

export default DeleteMealModal;
