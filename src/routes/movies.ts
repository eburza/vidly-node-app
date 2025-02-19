const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const asyncMiddleware = require('../middleware/asyncMiddleware');
const { Movie, validate } = require('../models/movie');
const { Genre } = require('../models/genre');
const express = require('express');
const router = express.Router();

import type { Request, Response } from 'express';

router.get('/', asyncMiddleware(async (req: Request, res: Response) => {
  const movies = await Movie.find().sort('name');
  res.send(movies);
}));

router.post('/', auth, asyncMiddleware(async (req: Request, res: Response) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error);

  //check if the genre exists in the database, it also has version property
  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send('Invalid genre.');

  //create a new movie
  const movie = new Movie({ 
    title: req.body.title,
    //genre with _id and name, not the whole genre object
    genre: {
      _id: genre._id,
      name: genre.name
    },
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate
  });
  await movie.save();
  
  res.send(movie);
}));

router.put('/:id', auth, asyncMiddleware(async (req: Request, res: Response) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error);

  const movie = await Movie.findByIdAndUpdate(req.params.id, { name: req.body.name }, {
    new: true
  });

  if (!Movie) return res.status(404).send('The Movie with the given ID was not found.');
  
  res.send(Movie);
}));

//add the auth and admin middleware to the delete route, so that only authenticated users with admin privileges can access this route
router.delete('/:id', [auth, admin], asyncMiddleware(async (req: Request, res: Response) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error);
  
  const movie = await Movie.findByIdAndRemove(req.params.id);

  if (!movie) return res.status(404).send('The Movie with the given ID was not found.');

  res.send(Movie);
}));

router.get('/:id', asyncMiddleware(async (req: Request, res: Response) => {
  const movie = await Movie.findById(req.params.id);

  if (!movie) return res.status(404).send('The Movie with the given ID was not found.');

  res.send(movie);
}));

module.exports = router;