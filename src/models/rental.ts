const Joi = require('joi');

import { Schema, model } from 'mongoose';
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

function validateRental(rental: IRental) {
  const schema = Joi.object(  {
    customerId: Joi.string().required(),
    movieId: Joi.string().required()
  });
  const result = schema.validate(rental);
  if (result.error) {
    result.status(400).send('Validation failed: ' +result.error.details[0].message);
    return;
  }
  return result;
}

const Rental = model<IRental>('Rental', rentalSchema);

exports.Rental = Rental;
exports.validate = validateRental;