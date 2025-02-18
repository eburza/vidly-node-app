const Joi = require('joi');
import { Schema, Types, model } from 'mongoose';
import { IMovie } from '../interfaces';
const { genreSchema } = require('./genre')

//mongoose schema
const movieSchema = new Schema<IMovie>({
  title: {
    type: String,
    required: true,
    trim: true, // removes whitespace from the titles of the movies
    minlength: 5,
    maxlength: 255
  },
  genre: {
    type: genreSchema,
    required: true
  },
  numberInStock: {
    type: Number,
    required: true,
    min: 0, //dont want to allow negative numbers
    max: 255
  },
  dailyRentalRate: {
    type: Number,
    required: true,
    min: 0,
    max: 255
  }
})

const Movie = model<IMovie>('Movies', movieSchema);

//Joi validation
const movieValidationSchema = Joi.object({
  title: Joi.string().min(5).max(255).required(),
  genreId: Joi.objectId().required(),
  numberInStock: Joi.number().min(0).required(),
  dailyRentalRate: Joi.number().min(0).required()
});

function validateMovie(movie: IMovie) {
  //Joi validation
   const { error } = movieValidationSchema.validate(movie);
  if (error) return { error: error.details[0].message };

  //check if movieId is valid
  if (!movie._id || !Types.ObjectId.isValid(movie._id)) 
    return { error: 'Invalid movie ID.' };

  //additional validation
  if (!movie) return { error: 'Movie is required.' };
  
  return { error: null };
};

exports.Movie = Movie;
exports.validate = validateMovie;