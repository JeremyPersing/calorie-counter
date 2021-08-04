import React, { useState, useEffect } from "react";
import Page from "../components/Page";
import Heading from "../components/Heading";
import InformationCard from "../components/InformationCard";
import { getUserStats } from "../services/userStatsService";
import {
  getImperialHeight,
  kiloGramsToPounds,
} from "../services/calorieConversionService";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";

function MyAccount(props) {
  const [user, setUser] = useState({});

  useEffect(() => {
    async function getStats() {
      const res = await getUserStats();
      console.log(res.data);
      setUser(res.data.userStats);
    }
    getStats();
  }, []);

  let date = new Date(user.dietStartDate);
  date = date.toDateString();

  const updateStats = () => {
    props.history.push({
      pathname: "/dietinformation",
      state: { updatestats: true, userstats: user },
    });
  };

  const updateMealPlan = () => {
    console.log(user);
    props.history.push({
      pathname: "/choosediet",
      state: {
        age: user.age,
        bodyWeight: user.bodyWeight,
        gender: user.gender,
        units: user.units,
        height: user.height,
        exerciseLevel: user.exerciseLevel,
        maintenanceCalories: user.maintenanceCalories,
        updateDiet: true,
      },
    });
  };

  const updateBoth = () => {
    props.history.push({
      pathname: "/dietinformation",
      state: { userstats: user },
    });
  };

  return (
    <>
      <Page>
        <div className="d-sm-flex align-items-center justify-content-between mb-4 mt-5">
          <Heading text="My Account" />
        </div>
        <div>
          <h5 className="text-center">Your Stats</h5>
          <div className="row">
            <InformationCard
              className="col-sm-4 mb-4"
              color="dark"
              title="Age"
              text={user.age}
            />
            <InformationCard
              className="col-sm-4 mb-4"
              color="dark"
              title="Height"
              text={
                user.units === "Imperial"
                  ? getImperialHeight(user.height)
                  : user.height + " cm"
              }
            />
            <InformationCard
              className="col-sm-4 mb-4"
              color="dark"
              title="Weight"
              text={
                user.units === "Imperial"
                  ? Math.round(kiloGramsToPounds(user.bodyWeight)) + " lbs"
                  : user.bodyWeight + " kg"
              }
            />
          </div>
          <div className="row">
            <InformationCard
              className="col-sm-6 mb-4"
              color="dark"
              title="Exercise Level"
              text={user.exerciseLevel}
            />
            <InformationCard
              className="col-sm-6 mb-4"
              color="dark"
              title="Current Calories"
              text={user.currentCalories}
            />
          </div>
          <div className="row">
            <InformationCard
              className="col-sm-6 mb-4"
              color="dark"
              title="Start Date"
              text={date}
            />
            <InformationCard
              className="col-sm-6 mb-4"
              color="dark"
              title="Diet Plan"
              text={user.dietPlan}
            />
          </div>
        </div>

        <DropdownButton
          id="dropdown-basic-button"
          className="text-center"
          variant="secondary"
          title="Update"
        >
          <Dropdown.Item onClick={updateStats}>Update Stats</Dropdown.Item>
          <Dropdown.Item onClick={updateMealPlan}>
            Update Meal Plan
          </Dropdown.Item>
          <Dropdown.Item onClick={updateBoth}>Update Both</Dropdown.Item>
        </DropdownButton>
      </Page>
    </>
  );
}

export default MyAccount;
