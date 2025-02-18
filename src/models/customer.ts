const Joi = require('joi');
const mongoose = require('mongoose');
import { Schema, model } from 'mongoose';
import { ICustomer } from '../interfaces';

const Customer = model<ICustomer>('Customer', new Schema<ICustomer>({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  },
  isGold: {
    type: Boolean,
    default: false
  },
  phone: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  }
}));

function validateCustomer(customer: ICustomer) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    phone: Joi.string().min(5).max(50).required(),
    isGold: Joi.boolean()
  });
  const result = schema.validate(customer);
  if (result.error) {
    result.status(400).send('Validation failed: ' +result.error.details[0].message);
    return;
  }
  return result;
}

exports.Customer = Customer; 
exports.validate = validateCustomer;