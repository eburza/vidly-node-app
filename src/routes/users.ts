const lodash = require('lodash'); // object manipulation
//const { passwordStrength } = require('check-password-strength') // password strength check
const bcrypt = require('bcrypt'); // password hashing
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

  res.send(lodash.pick(user, ['_id', 'name', 'email']));
});

router.put('/:id', async (req: Request, res: Response) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error);

  const user = await User.findByIdAndUpdate(req.params.id, { name: req.body.name }, {
    new: true
  });

  if (!user) return res.status(404).send('The User with the given ID was not found.');
  
res.send(lodash.pick(user, ['_id', 'name', 'email']));
});

router.delete('/:id', async (req: Request, res: Response) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error);
  
  const user = await User.findByIdAndRemove(req.params.id);

  if (!user) return res.status(404).send('The User with the given ID was not found.');

  res.send(lodash.pick(user, ['_id', 'name', 'email']));
});

router.get('/:id', async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id);

  if (!user) return res.status(404).send('The User with the given ID was not found.');

  res.send(lodash.pick(user, ['_id', 'name', 'email']));
});

module.exports = router;