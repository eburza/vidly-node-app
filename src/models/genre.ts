const Joi = require('joi');
const mongoose = require('mongoose');
import { Schema, model } from 'mongoose';
import { IGenre } from '../interfaces';

//mongoose schema
const genreSchema = new Schema<IGenre>({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  }
})

const Genre = model<IGenre>('Genre', genreSchema);

//Joi schema for validation
function validateGenre(genre: IGenre) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required()
  });
  const result = schema.validate(genre);
  if (result.error) {
    result.status(400).send('Validation failed: ' +result.error.details[0].message);
    return;
  }
  return result;
}

exports.genreSchema = genreSchema; 
exports.Genre = Genre; 
exports.validate = validateGenre;