const bcrypt = require('bcrypt'); // password hashing
const jwt = require('jsonwebtoken'); // json web token
const config = require('config') // config file
const Joi = require('joi');
const express = require('express');
const router = express.Router();
const { User } = require('../models/user');

import type { Request, Response } from 'express';

router.get('/', async (req: Request, res: Response) => {
  const users = await User.find().sort('name');
  res.send(users);
})

router.post('/', async (req: Request, res: Response) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error);

  //check if passsword or email is correct
  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send('Invalid email or password.');

  //check if password is valid
  const validPassword = await bcrypt.compare(req.body.password, user.password); //compare text password with hash
  if (!validPassword) return res.status(400).send('Invalid email orpassword.');

  //generate json web token
  const token = jwt.sign({ _id: user._id }, config.get('jwtPrivateKey')); //sign the user id with the private key and return the token

  res.send(token);
});

//Joi validation
const userValidationSchema = Joi.object({
  email: Joi.string().min(5).max(255).required().email(),
  password: Joi.string().min(5).max(255).required()
});

function validate(req: Request) {
    const { error } = userValidationSchema.validate(req.body);
    if (error) return { error: error.details[0].message };
    
    return { error: null };
}

module.exports = router;