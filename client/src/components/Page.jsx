import React, { useState } from "react";
import Navbar from "./Navbar";
import HiddenNavbar from "./HiddenNavbar";
import auth from "../services/authService";

function Page(props) {
  const [toggled, setToggled] = useState(false);

  const toggleSideBar = () => {
    const currentToggle = toggled;
    setToggled(!currentToggle);
    localStorage.setItem("toggled", !currentToggle);
    getTextClasses();
  };

  const getTextClasses = () => {
    if (toggled) {
      return "";
    }
    return "nav-sidemenu-text";
  };

  return (
    <div id="wrapper">
      {
        auth.getCurrentUser() &&
      <Navbar
        toggled={toggled}
        setToggled={setToggled}
        getTextClasses={getTextClasses}
        toggleSideBar={toggleSideBar}
      />
      }
      <div id="content-wrapper" className="d-flex flex-column">
        <div id="content">
          <HiddenNavbar toggled={toggled} toggleSideBar={toggleSideBar} />
          <div className="container-fluid container">{props.children}</div>
        </div>
        <footer>
          <p className="text-center small text-secondary">
            Powered by{" "}
            <a
              href="https://www.nutritionix.com/business/api"
              className="text-decoration-none"
            >
              Nutritionix API
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}

export default Page;
