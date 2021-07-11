import React from "react";

function Card(props) {
  const { className, text, body } = props;
  return (
    <div className={className}>
      <div className="card shadow mb-4">
        <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
          <h6 className="m-0 font-weight-bold text-primary">{text}</h6>
        </div>

        <div className="card-body">{body}</div>
      </div>
    </div>
  );
}

export default Card;
