import { BrowserRouter, Switch, Route } from "react-router-dom";
import { Redirect } from "react-router";
import { ToastContainer } from "react-toastify";
import Hero from "./pages/Hero";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Login from "./pages/Login";
import MyAccount from "./pages/MyAccount";
import MyMeals from "./pages/MyMeals";
import AddMeal from "./pages/AddMeal";
import ProtectedRoute from "./components/ProtectedRoute";
import DietInformation from "./pages/DietInformation";
import ChooseDiet from "./pages/ChooseDiet";
import Plan from "./pages/Plan";
import SpecificMeal from "./pages/SpecificMeal";
import Meals from "./pages/Meals";
import LikedMeals from "./pages/LikedMeals";
import NotFound from "./pages/NotFound";
import "./styles/App.css";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <BrowserRouter>
        <ToastContainer />
        <div>
          <Switch>
            <ProtectedRoute path="/meals/liked" component={LikedMeals} />
            <ProtectedRoute path="/meals/add" component={AddMeal} />
            <ProtectedRoute path="/meals/mine" component={MyMeals} />
            <ProtectedRoute path="/meals/search" component={Meals} />
            <ProtectedRoute path="/meals/:id" component={SpecificMeal} />
            <ProtectedRoute path="/plan" component={Plan} />
            <ProtectedRoute path="/choosediet" component={ChooseDiet} />
            <ProtectedRoute
              path="/dietinformation"
              component={DietInformation}
            />
            <ProtectedRoute path="/myaccount" component={MyAccount} />
            <Route path="/register" component={Register} />
            <Route path="/login" component={Login} />
            <Route path="/notfound" component={NotFound} />
            <Route path="/hero" component={Hero} />
            <ProtectedRoute path="/" exact component={Home} />
            <Redirect to="/notfound" />
          </Switch>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
