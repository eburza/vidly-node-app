const Joi = require('joi');
import { Schema, model, Types } from 'mongoose';
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
const genreValidationSchema = Joi.object({
  name: Joi.string().min(5).max(50).required()
});

function validateGenre(genre: IGenre) {
  //Joi validation
  const { error } = genreValidationSchema.validate(genre);
  if (error) return { error: error.details[0].message };

  //check if the genre is valid
  if (!genre._id || !Types.ObjectId.isValid(genre._id)) 
    return { error: 'Invalid genre ID.' };

  //additional validation
  if (!genre.name) return { error: 'Name is required.' };
  
  return { error: null };
};

exports.genreSchema = genreSchema; 
exports.Genre = Genre; 
exports.validate = validateGenre;