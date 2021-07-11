import React from "react";

function HiddenNavbar({ toggleSideBar }) {
  return (
    <div>
      <nav className="navbar navbar-expand navbar-light topbar mb-4 navbar-hidden">
        <button
          onClick={toggleSideBar}
          className="btn btn-link d-md-none rounded-circle"
        >
          <i className="fa fa-bars"></i>
        </button>
      </nav>
    </div>
  );
}

export default HiddenNavbar;
