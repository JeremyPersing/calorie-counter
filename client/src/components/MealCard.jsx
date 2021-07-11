import React from "react";
import "../styles/MealCard.css";
import { useHistory } from "react-router-dom";

function MealCard(props) {
  let history = useHistory();
  const { meal } = props;
  const img = {
    backgroundImage: `url(${meal.photo.thumb})`,
  };

  const handleClick = () => {
    const mealName = meal.food_name;
    let pathName = "/meals/" + mealName;
    if (meal.nix_brand_id) pathName = "/meals/" + meal.nix_item_id;

    const location = {
      pathname: pathName,
    };

    history.push(location);
  };

  return (
    <div className="col-md-6 col-xl-4">
      <div className="card" onClick={handleClick}>
        <div className="meal-card-body">
          <div className="media align-items-center">
            <span style={img} className="avatar avatar-xl mr-3"></span>
            <div className="media-body overflow-hidden">
              <p className="card-text mb-0 text-capitalize">
                {meal.brand_name_item_name
                  ? meal.brand_name_item_name
                  : meal.food_name}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MealCard;
