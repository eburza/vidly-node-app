const Joi = require('joi');
const jwt = require('jsonwebtoken'); // json web token
const config = require('config') // config file

import { Schema, Types, model } from 'mongoose';
import { IUser } from '../interfaces';

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true //this is a unique index, it will prevent duplicate emails
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024,
  },
  isAdmin: {
    type: Boolean,
    default: false
  }
})

//add method to the user schema
userSchema.methods.generateAuthToken = function () {
  //generate a json web token
  const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, config.get('jwtPrivateKey')); //sign the user id with the private key and return the token
  return token;
}

const User = model<IUser>('User', userSchema);

const userValidationSchema = Joi.object({
  name: Joi.string().min(5).max(50).required(),
  email: Joi.string().min(5).max(255).required().email(),
  password: Joi.string().min(5).max(255).required()
})

function validateUser(user: IUser) {
    //Joi validation
    const { error } = userValidationSchema.validate(user);
    if (error) return { error: error.details[0].message };

    //check if the userID is valid
    if (!user?._id || !Types.ObjectId.isValid(user._id)) 
      return { error: 'Invalid user ID.' };

    //additional validation
    if (!user.name) return { error: 'Name is required.' };
    if (!user.email) return { error: 'Email is required.' };
    if (!user.password) return { error: 'Password is required.' };
    
    return { error: null };
}

exports.User = User;
exports.validate = validateUser;