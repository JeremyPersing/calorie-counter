import React, { useState, useEffect } from "react";
import Page from "../components/Page";
import Heading from "../components/Heading";
import InformationCard from "../components/InformationCard";
import { getConsumedMeals } from "../services/mealService";
import { getUserStats } from "../services/userStatsService";
import "../styles/Home.css";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import Card from "../components/Card";
import Dropdown from "react-bootstrap/Dropdown";

function Home(props) {
  const [dailyCalories, setDailyCalories] = useState(null);
  const [mealsConsumed, setMealsConsumed] = useState([]);
  const [totalCaloriesConsumed, setTotalCaloriesConsumed] = useState(0);

  useEffect(() => {
    async function getStats() {
      try {
        const { data } = await getUserStats();
        let consumedMeals = await getConsumedMeals();
        consumedMeals = consumedMeals.data;

        setDailyCalories(data.userStats.currentCalories);
        setMealsConsumed(consumedMeals);
        ///////////////////////////////////////////////////// Change with a call to get the users consumed meals
        let caloriesConsumed = 0;
        for (const i in consumedMeals) {
          caloriesConsumed += consumedMeals[i].nf_calories;
        }

        setTotalCaloriesConsumed(Math.round(caloriesConsumed));
      } catch (error) {
        console.log(error);
      }
    }
    getStats();
  }, []);

  const caloriePercentageConsumed = Math.round(
    (totalCaloriesConsumed / dailyCalories) * 100
  );

  const editMealIcon = () => {
    const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
      <div
        ref={ref}
        onClick={(e) => {
          e.preventDefault();
          console.log("onClick(e)", e);
          console.log(e.target);
          onClick(e);
        }}
      >
        {children}
      </div>
    ));

    const CustomMenu = React.forwardRef(
      ({ children, style, className, "aria-labelledby": labeledBy }, ref) => {
        const [value, setValue] = useState("");

        return (
          <div
            ref={ref}
            style={style}
            className={className}
            aria-labelledby={labeledBy}
          >
            <ul className="list-unstyled">
              {React.Children.toArray(children).filter(
                (child) =>
                  !value ||
                  child.props.children
                    .toLowerCase()
                    .startsWith(this.state.value)
              )}
            </ul>
          </div>
        );
      }
    );

    return (
      <Dropdown>
        <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
          <span className="edit-meal">&#8230;</span>
        </Dropdown.Toggle>

        <Dropdown.Menu as={CustomMenu}>
          <Dropdown.Item
            eventKey="1"
            onClick={() => {
              console.log("handle edit");
            }}
          >
            Edit Meal
          </Dropdown.Item>
          <Dropdown.Item
            onClick={(e) => {
              console.log("e", e.target);
              console.log("handle delete");
            }}
            eventKey="2"
          >
            Delete Meal
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
  };

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
              <div>
                <div className="form-row">
                  <span className="col-8 font-weight-bold">Meal Name</span>
                  <span className="col-4 font-weight-bold">Calories</span>
                </div>
                <hr />
                {mealsConsumed.map((item) => (
                  <div key={item._id} className="form-row my-2">
                    <span className="col-8">{item.food_name}</span>
                    <span className="col-3">{item.nf_calories}</span>
                    <span className="col-1">{editMealIcon()}</span>
                  </div>
                ))}
              </div>
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
