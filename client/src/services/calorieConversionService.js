const convertPoundsToKiloGrams = (pounds) => {
  pounds = Number(pounds);
  return pounds * 0.453592;
};

const convertFeetToCentimeters = (feet) => {
  feet = Number(feet);
  return feet * 30.48;
};

const convertInchesToCentimeters = (inches) => {
  inches = Number(inches);
  return inches * 2.54;
};

const determineActivityMulitplier = (activityId) => {
  activityId = Number(activityId);

  switch (activityId) {
    case 0:
      return 1.2;
    case 1:
      return 1.38;
    case 2:
      return 1.46;
    case 3:
      return 1.55;
    case 4:
      return 1.72;
    case 5:
      return 1.9;
    default:
      return 1.38;
  }
};

const determineGenderMultiplier = (genderId) => {
  genderId = Number(genderId);
  if (genderId === 0) {
    return 5;
  }
  return -161;
};

const calculateCalories = (
  age,
  weightInKg,
  heightInCm,
  activityId,
  genderId
) => {
  const activityMultiplier = determineActivityMulitplier(activityId);
  const genderAddOn = determineGenderMultiplier(genderId);

  weightInKg = Number(weightInKg);
  heightInCm = Number(heightInCm);
  age = Number(age);

  const bmr = 10 * weightInKg + 6.25 * heightInCm - 5 * age + genderAddOn;
  return bmr * activityMultiplier;
};

export {
  convertPoundsToKiloGrams,
  convertFeetToCentimeters,
  convertInchesToCentimeters,
  calculateCalories,
};
