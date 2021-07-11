import React from "react";
import "../styles/Sidebar.css";

function Sidebar(props) {
  const handleClick = (meal) => {
    props.handleToggler();
    localStorage.setItem("sidebar-collapsed", true);

    const location = {
      pathname: "/meals/" + meal.item_id,
      meal,
    };

    props.history.push(location);
  };

  return (
    <div className={props.open ? "sidebar" : "sidebar-collapsed"}>
      <div className="exit-icon-container">
        <i className="fa fa-times exit-icon" onClick={props.handleToggler}></i>
      </div>
      <div className="sidebar-header">
        <h4>Meals Consumed</h4>
      </div>
      <div className="sidebar-items">
        {props.items.map((item) => (
          <div
            key={item.item_id}
            className="item"
            onClick={() => {
              handleClick(item);
            }}
          >
            <span className="sidebar-text">
              {item.brand_name ? item.brand_name + " " : null}
              {item.item_name} ({item.servings})
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
