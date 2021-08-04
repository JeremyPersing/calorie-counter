import React from "react";
import SkinnyLogo from "../components/SkinnyLogo";
import "../styles/Hero.css";

function Hero(props) {
  const handleLogin = () => {
    props.history.push("/login");
  };

  const handleRegister = () => {
    props.history.push("/register");
  };

  return (
    <div className="hero vh-100 d-flex flex-column">
      <div className="my-auto justify-content-center align-self-center content-container">
        <div className="center">
          <SkinnyLogo
            width="auto"
            style={{ marginBottom: "5%", height: "125px", color: "#150A02" }}
          />
        </div>
        <h1
          className="display-5 font-weight-light text-center"
          style={{ marginBottom: "5%", color: "#150A02" }}
        >
          CalorieBalance
        </h1>
        <h5
          className="text-center font-weight-light"
          style={{ marginBottom: "5%", color: "#150A02" }}
        >
          Find a balance between looking good and eating delicious foods
        </h5>
        <div>
          <button className="col-5 btn btn-hero " onClick={handleLogin}>
            Login
          </button>
          <button
            className="col-5 offset-2 btn btn-hero"
            onClick={handleRegister}
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}

export default Hero;
