const lodash = require('lodash'); // object manipulation
//const { passwordStrength } = require('check-password-strength') // password strength check
const bcrypt = require('bcrypt'); // password hashing
const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();
const { User, validate } = require('../models/user');

import type { Request, Response } from 'express';

router.get('/', async (req: Request, res: Response) => {
  const users = await User.find().sort('name');
  res.send(users);
});

router.post('/', async (req: Request, res: Response) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error);

  //Check if the password is strong
  // const passwordCheck = passwordStrength(req.body.password);

  // if (passwordCheck < 2) { // 0 = Too weak, 1 = Weak, 2 = Medium, 3 = Strong
  //   return res.status(400).send({
  //     error: 'Password is too weak. Password must contain uppercase, lowercase, numbers and special characters.'
  //   });
  // }

  //check if the user already exists
  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send('User already registered.');

  user = new User(lodash.pick(req.body, ['name', 'email', 'password']));
  
  //password hashing
  const salt = await bcrypt.genSalt(10); // generate a salt to make the password more secure
  const hashedPassword = await bcrypt.hash(user.body.password, salt); // hash the password
  user.password = hashedPassword; // replace the password with the hashed password

  await user.save();

  //generate json web token
  const token = user.generateAuthToken();

  //send the token to the client
  res.header('x-auth-token', token).send(lodash.pick(user, ['_id', 'name', 'email']));
});

//get the current user
router.get('/me', auth, async (req: Request, res: Response) => {
  //get the user id from the request, exclude the password
  const user = await User.findById(req.user._id).select('-password');
  res.send(user);
});

module.exports = router;