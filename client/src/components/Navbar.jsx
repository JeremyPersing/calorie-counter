import React, { useEffect } from "react";
import SkinnyLogo from "./SkinnyLogo";
import { NavLink, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUtensils,
  faTachometerAlt,
  faHome,
} from "@fortawesome/free-solid-svg-icons";

function Navbar({ toggled, setToggled, toggleSideBar, getTextClasses }) {
  useEffect(() => {
    let itemToggled = JSON.parse(localStorage.getItem("toggled"));
    if (itemToggled !== null && itemToggled !== undefined) {
      setToggled(itemToggled);
    }
  }, []);

  const getLiClassName = (linksURL) => {
    if (window.location.pathname === linksURL) return "nav-item active";
    return "nav-item";
  };

  return (
    <div>
      {/* Sidebar */}
      <ul
        className={
          !toggled
            ? "navbar-nav bg-gradient-dark sidebar sidebar-dark accordion h-100"
            : "navbar-nav bg-gradient-dark sidebar toggled sidebar-dark accordion h-100"
        }
        id="accordionSidebar"
      >
        <Link
          className="sidebar-brand d-flex align-items-center justify-content-center"
          to="/"
        >
          <div>
            <div className="sidebar-brand-icon">
              <SkinnyLogo width="40px" className="filter-white" />
            </div>
            <div className="sidebar-brand-text">
              <small>CalorieBalance</small>
            </div>
          </div>
        </Link>
        <hr className="sidebar-divider my-0" />

        <li className={getLiClassName("/")}>
          <NavLink className="nav-link" exact={true} to="/">
            <FontAwesomeIcon icon={faHome} />
            <span className={getTextClasses()}>Home</span>
          </NavLink>
        </li>

        <li
          className={
            window.location.pathname.includes("/meals")
              ? "nav-item active"
              : "nav-item"
          }
        >
          <NavLink className="nav-link" exact={true} to="/meals/search">
            <FontAwesomeIcon icon={faUtensils} />
            <span className={getTextClasses()}>Meals</span>
          </NavLink>
        </li>

        <li className={getLiClassName("/myaccount")}>
          <NavLink className="nav-link" exact={true} to="/myaccount">
            <FontAwesomeIcon icon={faTachometerAlt} />
            <span className={getTextClasses()}>Dashboard</span>
          </NavLink>
        </li>
        <hr className="sidebar-divider my-0" />

        <div className="text-center d-none d-md-inline">
          <button
            className="rounded-circle border-0 toggle-button mt-4"
            id="sidebarToggle"
            onClick={toggleSideBar}
          ></button>
        </div>
      </ul>
    </div>
  );
}

export default Navbar;
