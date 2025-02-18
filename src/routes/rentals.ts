const { Rental, validate } = require('../models/rental');
const { Movie } = require('../models/movie');
const { Customer } = require('../models/customer');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

import type { Request, Response } from 'express';

router.get('/', async (req: Request, res: Response) => {
  const rentals = await Rental.find().sort('-dateOut');
  res.send(rentals);
});

router.post('/', async (req: Request, res: Response) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  //check if the customer exists in the database
  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(400).send('Invalid genre.');

  //check if the movie exists in the database
  const movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(400).send('Invalid movie.');

  if (movie.numberInStock === 0) return res.status(400).send('Movie not in stock.');

  //create a new rental object
  let rental = new Rental({ 
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone,
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate
    }
  });
  rental = await rental.save();

  movie.numberInStock--;
  await movie.save();
  
  res.send(rental);
});

router.put('/:id', async (req: Request, res: Response) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  const rental = await Rental.findByIdAndUpdate(req.params.id, { name: req.body.name }, {
    new: true
  });

  if (!rental) return res.status(404).send('The Rental with the given ID was not found.');
  
  res.send(rental);
});

router.delete('/:id', async (req: Request, res: Response) => {
  const rental = await Rental.findByIdAndRemove(req.params.id);

  if (!rental) return res.status(404).send('The Rental with the given ID was not found.');

  res.send(rental);
});

router.get('/:id', async (req: Request, res: Response) => {
  const rental = await Rental.findById(req.params.id);

  if (!rental) return res.status(404).send('The Rental with the given ID was not found.');

  res.send(rental);
});

module.exports = router;