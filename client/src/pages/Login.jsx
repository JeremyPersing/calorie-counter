import React from "react";
import Form from "../components/Form";
import Joi from "joi-browser";
import auth from "../services/authService";
import {
  getUserMeals,
  getLocalUserMeals,
  setLocalUserMeals,
} from "../services/mealService";
import { Link } from "react-router-dom";
import { Redirect } from "react-router";
import FacebookButton from "../components/FacebookButton";
import GoogleButton from "../components/GoogleButton";

/*
// Because this class extends form it must have data and errors
// as state objects, a doSubmit method and a Joi schema
*/

class Login extends Form {
  state = {
    data: {
      email: "",
      password: "",
    },
    errors: {},
  };

  schema = {
    email: Joi.string().email().required().label("Email"),
    password: Joi.string().min(5).required().label("Password"),
  };

  doSubmit = async () => {
    try {
      const { data } = this.state;
      await auth.login(data.email, data.password);

      const userMeals = getLocalUserMeals();

      if (userMeals.length === 0) {
        const { data } = await getUserMeals();
        setLocalUserMeals(data);
      }

      this.props.history.push("/");
    } catch (error) {
      if (error.response && error.response.status === 400) {
        const errors = { ...this.state.errors };
        errors.email = error.response.data;
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
          {/* Outer Row */}
          <div className="col-xl-10 col-lg-12 col-md-12">
            <div className="card o-hidden border-0 shadow-lg my-5">
              <div className="card-body p-0 mt-4">
                {/* Nested Row within Card Body */}
                <div className="row">
                  <div className="col-lg-6 offset-lg-3">
                    <div className="p-5">
                      <div className="text-center">
                        <h1 className="h4 text-gray-900 mb-4">Welcome Back!</h1>
                      </div>
                      {/* Form */}
                      <div className="form-user">
                        {this.renderInput(
                          "email",
                          "Enter Email Address...",
                          "text",
                          this.handleKeyPress
                        )}
                        {this.renderInput(
                          "password",
                          "Password",
                          "password",
                          this.handleKeyPress
                        )}
                        <button
                          onClick={() => this.doSubmit()}
                          disabled={this.validate()}
                          className="btn btn-primary btn-user btn-block"
                          type="submit"
                        >
                          Login
                        </button>
                        <hr />
                        <GoogleButton login={true} />
                        <div className="mt-2">
                          <FacebookButton login={true} />
                        </div>
                      </div>
                      <hr />
                      <div className="text-center">
                        <Link
                          className="small text-decoration-none"
                          to="/register"
                        >
                          Create an Account!
                        </Link>
                      </div>
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

export default Login;
