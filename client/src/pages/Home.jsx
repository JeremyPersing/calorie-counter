import React, { useState, useEffect } from "react";
import Page from "../components/Page";
import Heading from "../components/Heading";
import InformationCard from "../components/InformationCard";
import {
  getConsumedMeals,
  putConsumedMeal,
  deleteConsumedMealById,
} from "../services/mealService";
import { getUserStats, putUserStats } from "../services/userStatsService";
import "../styles/Home.css";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import Card from "../components/Card";
import EditConsumedMealModal from "../components/EditConsumedMealModal";
import { toast } from "react-toastify";
import Dropdown from "react-bootstrap/Dropdown";

function Home(props) {
  const [dailyCalories, setDailyCalories] = useState(null);
  const [originalMealsConsumed, setOriginalMealsConsumed] = useState([]);
  const [mealsConsumed, setMealsConsumed] = useState([]);
  const [originalConsumedMeal, setOriginalConsumedMeal] = useState();
  const [consumedMeal, setConsumedMeal] = useState();
  const [totalCaloriesConsumed, setTotalCaloriesConsumed] = useState(0);
  const [showEdit, setShowEdit] = useState(false);

  useEffect(() => {
    async function getStats() {
      try {
        const { data } = await getUserStats();
        console.log(data);
        const now = new Date();
        const threeWeekDate = new Date(data.userStats.dietThreeWeekDate);
        const sixWeekDate = new Date(data.userStats.dietSixWeekDate);
        const nineWeekDate = new Date(data.userStats.dietNineWeekDate);

        let dailyCalories = data.userStats.currentCalories;
        let updateUserAccount = false;

        if (data.userStats.dietPlan === "Cutting") {
          let caloricDeficit =
            data.userStats.maintenanceCalories - dailyCalories;
          if (
            now >= threeWeekDate &&
            now < sixWeekDate &&
            caloricDeficit < 600
          ) {
            dailyCalories -= 100;
            updateUserAccount = true;
          } else if (
            now >= sixWeekDate &&
            now < nineWeekDate &&
            caloricDeficit < 700
          ) {
            dailyCalories -= 100;
            updateUserAccount = true;
          } else if (now >= nineWeekDate && caloricDeficit < 800) {
            dailyCalories -= 100;
            updateUserAccount = true;
          }
        } else if (data.userStats.dietPlan === "Bulking") {
          let caloricSurplus =
            dailyCalories - data.userStats.maintenanceCalories;
          if (
            now >= threeWeekDate &&
            now < sixWeekDate &&
            caloricSurplus < 600
          ) {
            dailyCalories += 100;
            updateUserAccount = true;
          } else if (
            now >= sixWeekDate &&
            now < nineWeekDate &&
            caloricSurplus < 700
          ) {
            dailyCalories += 100;
            updateUserAccount = true;
          } else if (now >= nineWeekDate && caloricSurplus < 800) {
            dailyCalories += 100;
            updateUserAccount = true;
          }
        }

        if (updateUserAccount) {
          const serverObj = {
            age: data.userStats.age,
            bodyWeight: data.userStats.bodyWeight,
            gender: data.userStats.gender,
            height: data.userStats.height,
            exerciseLevel: data.userStats.exerciseLevel,
            maintenanceCalories: data.userStats.maintenanceCalories,
            currentCalories: dailyCalories,
            dietPlan: data.userStats.dietPlan,
            dietStartDate: data.userStats.dietStartDate,
            dietThreeWeekDate: data.userStats.dietThreeWeekDate,
            dietSixWeekDate: data.userStats.dietSixWeekDate,
            dietNineWeekDate: data.userStats.dietNineWeekDate,
          };

          const res = await putUserStats(serverObj);
        }

        let consumedMeals = await getConsumedMeals();
        consumedMeals = consumedMeals.data;

        setDailyCalories(dailyCalories);
        setMealsConsumed(consumedMeals);
        setOriginalMealsConsumed(consumedMeals);

        let caloriesConsumed = calculateCaloriesConsumed(consumedMeals);

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

  const calculateCaloriesConsumed = (consumedMeals) => {
    let caloriesConsumed = 0;
    for (const i in consumedMeals) {
      caloriesConsumed += Number(consumedMeals[i].nf_calories);
    }

    return caloriesConsumed.toFixed(2);
  };

  const handleDeleteConsumedMeal = async (id) => {
    const original = [...mealsConsumed];
    let currConsumedMeals = [...mealsConsumed];

    currConsumedMeals = currConsumedMeals.filter((m) => m._id !== id);
    setMealsConsumed(currConsumedMeals);

    let caloriesConsumed = calculateCaloriesConsumed(currConsumedMeals);
    setTotalCaloriesConsumed(Math.round(caloriesConsumed));

    try {
      await deleteConsumedMealById(id);
    } catch (error) {
      console.log(error);
      toast.error("An error ocurred deleting that meal");

      setMealsConsumed(original);

      let caloriesConsumed = calculateCaloriesConsumed(original);
      setTotalCaloriesConsumed(Math.round(caloriesConsumed));
    }
  };

  const editMealIcon = (id) => {
    const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
      <div
        ref={ref}
        onClick={(e) => {
          e.preventDefault();
          onClick(e);
        }}
      >
        <div>{children}</div>
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
              getCurrentMeal(id);
              handleShowEdit();
            }}
          >
            Edit Meal
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => {
              handleDeleteConsumedMeal(id);
            }}
            eventKey="2"
          >
            Delete Meal
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
  };

  const getToFixed = (value) => {
    if (value) return Number(value).toFixed(2);
    return value;
  };

  const getCurrentMeal = (id) => {
    for (const i in mealsConsumed) {
      if (mealsConsumed[i]._id === id) {
        setConsumedMeal(mealsConsumed[i]);
        setOriginalConsumedMeal(originalMealsConsumed[i]);
        break;
      }
    }
  };

  const handleCloseEdit = () => {
    setShowEdit(false);
  };
  const handleShowEdit = () => setShowEdit(true);

  const handleEditMeal = async () => {
    const original = [...mealsConsumed];
    const meals = [...mealsConsumed];

    const index = meals.findIndex((m) => m._id === consumedMeal._id);
    handleCloseEdit();
    if (index > -1) {
      meals[index] = consumedMeal;
      console.log(meals);
      setMealsConsumed(meals);
      const calsConsumed = calculateCaloriesConsumed(meals);
      setTotalCaloriesConsumed(calsConsumed);

      try {
        const serverMeal = { ...consumedMeal };
        serverMeal.thumb = serverMeal.photo.thumb;
        delete serverMeal.photo;
        console.log("serverMeal", serverMeal);
        await putConsumedMeal(serverMeal);
      } catch (error) {
        setMealsConsumed(original);
        console.log(error);
        toast.error("An error occurred trying to update that meal");
      }
    }
  };

  const handleServingsChange = (value) => {
    const tempMeal = { ...originalConsumedMeal };

    const calPerServing = Number(tempMeal.nf_calories) / tempMeal.serving_qty;
    const proteinPerServing =
      Number(tempMeal.nf_protein) / tempMeal.serving_qty;
    const carbsPerServing =
      Number(tempMeal.nf_total_carbohydrate) / tempMeal.serving_qty;
    const fatPerServing = Number(tempMeal.nf_total_fat) / tempMeal.serving_qty;

    tempMeal.serving_qty = value;
    tempMeal.nf_calories = value * calPerServing;
    tempMeal.nf_protein = value * proteinPerServing;
    tempMeal.nf_total_carbohydrate = value * carbsPerServing;
    tempMeal.nf_total_fat = value * fatPerServing;

    setConsumedMeal(tempMeal);
  };

  const handleIngredientClick = (ingredientObj) => {
    console.log("ingedient clicked", ingredientObj);
    const mealName = ingredientObj.food_name;
    const obj = {
      food_name: mealName,
      created_meal: ingredientObj.created_meal,
    };

    localStorage.setItem("currentMealSelected", JSON.stringify(obj));

    const location = {
      pathname: "/meals/" + mealName,
      meal: obj,
    };

    props.history.push(location);
  };

  return (
    <Page>
      <div className="d-sm-flex align-items-center justify-content-between mb-4 mt-5">
        <Heading text="Daily Progress" />
        <button
          className="mt-3-sm d-sm-inline-block btn btn-primary "
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
          text={getToFixed(dailyCalories) + " calories"}
        />
        <InformationCard
          className="col-lg-4 mb-4"
          color={totalCaloriesConsumed < dailyCalories ? "success" : "danger"}
          title="Calories Consumed"
          text={getToFixed(totalCaloriesConsumed) + " calories"}
        />
        <InformationCard
          className="col-lg-4 mb-4"
          color="info"
          title="Calories to Go"
          text={getToFixed(dailyCalories - totalCaloriesConsumed) + " calories"}
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
                  <span className="col-7 font-weight-bold">Meal Name</span>
                  <span className="col-5 font-weight-bold">Calories</span>
                </div>
                <hr />
                {mealsConsumed.map((item) => (
                  <div className="form-row">
                    <div
                      key={item._id}
                      className="col-11 my-2 ingredient form-row"
                      onClick={() => handleIngredientClick(item)}
                    >
                      <span className="col-8">{item.food_name}</span>
                      <span className="col-4">
                        {getToFixed(item.nf_calories)}
                      </span>
                    </div>
                    <span className="col-1 mt-1" value={item.food_name}>
                      {editMealIcon(item._id)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="d-flex align-items-center flex-column">
                <div className="h4 mb-0 font-weight-bold text-gray-800">
                  No Meals Consumed
                </div>
                <button
                  className="d-sm-inline-block btn btn-primary mt-3"
                  onClick={() => props.history.push("/meals/search")}
                >
                  Add Meal
                </button>
              </div>
            )
          }
        />
      </div>
      {showEdit && (
        <EditConsumedMealModal
          show={showEdit}
          edit={true}
          handleClose={handleCloseEdit}
          handleAdd={handleEditMeal}
          consumedMeal={consumedMeal}
          servings={consumedMeal.serving_qty}
          onChange={(e) => handleServingsChange(e.target.value)}
        />
      )}
    </Page>
  );
}

export default Home;
