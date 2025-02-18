const Joi = require('joi');
const mongoose = require('mongoose');
import { Schema, model } from 'mongoose';
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

//Joi schema for validation
function validateMovie(movie: IMovie) {
  const schema = {
    title: Joi.string().min(5).max(255).required(),
    genreId: Joi.objectId().required(),
    numberInStock: Joi.number().min(0).required(),
    dailyRentalRate: Joi.number().min(0).required()
  }

  return Joi.validate(movie, schema);
}

exports.Movie = Movie;
exports.validate = validateMovie;