const Joi = require('joi');

import { Schema, model , Types} from 'mongoose';
import { IRental } from '../interfaces';

const rentalSchema = new Schema<IRental>({
  //create new schema for customer instead of one using in customer model
  // not all properties in object are needed
  customer: {
    type: new Schema({
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
    }),
    required: true
  },
  movie: {
    type: new Schema({
      title: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 255
      },
      dailyRentalRate: {
        type: Number,
        required: true,
        min: 0,
        max: 255
      }
    }),
    required: true
  },
  dateOut: {
    type: Date,
    required: true,
    default: Date.now
  },
  dateReturned: {
    type: Date,
  },
  rentalFee: {
    type: Number,
    min: 0
  }
});

const Rental = model<IRental>('Rental', rentalSchema);

const rentalValidationSchema = Joi.object({
  customerId: Joi.string().required(),
  movieId: Joi.string().required(),
  dateOut: Joi.date().default(Date.now),
  dateReturned: Joi.date(),
  rentalFee: Joi.number().min(0)
});

function validateRental(rental: IRental) {
  //Joi validation
  const { error } = rentalValidationSchema.validate(rental);
  if (error) return { error: error.details[0].message };

  //check if the customerId and movieId are valid
  if (!rental.customer?._id || !Types.ObjectId.isValid(rental.customer._id)) 
    return { error: 'Invalid customer ID.' };
  if (!rental.movie?._id || !Types.ObjectId.isValid(rental.movie._id)) 
    return { error: 'Invalid movie ID.' };

  //additional validation
  if (!rental.customer) return { error: 'Customer is required.' };
  if (!rental.movie) return { error: 'Movie is required.' };
  
  return { error: null };
};

exports.Rental = Rental;
exports.validate = validateRental;