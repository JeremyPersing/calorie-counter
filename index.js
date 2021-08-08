const dotenv = require("dotenv").config();
const { UserMeals } = require("./models/userMeals");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const mongoose = require("mongoose");
const cron = require("node-cron");
const express = require("express");
const cors = require("cors");
const userMeals = require("./routes/userMeals");
const users = require("./routes/users");
const auth = require("./routes/auth");
const userStats = require("./routes/userStats");
const pixabay = require("./routes/pixabay");
const path = require("path");
const app = express();

if (!process.env.jwtPrivateKey) {
  console.log("FATAL ERROR jwtPrivateKey is not defined");
  process.exit(1);
}

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Error occurred"));

app.use(cors());
app.use(express.json());
app.use("/api/usermeals", userMeals);
app.use("/api/users", users);
app.use("/api/auth", auth);
app.use("/api/userstats", userStats);
app.use("/api/pixabay", pixabay);

cron.schedule("0 0 * * 0-6", async () => {
  try {
    await UserMeals.updateMany({}, { $set: { consumed_meals: [] } });
    console.log("Consumed Meals All deleted");
  } catch (error) {
    console.log("error in deleting conumed meals for the day", error);
  }
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/client/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
  });
}

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log("Listening on port " + port);
});
