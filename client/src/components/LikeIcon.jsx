import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";

function LikeIcon(props) {
  if (props.liked) {
    return (
      <FontAwesomeIcon
        icon={faHeart}
        className={
          props.FontAwesomeIconclassName
            ? "text-primary meal-card-icon " + props.className
            : "text-primary meal-card-icon"
        }
        onClick={props.onClick}
      />
    );
  }
  return (
    <FontAwesomeIcon
      icon={faHeart}
      className={
        props.FontAwesomeIconclassName
          ? "meal-card-icon " + props.className
          : "meal-card-icon"
      }
      onClick={props.onClick}
    />
  );
}

export default LikeIcon;
