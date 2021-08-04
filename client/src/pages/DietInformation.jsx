import React from "react";
import Form from "../components/Form";
import Joi from "joi-browser";
import { putUserStats } from "../services/userStatsService";
import * as conversions from "../services/calorieConversionService";
import {
  getHeightFeet,
  getHeightInches,
  kiloGramsToPounds,
} from "../services/calorieConversionService";
import { toast } from "react-toastify";

// convert the units for userstats depending on the units

class DietInformation extends Form {
  state = {
    data: !this.props.location.state
      ? {
          age: "",
          bodyWeight: "",
          gender: "",
          feet: "",
          inches: "",
          centimeters: "",
          exerciseLevel: "",
        }
      : this.props.location.state.userstats.units === "Imperial"
      ? {
          age: this.props.location.state.userstats.age,
          bodyWeight: Math.round(
            kiloGramsToPounds(this.props.location.state.userstats.bodyWeight)
          ),
          gender: this.props.location.state.userstats.gender,
          feet: getHeightFeet(this.props.location.state.userstats.height),
          inches: getHeightInches(this.props.location.state.userstats.height),
          centimeters: "",
          exerciseLevel: this.props.location.state.userstats.exerciseLevel,
        }
      : {
          age: this.props.location.state.userstats.age,
          bodyWeight: Math.round(
            this.props.location.state.userstats.bodyWeight
          ),
          gender: this.props.location.state.userstats.gender,
          feet: "",
          inches: "",
          centimeters: this.props.location.state.userstats.height,
          exerciseLevel: this.props.location.state.userstats.exerciseLevel,
        },
    units: this.props.location.state
      ? this.props.location.state.userstats.units
      : "Imperial",
    errors: {},
    update: false,
  };

  genders = [
    { _id: 0, name: "Male" },
    { _id: 1, name: "Female" },
  ];

  exerciseLevels = [
    { _id: 0, name: "No Exercise" },
    { _id: 1, name: "Light Exercise (3 times per week)" },
    { _id: 2, name: "Moderate Exercise (4-5 times per week)" },
    { _id: 3, name: "Active (Intense Exercise 3-4 times per week)" },
    { _id: 4, name: "Very Active (Intense Exercise 5-7 times per week)" },
    {
      _id: 5,
      name: "Extremely Active (Manual labor work or multiple workouts per day",
    },
  ];

  componentDidMount() {
    console.log("props", this.props);
    if (this.props.location.state && this.props.location.state.updatestats) {
      console.log(this.props.location.state);
      console.log("update === true");
      this.setState({ update: true });
    }
  }

  getSchema = (units) => {
    if (units === "Imperial")
      return {
        age: Joi.number().min(1).required().label("Age"),
        bodyWeight: Joi.number()
          .min(30)
          .max(700)
          .required()
          .label("Bodyweight"),
        gender: Joi.string().required().label("Gender"),
        feet: Joi.number().required().min(1).max(9).label("Feet"),
        inches: Joi.number().required().min(0).max(11.99).label("Inches"),
        centimeters: Joi.string().allow(""),
        exerciseLevel: Joi.string().required().label("Exercise Level"),
      };

    return {
      age: Joi.number().min(1).required().label("Age"),
      bodyWeight: Joi.number().min(10).max(400).required().label("Bodyweight"),
      feet: Joi.string().allow(""),
      inches: Joi.string().allow(""),
      gender: Joi.string().required().label("Gender"),
      centimeters: Joi.number().required().min(20),
      exerciseLevel: Joi.string().required().label("Exercise Level"),
    };
  };

  schema = this.getSchema(this.state.units);

  getUnits = (unit) => {
    if (unit === this.state.units) return "btn-nav btn-primary active";
    return "btn small-font";
  };

  swapUnits = (units) => {
    let data;
    if (this.props.location.state && this.props.location.state.userstats) {
      if (units === "Imperial") {
        data = {
          age: this.props.location.state.userstats.age,
          bodyWeight: Math.round(
            kiloGramsToPounds(this.props.location.state.userstats.bodyWeight)
          ),
          gender: this.props.location.state.userstats.gender,
          feet: getHeightFeet(this.props.location.state.userstats.height),
          inches: getHeightInches(this.props.location.state.userstats.height),
          centimeters: "",
          exerciseLevel: this.props.location.state.userstats.exerciseLevel,
        };
      } else if (units === "Metric") {
        data = {
          age: this.props.location.state.userstats.age,
          bodyWeight: Math.round(
            this.props.location.state.userstats.bodyWeight
          ),
          gender: this.props.location.state.userstats.gender,
          feet: "",
          inches: "",
          centimeters: this.props.location.state.userstats.height,
          exerciseLevel: this.props.location.state.userstats.exerciseLevel,
        };
      }
      this.setState({ data });
    }
    this.setState({ units });
    this.schema = this.getSchema(units);
  };

