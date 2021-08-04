import React, { useState, useEffect } from "react";
import {
  postUserStats,
  putNewDiet,
  putUserStatsAndDiet,
} from "../services/userStatsService";
import Modal from "react-bootstrap/Modal";
import "../styles/App.css";
import { toast } from "react-toastify";

function ChooseDiet(props) {
  const [show, setShow] = useState(false);
  const [updateDiet, setUpdateDiet] = useState(false);
  let nextPageEndpoint = props.location.state.updateDiet ? "/myaccount" : "/";

  useEffect(() => {
    console.log("props", props);
    if (props.location.state.updateDiet) {
      console.log("Setting update diet to true");
      setUpdateDiet(true);
    }
  }, []);

  const maintenanceCalories = props.location.state.maintenanceCalories;
  const cuttingCalories = maintenanceCalories - 500;
  const bulkingCalories = maintenanceCalories + 500;

  const handleMaintain = () => {
    handleShow();
    handleSubmit("Maintaining", maintenanceCalories);
  };

  const handleCut = () => {
    handleShow();
    handleSubmit("Cutting", cuttingCalories);
  };

  const handleBulk = () => {
    handleShow();
    handleSubmit("Bulking", bulkingCalories);
  };

  const handleSubmit = async (plan, calories) => {
    let userStats = props.location.state;
    console.log(props.location.state.units);
    userStats.dietPlan = plan;
    userStats.currentCalories = calories;

    if (updateDiet) {
      console.log("UPDATING DIET");
      try {
        await putNewDiet(userStats);
      } catch (error) {
        toast.error("An error occurred updating your diet plan");
        console.log(error.response);
      }
    } else {
      try {
        await postUserStats(userStats);
      } catch (error) {
        if (error.response.status === 500) {
          // User already selected a plan went bakc and then selected a new plan
          await putUserStatsAndDiet(userStats);
        }
        console.log(error.response);
      }
    }
  };

  const toNextPage = () => {
    props.history.push({
      pathname: nextPageEndpoint,
    });
  };

  const createSideCard = (
    heading,
    calorieAmount,
    buttonLabel,
    list,
    onClick
  ) => {
    return (
      <div className="col">
        <div className="card mb-4 rounded-3 shadow-sm">
          <div className="card-header py-3">
            <h5 className="my-0 fw-normal">{heading}</h5>
          </div>
          <div className="card-body">
            <h1 className="card-title pricing-card-title">
              {calorieAmount}
              <small className="text-muted fw-light"> cal/day</small>
            </h1>
            <ul className="list-unstyled mt-3 mb-4">
              {list.map((item) => (
                <li key={item.id}>{item.phrase}</li>
              ))}
            </ul>
            <button
              type="button"
              className="w-100 btn-non-main btn-outline-primary"
              onClick={onClick}
            >
              {buttonLabel}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const createMainCard = (
    heading,
    calorieAmount,
    buttonLabel,
    list,
    onClick
  ) => {
    return (
      <div className="col">
        <div className="card mb-4 rounded-3 shadow-sm border-primary">
          <div className="card-header text-white py-3 bg-primary border-primary">
            <h5 className="my-0 fw-normal">{heading}</h5>
          </div>
          <div className="card-body">
            <h1 className="card-title pricing-card-title">
              {calorieAmount}
              <small className="text-muted fw-light"> cal/day</small>
            </h1>
            <ul className="list-unstyled mt-3 mb-4">
              {list.map((item) => (
                <li key={item.id}>{item.phrase}</li>
              ))}
            </ul>
            <button
              type="button"
              className="w-100 btn-primary btn-nav"
              onClick={onClick}
            >
              {buttonLabel}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const handleShow = () => setShow(true);
  const handleClose = () => {
    setShow(false);
    toNextPage();
  };

  const maintenanceList = [
    { id: 0, phrase: "Like your current weight?" },
    { id: 1, phrase: "Burn fat and gain muscle" },
    { id: 2, phrase: "Stay lean" },
  ];

  const cuttingList = [
    { id: 0, phrase: "Want to lose fat?" },
    { id: 1, phrase: "Get lean in 12 weeks" },
    { id: 2, phrase: "Feel healthier" },
  ];

  const bulkingList = [
    { id: 0, phrase: "Want to gain muscle?" },
    { id: 1, phrase: "Get bigger and stronger" },
    { id: 2, phrase: "Eat more" },
  ];

  return (
    <div className="full-center">
      <div className="container">
        <h1 className="h4 text-center text-gray-900 mb-4">Choose a Plan</h1>
        <div className="row row-cols-1 row-cols-md-3 mb-3 text-center">
          {createSideCard(
            "Maintain",
            maintenanceCalories,
            "Select",
            maintenanceList,
            handleMaintain
          )}
          {createMainCard(
            "Cut",
            cuttingCalories,
            "Select",
            cuttingList,
            handleCut
          )}
          {createSideCard(
            "Bulk",
            bulkingCalories,
            "Select",
            bulkingList,
            handleBulk
          )}
        </div>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header>
            <Modal.Title>NOTICE</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            This is not medical advice. Consult with your doctor for medical
            advice and advice for trying a new diet.
          </Modal.Body>
          <Modal.Footer>
            <button className="btn btn-primary " onClick={handleClose}>
              Okay
            </button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}

export default ChooseDiet;
