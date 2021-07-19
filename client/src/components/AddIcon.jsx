import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

import React from "react";

function AddIcon(props) {
  return (
    <FontAwesomeIcon
      icon={faPlus}
      className={
        props.className
          ? "add-icon " + props.className
          : "add-icon"
      }
      onClick={props.onClick}
    />
  );
}

export default AddIcon;
