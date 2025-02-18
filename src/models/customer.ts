const Joi = require('joi');
import { Schema, model, Types } from 'mongoose';
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

const customerValidationSchema = Joi.object({
  name: Joi.string().min(5).max(50).required(),
  phone: Joi.string().min(5).max(50).required(),
  isGold: Joi.boolean()
});

function validateCustomer(customer: ICustomer) {
  //Joi validation
  const { error } = customerValidationSchema.validate(customer);
  if (error) return { error: error.details[0].message };

  //check if the customerId and movieId are valid
  if (!customer._id || !Types.ObjectId.isValid(customer._id)) 
    return { error: 'Invalid customer ID.' };

  //additional validation
  if (!customer.name) return { error: 'Name is required.' };
  if (!customer.phone) return { error: 'Phone is required.' };
  
  return { error: null };
};

exports.Customer = Customer; 
exports.validate = validateCustomer;