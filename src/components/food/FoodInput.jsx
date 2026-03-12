import React from "react";
import FoodSearch from "./FoodSearch";

function FoodInput({ onFoodAdd }) {
  return (
    <div className="fade-in">
      <FoodSearch onFoodAdd={onFoodAdd} />
    </div>
  );
}

export default FoodInput;