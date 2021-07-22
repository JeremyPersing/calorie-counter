import React from "react";
import "../styles/IncreaseDecreaseInput.css";

function IncreaseDecreaseInput(props) {
  const { inputValue, setInputValue, className, onChange } = props;

  const decreaseValue = () => {
    let value = inputValue;
    if (value > 0.25) {
      value -= 0.25;
      console.log("Value", value);
      setInputValue(value);
    }
  };

  const increaseValue = () => {
    let value = inputValue;
    value += 0.25;
    setInputValue(value);
  };

  return (
    <div className={className + " servings-form"}>
      <button className="value-button" id="decrease" onClick={decreaseValue}>
        -
      </button>
      <input
        className="servings-input"
        size={1}
        value={inputValue}
        onChange={onChange}
        type="text"
      />
      <button className="value-button" id="increase" onClick={increaseValue}>
        +
      </button>
    </div>
  );
}

export default IncreaseDecreaseInput;
