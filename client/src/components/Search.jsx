import React from "react";

function Search(props) {
  const handleEnterPressed = (e) => {
    if (e.keyCode === 13) props.onClick();
  };

  return (
    <div className={props.className}>
      <input
        style={props.style}
        type="search"
        id="searchBar"
        className="form-control"
        placeholder={props.placeholder || "Search"}
        onChange={props.onChange}
        onKeyDown={handleEnterPressed}
        value={props.value}
      />
      <button className="btn btn-primary shadow-sm" onClick={props.onClick}>
        <i className="fa fa-search" aria-hidden="true"></i>
      </button>
    </div>
  );
}

export default Search;