  getDietInfo = () => {
    const {
      feet,
      inches,
      centimeters,
      bodyWeight,
      age,
      exerciseLevel,
      gender,
    } = this.state.data;
    const { units } = this.state;
    let heightInCm;
    if (units === "Imperial") {
      const feetToCm = conversions.convertFeetToCentimeters(feet);
      const inToCm = conversions.convertInchesToCentimeters(inches);
      heightInCm = feetToCm + inToCm;
    } else {
      heightInCm = centimeters;
    }

    let weight;
    units === "Imperial"
      ? (weight = conversions.convertPoundsToKiloGrams(bodyWeight))
      : (weight = Number(bodyWeight));

    console.log("Going into calculateCalories: age", age);
    console.log("Typeof age", typeof age);
    console.log("Going into calculateCalories: weight", weight);
    console.log("Typeof weight", typeof weight);
    console.log("Going into calculateCalories: heightInCm", heightInCm);
    console.log("Typeof heightInCm", typeof heightInCm);
    console.log("Going into calculateCalories: exerciseLevel", exerciseLevel);
    console.log("Typeof exerciseLevel", typeof exerciseLevel);
    console.log("Going into calculateCalories: gender", gender);
    console.log("Typeof gender", typeof gender);

    let levelOfExercisesIndex = this.exerciseLevels.findIndex(
      (i) => i.name === exerciseLevel
    );
    console.log("levelOfExercisesIndex", levelOfExercisesIndex);

    let maintenanceCalories = conversions.calculateCalories(
      age,
      weight,
      heightInCm,
      levelOfExercisesIndex,
      gender
    );
    console.log("Maintenance Calories");
    console.log("Gender in getDietInfo", gender);
    console.log("ExerciseLevel in getDietInfo", exerciseLevel);

    maintenanceCalories = Math.floor(maintenanceCalories);

    return {
      age: age,
      bodyWeight: weight,
      gender,
      units: this.state.units,
      height: heightInCm,
      exerciseLevel,
      maintenanceCalories,
    };
  };

  doSubmit = async () => {
    if (this.state.update) {
      if (!this.validate()) {
        const { userstats } = this.props.location.state;
        console.log("userStats", userstats);

        const data = this.getDietInfo();
        data.dietPlan = userstats.dietPlan;
        data.currentCalories = userstats.currentCalories;
        data.maintenanceCalories =
          this.props.location.state.userstats.maintenanceCalories;

        try {
          await putUserStats(data);
          this.props.history.push("/myaccount");
        } catch (error) {
          console.log(error.response);
          toast.error("Error updating your stats");
        }
      }
    } else {
      if (!this.validate())
        this.props.history.push({
          pathname: "/choosediet",
          state: this.getDietInfo(),
        });
    }
  };

  render() {
    return (
      <div className="bg-gradient-light overflow-auto vh-100 d-flex">
        <div className="container my-auto">
          <div className="card o-hidden border-0 shadow-lg my-5">
            <div className="card-body p-0">
              {/* Nested Row within Card Body */}
              <div className="row">
                <div className="col-lg-8 offset-lg-2">
                  <div className="p-5">
                    <div className="text-center">
                      <h1 className="h4 text-gray-900 mb-4">
                        Enter the Following Information
                      </h1>
                    </div>
                    {/* Nav Pills */}
                    <nav
                      className="nav nav-pills flex-column flex-sm-row"
                      style={{ marginBottom: "3px" }}
                    >
                      <button
                        className={this.getUnits("Imperial")}
                        onClick={() => this.swapUnits("Imperial")}
                      >
                        Imperial
                      </button>
                      <button
                        className={this.getUnits("Metric") + " ml-2"}
                        onClick={() => this.swapUnits("Metric")}
                      >
                        Metric
                      </button>
                    </nav>
                    {/* Form */}
                    <div className="form-user">
                      <div className="form-group row">
                        <div className="col-sm-6">
                          {this.renderInput("age", "Age", "number")}
                        </div>
                        <div className="col-sm-6">
                          {this.state.units === "Imperial"
                            ? this.renderInput(
                                "bodyWeight",
                                "Bodyweight (lbs)",
                                "number"
                              )
                            : this.renderInput(
                                "bodyWeight",
                                "Bodyweight (kg)",
                                "number"
                              )}
                        </div>
                      </div>
                      <div className="form-group">
                        {this.renderSelect("gender", "Gender", this.genders)}
                      </div>
                      {this.state.units === "Imperial" ? (
                        <div className="form-group row">
                          <div className="col-sm-6">
                            {this.renderInput("feet", "Height (ft)", "number")}
                          </div>
                          <div className="col-sm-6">
                            {this.renderInput("inches", "Inches", "number")}
                          </div>
                        </div>
                      ) : (
                        <div
                          className="form-group row"
                          style={{ marginBottom: "8px", marginLeft: "1px" }}
                        >
                          {this.renderInput(
                            "centimeters",
                            "Height (cm)",
                            "number"
                          )}
                        </div>
                      )}
                      <div className="form-group">
                        {this.renderSelect(
                          "exerciseLevel",
                          "Exercise Level",
                          this.exerciseLevels
                        )}
                      </div>
                      <small className="form-text text-muted">
                        <div style={{ paddingLeft: "1rem" }}>
                          Light/Moderate: 15-30 minutes of elevated heart rate
                        </div>
                        <br />
                        <div
                          style={{ paddingLeft: "1rem", marginTop: "-1rem" }}
                        >
                          Intense: elevated heart rate for 30+ minutes
                        </div>
                      </small>
                      {!this.state.update ? (
                        <button
                          onClick={() => this.doSubmit()}
                          disabled={this.validate()}
                          className="btn btn-primary btn-user btn-block"
                          type="submit"
                          style={{ marginTop: "10px" }}
                        >
                          Submit
                        </button>
                      ) : (
                        <button
                          onClick={() => this.doSubmit()}
                          disabled={this.validate()}
                          className="btn btn-primary btn-user btn-block"
                          type="submit"
                          style={{ marginTop: "10px" }}
                        >
                          Update
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default DietInformation;
