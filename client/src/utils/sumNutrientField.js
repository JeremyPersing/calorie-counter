export const sumNutrientField = (ingredients, nutrientField) => {
    let sum = 0;
    for (const i in ingredients) {
      let amount = ingredients[i][nutrientField];

      if (typeof amount !== Number) {
        amount = Number(amount);
      }

      sum += amount;
    }
    return sum.toFixed(2);
};

