import React from "react";
import Logo from "../components/Logo";

function ThingsToRemember(props) {
  const nextPageEndpoint = "/";

  const generalAdvice = [
    {
      id: 0,
      content: "Eat .8 to 1 grams of protein per pound of bodyweight",
    },
    { id: 1, content: "Drink plenty of water per day" },
    {
      id: 2,
      content: "Weigh yourself each week to keep track of your progress",
    },
    { id: 3, content: "Consult with your doctor before trying any new diet" },
  ];

  return (
    <div>
      <div className="full-center">
        <div className="container">
          <div className="center">
            <Logo className="mb-4" width="100px" />
          </div>
          <h3 className="text-center pb-3">Things to Remember</h3>
          <div className="d-flex justify-content-center">
            <div className="d-flex flex-column">
              {generalAdvice.map((i) => (
                <ul key={i.id}>{i.content}</ul>
              ))}
            </div>
          </div>

          <div className="text-center mt-4">
            <button
              className="btn btn-primary"
              onClick={() => props.history.push(nextPageEndpoint)}
            >
              Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ThingsToRemember;
