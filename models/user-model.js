const pool = require('./pool');
const bcrypt  = require('bcrypt');

module.exports = {
  async insert(userDetails) {
    try {
      const { firstName, lastName, middleName, username, password } =
        userDetails;
      const result = await pool.query(
        `INSERT INTO public.users(username, password, first_name, last_name ${middleName ? ', middle_name' : '' }) VALUES('${username.toLowerCase()}', '${bcrypt.hashSync(password, 10)}', '${firstName}', '${lastName}' ${
          middleName ? `, '${middleName}'` : ''
        })`
      );
      return result;
    } catch (error) {
      console.log(error);
      throw new Error("Error occurred creating user Details");
    }
  },
  async updateById(userId, fields) {
    try {
      const {
        firstName = null,
        lastName = null,
        middleName = null,
        username = null,
        password = null,
      } = fields;
      let query = `UPDATE public.users SET `;
      let hasUpdates = false;
      if (firstName) {
        hasUpdates = true;
        query += `first_name = '${firstName}'`;
      }
      if (lastName) {
        query += `${hasUpdates ? "," : ""} last_name = '${lastName}'`;
        hasUpdates = true;
      }
      if (middleName) {
        query += `${hasUpdates ? "," : ""}  middle_name = '${middleName}'`;
        hasUpdates = true;
      }
      if (username) {
        query += `${hasUpdates ? "," : ""}  username = '${username}' `;
        hasUpdates = true;
      }
      if (password) {
        query += `${hasUpdates ? "," : ""} password = '${bcrypt.hashSync(password, 10)}'`;
        hasUpdates = true;
      }
      if (hasUpdates) {
        query += `, modified_on = '${new Date().toISOString()}' WHERE id = '${userId}'`;
        await pool.query(query);
      }
    } catch (error) {
      console.log(error);
      throw new Error("Error occured modifying user Details");
    }
  },
  async getUserById(userId) {
    try {
      const { rows } = await pool.query(
        `SELECT first_name, last_name, middle_name, username FROM public.users WHERE id = '${userId}'`
      );
      return rows;
    } catch (error) {
      console.log(error);
      throw new Error("Error occured while getting user by id");
    }
  },
  async getUserByUsername(username, showPassword) {
    try {
       const { rows } = await pool.query(`SELECT id, first_name, last_name, middle_name, username ${showPassword ? ', password' : ''} FROM public.users WHERE username = '${username}' `);
       return rows;
    } catch (error) {
        console.log(error);
        throw new Error('Error occured while getting user details by username');
    }
  }
};
