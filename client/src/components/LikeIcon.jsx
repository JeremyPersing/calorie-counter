import React from "react";
import { ReactComponent as LikedMeal } from "../assets/full_heart.svg";
import { ReactComponent as NotLikedMeal } from "../assets/empty_heart.svg";

function LikeIcon({ liked }) {
  if (liked) {
    return <LikedMeal height="25px" width="25px" />;
  }
  return <NotLikedMeal height="25px" width="25px" />;
}

export default LikeIcon;
