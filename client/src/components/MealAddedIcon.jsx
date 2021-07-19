import React from "react";
import AddIcon from "./AddIcon";
import DeleteIcon from "./DeleteIcon";

function MealAddedIcon(props) {
  if (props.added)
    return (
      <DeleteIcon
        className={props.className + " meal-card-icon"}
        onClick={props.onClick}
      />
    );

  return (
    <AddIcon
      className={props.className + " meal-card-icon"}
      onClick={props.onClick}
    />
  );
}

export default MealAddedIcon;
