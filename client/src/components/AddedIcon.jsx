import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";

function AddedIcon(props) {
  if (props.added)
    return (
      <FontAwesomeIcon
        className={
          props.className
            ? "meal-card-icon delete-icon " + props.className
            : "meal-card-icon delete-icon"
        }
        icon={faTimes}
        onClick={props.onClick}
      />
    );
  return (
    <FontAwesomeIcon
      icon={faPlus}
      className={
        props.className
          ? "meal-card-icon add-icon " + props.className
          : "meal-card-icon add-icon"
      }
      onClick={props.onClick}
    />
  );
}

export default AddedIcon;
