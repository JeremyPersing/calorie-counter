import React, { Component } from "react";
import "../styles/App.css";

class Input extends Component {
  render() {
    const { value, onChange, name, error, label, ...rest } = this.props;
    return (
      <div className="form-group">
        <input
          value={value}
          onChange={onChange}
          name={name}
          id={name}
          {...rest}
          className="form-control form-control-user"
          placeholder={label}
        />
        {error && <div className="alert alert-danger">{error}</div>}
      </div>
    );
  }
}

export default Input;
