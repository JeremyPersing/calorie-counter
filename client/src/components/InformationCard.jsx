import React from "react";

function InformationCard(props) {
  // color should be a bootstrap class or if you make your own class for
  // text-"color" or border-left-"color" you can use that
  const { className, color, title, text, icon, img } = props;

  return (
    <div className={className}>
      <div className={"card shadow h-100 py-2 border-left-" + color}>
        <div className={img ? "" : "card-body"}>
          <div className="row no-gutters align-items-center">
            <div className="col mr-2">
              {img && (
                <div className="d-flex justify-content-center bg-transparent">
                  <img src={img} className="rounded thumb" alt="current meal" />
                </div>
              )}
              <div
                className={
                  "text-s font-weight-bold text-uppercase mb-1 text-" + color
                }
              >
                {title}
              </div>
              <div className="h4 mb-0 font-weight-bold text-gray-800">
                {text}
              </div>
            </div>
            <div className="col-auto">{icon}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InformationCard;
