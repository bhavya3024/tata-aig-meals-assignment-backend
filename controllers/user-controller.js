const router = require('express').Router();
const User = require('../models/user-model');
const { verifyToken } = require('./middleware');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

router.post('/', async (req, res) => {
  try {
  const { firstName, lastName, middleName, username } = req.body;
  let { password } = req.body;
  let errors = '';
  if (!firstName) {
    errors += 'firstName';
  }
  if (!lastName) {
    errors += `${errors ? ',' : ''} lastName`;
  }
  if (!username) {
    errors += `${errors ? ',' : ''} username`;
  }
  if (!password) {
    errors += `${errors ? ',' : ''} password`;
  }
  if (errors) {
    return res.status(400).send(`${errors} required`);
  }
  const userNameExists = await User.getUserByUsername(username);
  if (userNameExists.length) {
    return res.status(400).send('Username already exists');
  }
  if (password) {
    password = jwt.decode(password, process.env.PASSWORD_SECRET);
  }
  const result = await User.insert({
    firstName,
    lastName,
    middleName,
    username,
    password,
  });
  return res.json(result);
} catch (error) {
  return res.status(500).send('Internal Server Error!');
}
});

router.get('/:userId', verifyToken, async (req, res) => {
 try {
  const userDetails = await User.getUserById(req.params.userId);
  if (!userDetails.length) {
    return res.status(404).send('User not found');
  }
  return res.json(userDetails);
} catch (error) {
  return res.status(500).send('Internal Server Error!');
}
});

router.patch('/:userId', verifyToken, async (req, res) => {
  try {
  const { id } = res.locals.userDetails;
  const { firstName, lastName, middleName, username } = req.body;
  if (id !== req.params.userId) {
    res.status(403).send('Cannot modify other user details');
  }
  if (username) {
    const userNameExists = await User.getUserByUsername(username);
    if (userNameExists.length) {
      return res.status(400).send('Username already exists');
    }
  }
  await User.updateById(req.params.userId, {
    firstName,
    lastName,
    middleName,
    username,
  });
  return res.sendStatus(204);
} catch (error) {
  return res.status(500).send('Internal Server Error!');
}
});

router.post('/login', async (req, res) => {
 try {
  const { username } = req.body;
  let { password } = req.body;
  if (!(username && password)) {
    return res.status(400).send('username and password both are required');
  }
  password = jwt.decode(password, process.env.PASSWORD_SECRET);
  const userDetails = await User.getUserByUsername(username, true);
  if (!userDetails.length) {
    return res.status(401).send('Invalid credentails!');
  }
  if (!bcrypt.compareSync(password, userDetails[0].password)) {
    return res.status(401).send('Invalid credentails!');
  }
  const token = jwt.sign(userDetails[0], process.env.JWT_SECRET, {
    issuer: process.env.JWT_ISSUER,
  });
  return res.json({
    token,
  });
} catch (error) {
  console.log(error);
  return res.status(500).send('Internal Server Error!');
}
});


module.exports = router;
