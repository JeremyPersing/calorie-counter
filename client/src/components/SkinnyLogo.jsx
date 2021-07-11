import React from "react";
import SmallLogo from "../assets/skinny-logo.svg";

function SkinnyLogo(props) {
  return <img src={SmallLogo} alt="Lagom" {...props} />;
}

export default SkinnyLogo;
