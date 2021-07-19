import React from "react";
import FacebookLogin from "react-facebook-login";
import * as userService from "../services/userService";
import auth from "../services/authService";
import {
  setLocalUserMeals,
  createUserMealsDocument,
  getUserMeals,
  getLocalUserMeals,
} from "../services/mealService";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";

function FacebookButton(props) {
  let history = useHistory();
  const facebookResponse = async (res) => {
    console.log(res);
    try {
      const serverObj = {
        name: res.name,
        email: res.email,
        id: res.id,
      };

      if (!props.login) {
        const response = await userService.registerWithFacebook(serverObj);
        auth.loginWithJwt(response.headers["x-auth-token"]);
        await createUserMealsDocument();
        setLocalUserMeals([]);

        window.location = "/dietinformation";
        return;
      }

      await auth.loginWithFacebook(serverObj);

      const userMeals = getLocalUserMeals();

      if (userMeals.length === 0) {
        const { data } = await getUserMeals();
        setLocalUserMeals(data);
      }

      history.push("/");
    } catch (error) {
      console.log(error.response);

      if (error.response.data) return toast.error(error.response.data);
      return toast.error("An unexpected error has occured");
    }
  };

  return (
    <FacebookLogin
      //Test Appid
      appId="859542941576183"
      autoLoad={false}
      fields="name,email"
      callback={facebookResponse}
      textButton={
        props.login ? "Login with Facebook" : "Register with Facebook"
      }
      cssClass="btn-facebook btn-user btn-block"
      icon="fab fa-facebook-f fa-fw "
    />
  );
}

export default FacebookButton;
