import React from "react";

function Heading(props) {
  return (
    <h1 className={"h3 mb-0 text-gray-800 " + props.className}>{props.text}</h1>
  );
}

export default Heading;
