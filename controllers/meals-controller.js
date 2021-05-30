const router = require('express').Router();
const Meals = require('../models/meal-model');
const { verifyToken } = require('./middleware');
const moment = require('moment');

router.post('/', verifyToken, async (req, res) => {
   const { name, calories, scheduleTime } = req.body;
   const { id: userId } = res.locals.userDetails;
   let errors = '';
   if (!name) {
       errors +=  `name`;
   }
   if (!calories) {
       errors += `${errors ? ', ' : ''}calories`;
   }
   if (!scheduleTime) {
       errors += `${errors ? ', ' : ''}calories`;
   }
   if (errors) {
       return res.status(400).send(`${errors} required`);
   }
   if (isNaN(calories)) {
       return res.status(400).send('Calories should be a valid number');
   }
   if (calories < 0) {
       return res.status(400).send('Calories cannot be negative');
   }
   if (!moment(scheduleTime).isValid()) {
      return res.status(400).send('Schedule time is incorrect. Please enter in valid date format');
   }
   const meal = await Meals.insert({
       name,
       calories,
       userId,
       scheduleTime
   });
   return res.json(meal);
});

router.patch('/:mealId', verifyToken, async (req, res) => {
    const { name, calories, scheduleTime } = req.body;
    const { mealId } = req.params;
    const { id: userId }  = res.locals.userDetails;
    const mealDetails = await Meals.getMealsByUserId(userId, mealId);
    if (!mealDetails || !mealDetails.length) {
       return res.status(400).send('Meal not found');
    }
    if (calories && isNaN(calories)) {
      if (isNaN(calories)) {
        return res.status(400).send('Calories should be a valid number');
      }
      if (calories < 0) {
        return res.status(400).send('Calories cannot be negative');
      }
    }
    if (scheduleTime && !moment(scheduleTime).isValid()) {
        return res.status(400).send('Schedule time is incorrect. Please enter in valid date format');
    }
    await Meals.updateById(mealId, {
        name,
        calories,
        scheduleTime,
    });
    return res.sendStatus(200);
});

router.delete('/:mealId', verifyToken, async (req, res) => {
    const { mealId } = req.params;
    const { id: userId }  = res.locals.userDetails;
    const mealDetails = await Meals.getMealsByUserId(userId, mealId);
    if (!mealDetails || !mealDetails.length) {
       return res.status(400).send('Meal not found');
    }
    await Meals.deleteById(mealId);
    return res.sendStatus(200);
});

module.exports = router;