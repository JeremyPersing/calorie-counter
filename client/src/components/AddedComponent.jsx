import React from "react";
import { ReactComponent as NotAddedCheckMark } from "../assets/black_white_check.svg";
import { ReactComponent as AddedCheckMark } from "../assets/check.svg";

function AddedIcon(props) {
  if (props.added) return <AddedCheckMark height="25px" width="25px" />;
  return <NotAddedCheckMark height="25px" width="25px" />;
}

export default AddedIcon;
