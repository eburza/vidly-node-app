const { Movie, validate } = require('../models/movie');
const { Genre } = require('../models/genre');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  const movies = await Movie.find().sort('name');
  res.send(movies);
});

router.post('/', async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  //check if the genre exists in the database, it also has version property
  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send('Invalid genre.');

  //create a new movie
  let Movie = new Movie({ 
    title: req.body.title,
    //genre with _id and name, not the whole genre object
    genre: {
      _id: genre._id,
      name: genre.name
    },
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate
  });
  Movie = await Movie.save();
  
  res.send(Movie);
});

router.put('/:id', async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  const Movie = await Movie.findByIdAndUpdate(req.params.id, { name: req.body.name }, {
    new: true
  });

  if (!Movie) return res.status(404).send('The Movie with the given ID was not found.');
  
  res.send(Movie);
});

router.delete('/:id', async (req, res) => {
  const Movie = await Movie.findByIdAndRemove(req.params.id);

  if (!Movie) return res.status(404).send('The Movie with the given ID was not found.');

  res.send(Movie);
});

router.get('/:id', async (req, res) => {
  const Movie = await Movie.findById(req.params.id);

  if (!Movie) return res.status(404).send('The Movie with the given ID was not found.');

  res.send(Movie);
});

module.exports = router;