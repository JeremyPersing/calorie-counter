import React from "react";
import BrandLogo from "../assets/logo.svg";

function Logo(props) {
  return <img src={BrandLogo} alt="Lagom Logo" {...props} />;
}

export default Logo;
