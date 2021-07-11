import React from "react";
import Form from "../components/Form";
import Joi from "joi-browser";
import * as conversions from "../services/calorieConversionService";

class DietInformation extends Form {
  state = {
    data: {
      age: "",
      bodyWeight: "",
      gender: "",
      feet: "",
      inches: "",
      centimeters: "",
      exerciseLevel: "",
    },
    units: "Imperial",
    errors: {},
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
      gender: Joi.string().required().label("Gender"),
      feet: Joi.string().allow(""),
      inches: Joi.string().allow(""),
      centimeters: Joi.number().required().min(20),
      exerciseLevel: Joi.string().required().label("Exercise Level"),
    };
  };

  schema = this.getSchema(this.state.units);

  getUnits = (unit) => {
    if (unit === this.state.units) return "btn-nav btn-primary active";
    return "btn btn-sm small-font";
  };

  swapUnits = (units) => {
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

    let maintenanceCalories = conversions.calculateCalories(
      age,
      weight,
      heightInCm,
      exerciseLevel,
      gender
    );
    maintenanceCalories = Math.floor(maintenanceCalories);

    return {
      age: age,
      bodyWeight: weight,
      gender: this.genders[gender].name,
      height: heightInCm,
      exerciseLevel: this.exerciseLevels[exerciseLevel].name,
      maintenanceCalories,
    };
  };

  doSubmit = async () => {
    if (!this.validate())
      this.props.history.push({
        pathname: "/choosediet",
        state: this.getDietInfo(),
      });
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
                      <button
                        onClick={() => this.doSubmit()}
                        disabled={this.validate()}
                        className="btn btn-primary btn-user btn-block"
                        type="submit"
                        style={{ marginTop: "10px" }}
                      >
                        Submit
                      </button>
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
