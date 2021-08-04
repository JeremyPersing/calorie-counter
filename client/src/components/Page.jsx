import React, { useState } from "react";
import Navbar from "./Navbar";
import HiddenNavbar from "./HiddenNavbar";
import auth from "../services/authService";
import Modal from "react-bootstrap/Modal";
import { useHistory } from "react-router-dom";

function Page(props) {
  let history = useHistory();
  const [toggled, setToggled] = useState(false);
  const [show, setShow] = useState(false);

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

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);
  const logout = () => {
    history.push("/hero");
    localStorage.clear();
  };
  return (
    <div>
      <div id="wrapper">
        {auth.getCurrentUser() && (
          <Navbar
            toggled={toggled}
            setToggled={setToggled}
            getTextClasses={getTextClasses}
            toggleSideBar={toggleSideBar}
            handleShow={handleShow}
          />
        )}
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
              </a>{" "}
              and{" "}
              <a href="https://pixabay.com/" className="text-decoration-none">
                Pixabay
              </a>
            </p>
          </footer>
        </div>
      </div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title>Are you sure?</Modal.Title>
          <i
            className="fa fa-times exit"
            aria-hidden="true"
            onClick={handleClose}
          ></i>
        </Modal.Header>
        <Modal.Body>Are you sure you want to logout?</Modal.Body>
        <Modal.Footer>
          <button className="btn btn-danger" onClick={logout}>
            Logout
          </button>
          <button className="btn btn-secondary" onClick={handleClose}>
            Cancel
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Page;
