import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

function DeleteIcon(props) {
  return (
    <FontAwesomeIcon
      className={
        props.className
          ? "delete-icon " + props.className
          : "delete-icon"
      }
      icon={faTimes}
      onClick={props.onClick}
    />
  );
}

export default DeleteIcon;
