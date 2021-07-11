import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import animationData from "../lotties/lf30_editor_2nt0sohi.json";
import {
  filterCreatedMeals,
  getLocalUserMeals,
  getCreatedMeals,
} from "../services/mealService";
import nutritionixService from "../services/nutritionixService";
import likify from "../utils/likifyMeals";
import Search from "./Search";
import UncontrolledLottie from "./UncontrolledLottie";
import AddedIcon from "./AddedComponent";
import PaginatedMealDisplay from "./PaginatedMealsDisplay";
import "../styles/MealsTable.css";

function SearchMealsDisplay(props) {
  const { setProducts, products } = props;
  const [playLottie, setPlayLottie] = useState(false);
  const [tableVisible, setTableVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const mealsObj = {
    common: [
      {
        food_name: "cookies n cream pie",
        serving_unit: "slice",
        tag_name: "oreo pie",
        serving_qty: 1,
        common_type: null,
        tag_id: "5740",
        photo: {
          thumb:
            "https://d2eawub7utcl6.cloudfront.net/images/nix-apple-grey.png",
          highres: null,
          is_user_uploaded: false,
        },
        locale: "en_US",
      },
      {
        food_name: "cookies and cream pie",
        serving_unit: "slice",
        tag_name: "oreo pie",
        serving_qty: 1,
        common_type: null,
        tag_id: "5740",
        photo: {
          thumb:
            "https://d2eawub7utcl6.cloudfront.net/images/nix-apple-grey.png",
          highres: null,
          is_user_uploaded: false,
        },
        locale: "en_US",
      },
      {
        food_name: "cupcake cookies n cream",
        serving_unit: "Cupcake with frosting",
        tag_name: "Cookies and cream cupcake",
        serving_qty: 1,
        common_type: null,
        tag_id: "14338",
        photo: {
          thumb: "https://nix-tag-images.s3.amazonaws.com/14338_thumb.jpg",
        },
        locale: "en_US",
      },
      {
        food_name: "cookies n cream cupcake",
        serving_unit: "Cupcake with frosting",
        tag_name: "Cookies and cream cupcake",
        serving_qty: 1,
        common_type: null,
        tag_id: "14338",
        photo: {
          thumb: "https://nix-tag-images.s3.amazonaws.com/14338_thumb.jpg",
        },
        locale: "en_US",
      },
      {
        food_name: "cookies n cream ice cream",
        serving_unit: 'medium (3" diameter)',
        tag_name: "cookies 'n cream ice cream",
        serving_qty: 1,
        common_type: null,
        tag_id: "1213",
        photo: {
          thumb:
            "https://d2eawub7utcl6.cloudfront.net/images/nix-apple-grey.png",
          highres: null,
          is_user_uploaded: false,
        },
        locale: "en_US",
      },
      {
        food_name: "cookies and cream doughnut",
        serving_unit: "donut",
        tag_name: "oreo donut",
        serving_qty: 1,
        common_type: null,
        tag_id: "13930",
        photo: {
          thumb:
            "https://d2eawub7utcl6.cloudfront.net/images/nix-apple-grey.png",
          highres: null,
          is_user_uploaded: false,
        },
        locale: "en_US",
      },
      {
        food_name: "cookies and cream ice cream",
        serving_unit: "cup",
        tag_name: "cookies and cream ice cream",
        serving_qty: 1,
        common_type: null,
        tag_id: "4277",
        photo: {
          thumb: "https://nix-tag-images.s3.amazonaws.com/4277_thumb.jpg",
        },
        locale: "en_US",
      },
      {
        food_name: "cream cookies",
        serving_unit: "cookie",
        tag_name: "custard cream cookies",
        serving_qty: 1,
        common_type: null,
        tag_id: "3635",
        photo: {
          thumb:
            "https://d2eawub7utcl6.cloudfront.net/images/nix-apple-grey.png",
          highres: null,
          is_user_uploaded: false,
        },
        locale: "en_US",
      },
      {
        food_name: "ice cream cookies",
        serving_unit: "sandwich",
        tag_name: "ice cream cookie sandwich",
        serving_qty: 1,
        common_type: null,
        tag_id: "5943",
        photo: {
          thumb:
            "https://d2eawub7utcl6.cloudfront.net/images/nix-apple-grey.png",
          highres: null,
          is_user_uploaded: false,
        },
        locale: "en_US",
      },
      {
        food_name: "bourbon cream cookies",
        serving_unit: "biscuit",
        tag_name: "bourbon biscuit",
        serving_qty: 1,
        common_type: null,
        tag_id: "7034",
        photo: {
          thumb:
            "https://d2eawub7utcl6.cloudfront.net/images/nix-apple-grey.png",
          highres: null,
          is_user_uploaded: false,
        },
        locale: "en_US",
      },
      {
        food_name: "hersheys cookies n cream bars",
        serving_unit: "bars",
        tag_name: "hershey's cookies n cream bars",
        serving_qty: 3,
        common_type: 2,
        tag_id: "12646",
        photo: {
          thumb:
            "https://d2eawub7utcl6.cloudfront.net/images/nix-apple-grey.png",
          highres: null,
          is_user_uploaded: false,
        },
        locale: "en_US",
      },
      {
        food_name: "cookies n cream ice cream cake",
        serving_unit: "piece",
        tag_name: "oreo ice cream cake",
        serving_qty: 1,
        common_type: null,
        tag_id: "5897",
        photo: {
          thumb:
            "https://d2eawub7utcl6.cloudfront.net/images/nix-apple-grey.png",
          highres: null,
          is_user_uploaded: false,
        },
        locale: "en_US",
      },
      {
        food_name: "custard cream cookies",
        serving_unit: "cookie",
        tag_name: "custard cream cookies",
        serving_qty: 1,
        common_type: null,
        tag_id: "3635",
        photo: {
          thumb:
            "https://d2eawub7utcl6.cloudfront.net/images/nix-apple-grey.png",
          highres: null,
          is_user_uploaded: false,
        },
        locale: "en_US",
      },
      {
        food_name: "coffee cookies n cream ice cream",
        serving_unit: "cup",
        tag_name: "coffee oreo ice cream",
        serving_qty: 1,
        common_type: null,
        tag_id: "12939",
        photo: {
          thumb:
            "https://d2eawub7utcl6.cloudfront.net/images/nix-apple-grey.png",
          highres: null,
          is_user_uploaded: false,
        },
        locale: "en_US",
      },
      {
        food_name: "cookies and cream ice cream cake",
        serving_unit: "piece",
        tag_name: "oreo ice cream cake",
        serving_qty: 1,
        common_type: null,
        tag_id: "5897",
        photo: {
          thumb:
            "https://d2eawub7utcl6.cloudfront.net/images/nix-apple-grey.png",
          highres: null,
          is_user_uploaded: false,
        },
        locale: "en_US",
      },
      {
        food_name: "chocolate cream filled cookies",
        serving_unit: "cookie",
        tag_name: "sandwich cookie",
        serving_qty: 1,
        common_type: null,
        tag_id: "1107",
        photo: {
          thumb:
            "https://d2eawub7utcl6.cloudfront.net/images/nix-apple-grey.png",
          highres: null,
          is_user_uploaded: false,
        },
        locale: "en_US",
      },
      {
        food_name: "crawfords custard cream cookies",
        serving_unit: "cookie",
        tag_name: "custard cream cookies",
        serving_qty: 1,
        common_type: null,
        tag_id: "3635",
        photo: {
          thumb:
            "https://d2eawub7utcl6.cloudfront.net/images/nix-apple-grey.png",
          highres: null,
          is_user_uploaded: false,
        },
        locale: "en_US",
      },
      {
        food_name: "combat protein powder cookies n cream",
        serving_unit: "scoop",
        tag_name: "combat protein powder cookies n cream",
        serving_qty: 1,
        common_type: 2,
        tag_id: "12087",
        photo: {
          thumb:
            "https://d2eawub7utcl6.cloudfront.net/images/nix-apple-grey.png",
          highres: null,
          is_user_uploaded: false,
        },
        locale: "en_US",
      },
      {
        food_name: "muscle milk cookies n cream protein powder",
        serving_unit: "scoop",
        tag_name: "muscle milk cookies and cream protein powder",
        serving_qty: 1,
        common_type: 2,
        tag_id: "14771",
        photo: {
          thumb:
            "https://d2eawub7utcl6.cloudfront.net/images/nix-apple-grey.png",
          highres: null,
          is_user_uploaded: false,
        },
        locale: "en_US",
      },
      {
        food_name: "herbalife nutritional shake mix cookies n cream",
        serving_unit: "scoops",
        tag_name: "herbalife nutritional shake mix cookies n cream",
        serving_qty: 2,
        common_type: 2,
        tag_id: "10417",
        photo: {
          thumb:
            "https://d2eawub7utcl6.cloudfront.net/images/nix-apple-grey.png",
          highres: null,
          is_user_uploaded: false,
        },
        locale: "en_US",
      },
    ],
    branded: [
      {
        food_name: "Cookies 'N Cream Bar",
        serving_unit: "bar",
        nix_brand_id: "5b9b5fb7eb2d100573d7e58f",
        brand_name_item_name: "Built Bar Cookies 'N Cream Bar",
        serving_qty: 1,
        nf_calories: 130,
        photo: {
          thumb:
            "https://nutritionix-api.s3.amazonaws.com/5f58f0ee75f7046c344be681.jpeg",
        },
        brand_name: "Built Bar",
        region: 1,
        brand_type: 2,
        nix_item_id: "5f45914f84b4e6c66b66a118",
        locale: "en_US",
      },
      {
        food_name: "Cookies N' Cream Ice Cream",
        serving_unit: "oz.",
        nix_brand_id: "513fbc1283aa2dc80c00029c",
        brand_name_item_name:
          "Nestle Tollhouse Cafe Cookies N' Cream Ice Cream",
        serving_qty: 4,
        nf_calories: 150,
        photo: {
          thumb:
            "https://d2eawub7utcl6.cloudfront.net/images/nix-apple-grey.png",
          highres: null,
          is_user_uploaded: false,
        },
        brand_name: "Nestle Tollhouse Cafe",
        region: 1,
        brand_type: 1,
        nix_item_id: "52cdd0b7051cb9eb32012d7d",
        locale: "en_US",
      },
      {
        food_name: "Cookies 'n Cream Ice Cream",
        serving_unit: "cup",
        nix_brand_id: "60b0f67492b95500086d3210",
        brand_name_item_name: "Wawa, Inc Cookies 'n Cream Ice Cream",
        serving_qty: 0.6700000166893005,
        nf_calories: 200,
        photo: {
          thumb:
            "https://nutritionix-api.s3.amazonaws.com/60c2194e5a5d900007fdee5e.jpeg",
        },
        brand_name: "Wawa, Inc",
        region: 1,
        brand_type: 2,
        nix_item_id: "60c2194e5a5d900007fdee5d",
        locale: "en_US",
      },
      {
        food_name: "Ice Cream Sandwich, Cookies 'N Cream",
        serving_unit: "sandwich",
        nix_brand_id: "51db37f8176fe9790a89ab6d",
        brand_name_item_name:
          "The Skinny Cow Ice Cream Sandwich, Cookies 'N Cream",
        serving_qty: 1,
        nf_calories: 160,
        photo: {
          thumb:
            "https://nutritionix-api.s3.amazonaws.com/5f524b2b2341020069757158.jpeg",
        },
        brand_name: "The Skinny Cow",
        region: 1,
        brand_type: 2,
        nix_item_id: "51d37755cc9bff5553aa97f0",
        locale: "en_US",
      },
      {
        food_name: "Cookies n Cream",
        serving_unit: "Cup",
        nix_brand_id: "32f12140d3d2299f157fef6c",
        brand_name_item_name: "YoCream Cookies n Cream",
        serving_qty: 0.6700000166893005,
        nf_calories: 150,
        photo: {
          thumb:
            "https://d2eawub7utcl6.cloudfront.net/images/nix-apple-grey.png",
          highres: null,
          is_user_uploaded: false,
        },
        brand_name: "YoCream",
        region: 1,
        brand_type: 1,
        nix_item_id: "32f1270353da32354932a5b1",
        locale: "en_US",
      },
      {
        food_name: "Cookies & Cream, Ice Cream",
        serving_unit: "cup",
        nix_brand_id: "51db37b5176fe9790a89884b",
        brand_name_item_name: "Nestle Cookies & Cream, Ice Cream",
        serving_qty: 0.5,
        nf_calories: 130,
        photo: {
          thumb:
            "https://nutritionix-api.s3.amazonaws.com/548b0dc0d4c416a1533bf524.jpeg",
        },
        brand_name: "Nestle",
        region: 1,
        brand_type: 2,
        nix_item_id: "548b0982d4c416a1533bf3ea",
        locale: "en_US",
      },
      {
        food_name: "Cookies 'N' Cream Shake, Regular",
        serving_unit: "oz",
        nix_brand_id: "578d5111376674a841248bf6",
        brand_name_item_name:
          "Marble Slab Creamery Cookies 'N' Cream Shake, Regular",
        serving_qty: 20,
        nf_calories: 1260,
        photo: {
          thumb:
            "https://d2eawub7utcl6.cloudfront.net/images/nix-apple-grey.png",
          highres: null,
          is_user_uploaded: false,
        },
        brand_name: "Marble Slab Creamery",
        region: 1,
        brand_type: 1,
        nix_item_id: "152173456481460d87e6fa7e",
        locale: "en_US",
      },
      {
        food_name: "Cookies 'N Cream Protein Bar",
        serving_unit: "bar",
        nix_brand_id: "5a585e1a10f9398d7bdf3478",
        brand_name_item_name: "No Cow Cookies 'N Cream Protein Bar",
        serving_qty: 1,
        nf_calories: 200,
        photo: {
          thumb:
            "https://nutritionix-api.s3.amazonaws.com/5f8460b391ea310e2174ada0.jpeg",
        },
        brand_name: "No Cow",
        region: 1,
        brand_type: 2,
        nix_item_id: "5f8460b13f7e2a3947c5c977",
        locale: "en_US",
      },
      {
        food_name: "Ice Cream, Cookies 'N Cream",
        serving_unit: "cup",
        nix_brand_id: "51db37e9176fe9790a89a7b2",
        brand_name_item_name: "Edy's Ice Cream, Cookies 'N Cream",
        serving_qty: 0.6700000166893005,
        nf_calories: 190,
        photo: {
          thumb:
            "https://nutritionix-api.s3.amazonaws.com/5ed685c3e3adc3f45c948d90.jpeg",
        },
        brand_name: "Edy's",
        region: 1,
        brand_type: 2,
        nix_item_id: "51d2fce1cc9bff111580e6db",
        locale: "en_US",
      },
      {
        food_name: "Cookies & Cream Fit Snacks Protein Bar",
        serving_unit: "bar",
        nix_brand_id: "5b05124afac17ad23b34b4a4",
        brand_name_item_name: "Alani Nu Cookies & Cream Fit Snacks Protein Bar",
        serving_qty: 1,
        nf_calories: 180,
        photo: {
          thumb:
            "https://nutritionix-api.s3.amazonaws.com/5ff86532228307d8289435fb.jpeg",
        },
        brand_name: "Alani Nu",
        region: 1,
        brand_type: 2,
        nix_item_id: "5ff86530fec2a13721afd279",
        locale: "en_US",
      },
      {
        food_name: "Cookies 'N' Cream Shake, Small",
        serving_unit: "oz",
        nix_brand_id: "578d5111376674a841248bf6",
        brand_name_item_name:
          "Marble Slab Creamery Cookies 'N' Cream Shake, Small",
        serving_qty: 12,
        nf_calories: 940,
        photo: {
          thumb:
            "https://d2eawub7utcl6.cloudfront.net/images/nix-apple-grey.png",
          highres: null,
          is_user_uploaded: false,
        },
        brand_name: "Marble Slab Creamery",
        region: 1,
        brand_type: 1,
        nix_item_id: "15217345c69f3cfb24dfcc18",
        locale: "en_US",
      },
      {
        food_name: "Cookies N' Cream Brownie",
        serving_unit: "each",
        nix_brand_id: "513fbc1283aa2dc80c00029c",
        brand_name_item_name: "Nestle Tollhouse Cafe Cookies N' Cream Brownie",
        serving_qty: 1,
        nf_calories: 680,
        photo: {
          thumb:
            "https://d2eawub7utcl6.cloudfront.net/images/nix-apple-grey.png",
          highres: null,
          is_user_uploaded: false,
        },
        brand_name: "Nestle Tollhouse Cafe",
        region: 1,
        brand_type: 1,
        nix_item_id: "d3ea727450c432d1498cbb2d",
        locale: "en_US",
      },
      {
        food_name: "Cookies 'N Cream Nutritional Shake Mix",
        serving_unit: "scoops",
        nix_brand_id: "54cd07f7b08e2b1270b83302",
        brand_name_item_name:
          "Herbalife Cookies 'N Cream Nutritional Shake Mix",
        serving_qty: 2,
        nf_calories: 90,
        photo: {
          thumb:
            "https://nutritionix-api.s3.amazonaws.com/60afa4d73831630006547290.jpeg",
        },
        brand_name: "Herbalife",
        region: 1,
        brand_type: 2,
        nix_item_id: "60afa4d6383163000654728f",
        locale: "en_US",
      },
      {
        food_name: "Muscle Fusion, Cookies & Cream",
        serving_unit: "scoop",
        nix_brand_id: "51db37ca176fe9790a899764",
        brand_name_item_name: "Nutrabolics Muscle Fusion, Cookies & Cream",
        serving_qty: 1,
        nf_calories: 162,
        photo: {
          thumb:
            "https://nutritionix-api.s3.amazonaws.com/5e12e292add468b214746206.jpeg",
        },
        brand_name: "Nutrabolics",
        region: 1,
        brand_type: 2,
        nix_item_id: "5e12e28f3810b85254bd4218",
        locale: "en_US",
      },
      {
        food_name: "Cashewmilk Ice Cream, Chocolate Cookies 'N' Cream",
        serving_unit: "cup",
        nix_brand_id: "51db37bc176fe9790a898e56",
        brand_name_item_name:
          "So Delicious Cashewmilk Ice Cream, Chocolate Cookies 'N' Cream",
        serving_qty: 0.5,
        nf_calories: 250,
        photo: {
          thumb:
            "https://nutritionix-api.s3.amazonaws.com/5f22711537b648d822c31e8b.jpeg",
        },
        brand_name: "So Delicious",
        region: 1,
        brand_type: 2,
        nix_item_id: "582d56b8045c495706942b00",
        locale: "en_US",
      },
      {
        food_name: "Protein Drink, Cookies n' Cream",
        serving_unit: "fl oz",
        nix_brand_id: "5a45e8ed499755a0401da541",
        brand_name_item_name: "Owyn Protein Drink, Cookies n' Cream",
        serving_qty: 12,
        nf_calories: 180,
        photo: {
          thumb:
            "https://nutritionix-api.s3.amazonaws.com/60a90cd450dabf0009e4b556.jpeg",
        },
        brand_name: "Owyn",
        region: 1,
        brand_type: 2,
        nix_item_id: "5cb57fce5aaa467d201ec2a6",
        locale: "en_US",
      },
      {
        food_name: "Cookies N' Cream Ice Cream, 2 Scoop",
        serving_unit: "Serving",
        nix_brand_id: "51db37bc176fe9790a898e2c",
        brand_name_item_name:
          "Oberweis Dairy Cookies N' Cream Ice Cream, 2 Scoop",
        serving_qty: 1,
        nf_calories: 790,
        photo: {
          thumb:
            "https://d2eawub7utcl6.cloudfront.net/images/nix-apple-grey.png",
          highres: null,
          is_user_uploaded: false,
        },
        brand_name: "Oberweis Dairy",
        region: 1,
        brand_type: 1,
        nix_item_id: "52cdd091051cb9eb320123e9",
        locale: "en_US",
      },
      {
        food_name: "Cookies N' Cream Ice Cream, Kid Scoop",
        serving_unit: "Serving",
        nix_brand_id: "51db37bc176fe9790a898e2c",
        brand_name_item_name:
          "Oberweis Dairy Cookies N' Cream Ice Cream, Kid Scoop",
        serving_qty: 1,
        nf_calories: 240,
        photo: {
          thumb:
            "https://d2eawub7utcl6.cloudfront.net/images/nix-apple-grey.png",
          highres: null,
          is_user_uploaded: false,
        },
        brand_name: "Oberweis Dairy",
        region: 1,
        brand_type: 1,
        nix_item_id: "d3ea08413a9591105b3f8089",
        locale: "en_US",
      },
      {
        food_name: "Cookies 'N' Cream",
        serving_unit: "cup",
        nix_brand_id: "513fbc1283aa2dc80c00015c",
        brand_name_item_name: "Golden Corral Cookies 'N' Cream",
        serving_qty: 0.25,
        nf_calories: 70,
        photo: {
          thumb:
            "https://d2eawub7utcl6.cloudfront.net/images/nix-apple-grey.png",
          highres: null,
          is_user_uploaded: false,
        },
        brand_name: "Golden Corral",
        region: 1,
        brand_type: 1,
        nix_item_id: "152116031c3e35883d7fa948",
        locale: "en_US",
      },
      {
        food_name: "Cookies N Cream",
        serving_unit: "g",
        nix_brand_id: "513fbc1283aa2dc80c000b92",
        brand_name_item_name: "Yogli Mogli Cookies N Cream",
        serving_qty: 83,
        nf_calories: 110,
        photo: {
          thumb:
            "https://d2eawub7utcl6.cloudfront.net/images/nix-apple-grey.png",
          highres: null,
          is_user_uploaded: false,
        },
        brand_name: "Yogli Mogli",
        region: 1,
        brand_type: 1,
        nix_item_id: "513fc9cb673c4fbc26005176",
        locale: "en_US",
      },
    ],
  };

  useEffect(() => {
    async function getMeals() {
      const prevSearchQuery = localStorage.getItem("searchQuery");

      if (prevSearchQuery) setSearchQuery(prevSearchQuery);
     
      let meals;
      // let meals = [...mealsObj.common, ...mealsObj.branded];
      if (products.length === 0) {
        meals = JSON.parse(localStorage.getItem("searchedMeals"));

        if (!meals) return; // only show the table if something we have meals
      } else {
        meals = products;
      }

      let likifiedSearchResponse = await likify.getLikifiedMeals(meals);
      likifiedSearchResponse = await isMealAdded(likifiedSearchResponse);

      setProducts(likifiedSearchResponse);
      setProducts(meals);
      setTableVisible(true);
    }
    getMeals();
  }, []);

  const handleChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const isMealAdded = async (array) => {
    let localUserMeals = [];
    localUserMeals = getLocalUserMeals();
    try {
      if (localUserMeals.length === 0) {
        const res = await getCreatedMeals();
        localUserMeals = res.data;
      }
    } catch (error) {
      localUserMeals = [];
    } finally {
      const keysForMealsAdded = localUserMeals.reduce(function (obj, hash) {
        obj[hash.fields.item_id] = true;
        return obj;
      }, {});

      for (const i in array) {
        if (keysForMealsAdded[array[i].fields.item_id]) {
          array[i].fields.added = true;
        } else {
          array[i].fields.added = false;
        }

        array[i].fields.addedComponent = (
          <AddedIcon added={array[i].fields.added} />
        );
      }
      return array;
    }
  };

  const getProducts = async () => {
    try {
      setTableVisible(false); // A new search should allow for a new loading logo & table
      setPlayLottie(true);

      const { data: usersCreatedMeals } = await filterCreatedMeals(searchQuery);
      let possibleMeals = [...usersCreatedMeals];

      const result = await nutritionixService.getMealByName(searchQuery);
      console.log(result);
      possibleMeals = [
        ...possibleMeals,
        ...result.data.common,
        ...result.data.branded,
      ];

      localStorage.setItem("searchedMeals", JSON.stringify(possibleMeals));
      setProducts(possibleMeals);
      // let likifiedSearchResponse = await likify.getLikifiedMeals(possibleMeals);

      // try {
      //   likifiedSearchResponse = await isMealAdded(likifiedSearchResponse);
      // } catch (error) {}
      // console.log("Likified Search Response");
      // setProducts(likifiedSearchResponse);

      setPlayLottie(false);
      setTableVisible(true);
    } catch (error) {
      toast.error("An error has occurred");
      console.log(error);
      setPlayLottie(false);
    }
  };

  const handleClick = () => {
    try {
      if (searchQuery === "") {
        toast.warning("Input a value into the search field");
        return;
      }
      localStorage.setItem("searchQuery", searchQuery);
      getProducts();
    } catch (error) {
      toast.error("Something's gone wrong ...");
    }
  };

  return (
    <div>
      <Search
        className="col-md-6 offset-md-3 d-flex mt-4 mb-4"
        onChange={handleChange}
        onClick={handleClick}
        value={searchQuery}
        placeholder="Search by Name or Brand"
      />
      {playLottie ? <UncontrolledLottie animationData={animationData} /> : null}
      {tableVisible && (
        <PaginatedMealDisplay
          products={products}
          pageLimit={12}
          pageNeighbors={1}
        />
      )}
    </div>
  );
}

export default SearchMealsDisplay;
