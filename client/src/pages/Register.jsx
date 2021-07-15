import React from "react";
import Joi from "joi-browser";
import Form from "../components/Form";
import auth from "../services/authService";
import * as userService from "../services/userService";
import {
  setLocalUserMeals,
  createUserMealsDocument,
} from "../services/mealService";
import { Link } from "react-router-dom";
import { Redirect } from "react-router";
import { toast } from "react-toastify";
import FacebookButton from "../components/FacebookButton";
import GoogleButton from "../components/GoogleButton";

class Register extends Form {
  state = {
    data: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
    },
    errors: {},
  };

  schema = {
    first_name: Joi.string().required().label("First Name"),
    last_name: Joi.string().required().label("Last Name"),
    email: Joi.string().required().email().label("Email"),
    password: Joi.string().min(5).required().label("Password"),
  };

  doSubmit = async () => {
    try {
      const response = await userService.register(this.state.data);
      auth.loginWithJwt(response.headers["x-auth-token"]);
      await createUserMealsDocument();
      setLocalUserMeals([]);

      window.location = "/dietinformation";
    } catch (error) {
      if (error.response && error.response.status === 400) {
        const errors = { ...this.state.errors };
        toast.error(error.response.data);
        this.setState({ errors });
      }
    }
  };

  handleKeyPress = (e) => {
    e.charCode === 13 && this.doSubmit();
  };

  render() {
    if (auth.getCurrentUser()) return <Redirect to="/" />;

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
                        Create an Account
                      </h1>
                    </div>
                    {/* Form */}
                    <div className="form-user">
                      <div
                        className="form-group row"
                        style={{ marginBottom: "-6px" }}
                      >
                        <div
                          className="col-sm-6"
                          style={{ marginBottom: "-6px" }}
                        >
                          {this.renderInput(
                            "first_name",
                            "First Name",
                            "text",
                            this.handleKeyPress
                          )}
                        </div>
                        <div className="col-sm-6">
                          {this.renderInput(
                            "last_name",
                            "Last Name",
                            "text",
                            this.handleKeyPress
                          )}
                        </div>
                      </div>
                      <div className="form-group">
                        {this.renderInput(
                          "email",
                          "Email",
                          "email",
                          this.handleKeyPress
                        )}
                      </div>
                      <div className="form-group">
                        {this.renderInput(
                          "password",
                          "Password",
                          "password",
                          this.handleKeyPress
                        )}
                      </div>
                      <button
                        onClick={() => this.doSubmit()}
                        disabled={this.validate()}
                        className="btn btn-primary btn-user btn-block"
                        type="submit"
                      >
                        Register Account
                      </button>
                      <hr />
                      <div>
                        <GoogleButton />
                        <FacebookButton />
                      </div>
                    </div>
                    <hr />
                    <div className="text-center">
                      <Link className="small text-decoration-none" to="/login">
                        Already have an account? Login!
                      </Link>
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

export default Register;
