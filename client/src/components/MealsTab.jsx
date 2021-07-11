import React from "react";
import { NavLink } from "react-router-dom";
import ListGroup from "react-bootstrap/ListGroup";
import LikeIcon from "./LikeIcon";

function MealsTab(props) {
  return (
    <ListGroup horizontal {...props}>
      <ListGroup.Item>
        <NavLink
          to="/meals/search"
          className="list-group-link"
          activeClassName="list-group-link-active"
        >
          Search
        </NavLink>
      </ListGroup.Item>
      <ListGroup.Item>
        <NavLink
          to="/meals/mine"
          className="list-group-link"
          activeClassName="list-group-link-active"
        >
          Your Meals
        </NavLink>
      </ListGroup.Item>
      <ListGroup.Item>
        <NavLink
          to="/meals/liked"
          className="list-group-link"
          activeClassName="liked-active"
        >
          <LikeIcon
            liked={window.location.pathname === "/meals/liked" ? true : false}
          />
        </NavLink>
      </ListGroup.Item>
    </ListGroup>
  );
}

export default MealsTab;
