import React from "react";
import GoogleLogin from "react-google-login";
import * as userService from "../services/userService";
import auth from "../services/authService";
import {
  setLocalUserMeals,
  createUserMealsDocument,
  getCreatedMeals,
  getLocalUserMeals,
} from "../services/mealService";
import { useHistory } from "react-router-dom";

function GoogleButton(props) {
  let history = useHistory();

  const googleResponse = async (res) => {
    try {
      console.log("google response is occurring");
      const serverObj = {
        name: res.profileObj.name,
        email: res.profileObj.email,
        googleId: res.profileObj.googleId,
      };

      // When user is registering they should have an account created
      if (!props.login) {
        const response = await userService.registerWithGoogle(serverObj);
        auth.loginWithJwt(response.headers["x-auth-token"]);
        await createUserMealsDocument();
        setLocalUserMeals([]);

        window.location = "/dietinformation";
        return;
      }

      await auth.loginWithGoogle(serverObj);

      const userMeals = getLocalUserMeals();

      if (userMeals.length === 0) {
        const { data } = await getCreatedMeals();
        setLocalUserMeals(data);
      }

      history.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <GoogleLogin
      clientId="589525244188-og8g1p6d0ul9g50i3jggvadsac30bslf.apps.googleusercontent.com"
      buttonText="Login with Google"
      render={(renderProps) => (
        <button
          onClick={renderProps.onClick}
          className="btn-google btn-user btn-block"
        >
          <i className="fab fa-google fa-fw pr-1"></i>
          {props.login ? "Login with Google" : "Register with Google"}
        </button>
      )}
      onSuccess={googleResponse}
      onFailure={googleResponse}
      cookiePolicy={"single_host_origin"}
    />
  );
}

export default GoogleButton;
