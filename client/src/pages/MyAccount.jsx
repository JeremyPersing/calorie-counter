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
              text={getImperialHeight(user.height)}
            />
            <InformationCard
              className="col-sm-4 mb-4"
              color="dark"
              title="Weight"
              text={Math.round(kiloGramsToPounds(user.bodyWeight)) + " lbs"}
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
          <Dropdown.Item onClick={() => props.history.push("/dietinformation")}>
            Update Stats
          </Dropdown.Item>
          <Dropdown.Item onClick={() => props.history.push("/choosediet")}>
            Update Meal Plan
          </Dropdown.Item>
          <Dropdown.Item onClick={() => props.history.push("/dietinformation")}>
            Update Both
          </Dropdown.Item>
        </DropdownButton>
      </Page>
    </>
  );
}

export default MyAccount;
