const pool = require('./pool');

module.exports = {
  async insert(mealDetails) {
    try {
      const { name, calories, userId, scheduleTime } =
        mealDetails;
      const { rows } = await pool.query(
        `INSERT INTO public.meals(name, calories, created_by, modified_by ${scheduleTime ? ', schedule_time' : ''}) VALUES('${name}', ${calories}, '${userId}', '${userId}' ${scheduleTime ?  `, '${scheduleTime}'` : ''})`
      );
      return rows;
    } catch (error) {
      throw new Error('Error occurred creating user Details');
    }
  },
  async updateById(mealId, fields) {
    try {
      const {
        name = null,
        calories = null,
        userId,
        scheduleTime,
      } = fields;
      let query = `UPDATE public.meals SET `;
      let hasUpdates = false;
      if (name) {
           hasUpdates = true;
           query += `name = '${name}'`;
      }
      if (calories) {
          query += `${hasUpdates ? ',' : ''} calories = '${calories}'`;
      }
      if (scheduleTime) {
          query += `${hasUpdates ? ',' : ''} schedule_time = '${scheduleTime}'`;
      }
      if (hasUpdates) {
          query += `, modified_on = '${new Date().toISOString()}', modified_by = '${userId}'  WHERE id = '${mealId}'`;
          await pool.query(query);
      }
    } catch (error) {
      console.log('ERROR', error.message);
      throw new Error('Error occured modifying meal Details');
    }
  },
  async getMealsByUserId(userId, date, mealId){
      try {
         const { rows }  = await pool.query(`SELECT id, name, calories, created_on, modified_on, schedule_time FROM public.meals WHERE modified_by = '${userId}' ${date ? ` AND  cast(schedule_time as date) = '${date}'` : ''}
         ${mealId ? ` AND id = '${mealId}'` : ''} `);
         return rows;
      } catch (error) {
        console.log('ERROR', error);
        throw new Error('Error occured while getting meals by user id');
      }
  },
  async deleteById(mealId) {
    try {
      await pool.query(`DELETE from public.meals WHERE id = '${mealId}'`);
   } catch (error) {
     throw new Error('Error occured while deleting meals by id');
   }
  }
};
