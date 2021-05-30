require('dotenv').config();
const express = require('express');
const app = express();
const mealsController = require('./controllers/meals-controller');
const userController = require('./controllers/user-controller');
app.use(express.json());
app.use('/meals', mealsController);
app.use('/users', userController);
app.listen(process.env.PORT || 3000);