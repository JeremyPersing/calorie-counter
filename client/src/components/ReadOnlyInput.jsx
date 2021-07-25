import React from "react";

function ReadOnlyInput({ value }) {
  return (
    <div className="form-group">
      <input
        value={value}
        className="form-control form-control-user"
        readOnly
      />
    </div>
  );
}

export default ReadOnlyInput;
