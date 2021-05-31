require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const mealsController = require("./controllers/meals-controller");
const userController = require("./controllers/user-controller");
app.use(express.json());
app.use(cors());
app.use("/meals", mealsController);
app.use("/users", userController);

app.use((err, req, res, next) => {
  res.status(500).send("Internal Server Error!");
});

app.listen(process.env.PORT || 5000);
