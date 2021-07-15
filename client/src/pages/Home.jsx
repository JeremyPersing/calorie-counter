import React, { useState, useEffect } from "react";
import Page from "../components/Page";
import Heading from "../components/Heading";
import InformationCard from "../components/InformationCard";
import * as userData from "../services/getUserDataService";
import { getUserStats } from "../services/userStatsService";
import "../styles/Home.css";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import Card from "../components/Card";

function Home(props) {
  const [dailyCalories, setDailyCalories] = useState(null);
  const [mealsConsumed, setMealsConsumed] = useState([]);
  const [totalCaloriesConsumed, setTotalCaloriesConsumed] = useState(0);

  useEffect(() => {
    async function getStats() {
      try {
        const { data } = await getUserStats();

        console.log(data.userStats);
        setDailyCalories(data.userStats.currentCalories);
        setMealsConsumed(data.userStats.dailyStats.mealsConsumed);
        setTotalCaloriesConsumed(
          Math.round(userData.getTotalDailyCaloriesConsumed())
        );
      } catch (error) {
        console.log(error);
      }
    }
    getStats();
  }, []);

  const caloriePercentageConsumed = Math.round(
    (totalCaloriesConsumed / dailyCalories) * 100
  );

  return (
    <Page>
      <div className="d-sm-flex align-items-center justify-content-between mb-4 mt-5">
        <Heading text="Daily Progress" />
        <button
          className="mt-3-sm d-sm-inline-block btn btn-sm btn-primary shadow-sm"
          onClick={() => props.history.push("/meals/search")}
        >
          Add Meal
        </button>
      </div>
      <div className="row">
        <InformationCard
          className="col-lg-4 mb-4"
          color="primary"
          title="Daily Goal"
          text={dailyCalories + " calories"}
        />
        <InformationCard
          className="col-lg-4 mb-4"
          color={totalCaloriesConsumed < dailyCalories ? "success" : "danger"}
          title="Calories Consumed"
          text={totalCaloriesConsumed + " calories"}
        />
        <InformationCard
          className="col-lg-4 mb-4"
          color="info"
          title="Calories to Go"
          text={dailyCalories - totalCaloriesConsumed + " calories"}
        />
      </div>
      <div className="row">
        <Card
          className="col-lg-5"
          text="Percentage Consumed"
          body={
            <div className="d-flex align-items-center flex-column">
              <div className="mb-4" style={{ width: "auto", height: "auto" }}>
                <CircularProgressbar
                  value={caloriePercentageConsumed}
                  text={`${caloriePercentageConsumed}%`}
                />
              </div>
            </div>
          }
        />
        <Card
          className="col-lg-7"
          text="Meals Consumed"
          body={
            mealsConsumed.length > 0 ? (
              mealsConsumed.map((item) => (
                <li key={item._id}>
                  {item.brand_name ? item.brand_name + " " : null}
                  {item.item_name} ({item.servings})
                </li>
              ))
            ) : (
              <div className="d-flex align-items-center flex-column">
                <div className="h4 mb-0 font-weight-bold text-gray-800">
                  No Meals Consumed
                </div>
                <button
                  className="d-sm-inline-block btn btn-sm btn-primary shadow-sm mt-3"
                  onClick={() => props.history.push("/meals/search")}
                >
                  Add Meal
                </button>
              </div>
            )
          }
        />
      </div>
    </Page>
  );
}

export default Home;
