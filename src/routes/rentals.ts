const { Rental, validate } = require('../models/rental');
const { Movie } = require('../models/movie');
const { Customer } = require('../models/customer');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

import type { Request, Response } from 'express';

//get all rentals
router.get('/', async (req: Request, res: Response) => {
  const rentals = await Rental.find().sort('-dateOut');
  res.send(rentals);
});

//create a new rental
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

  //create session
  const session = await Rental.startSession();
  if (!session) return res.status(400).send('Failed to create session.');
  session.startTransaction();

  //try to create a new rental object
  try {
    //create a new rental object
    const rental = new Rental({ 
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

    //save the rental
    await rental.save({ session });

    //update the movie
    movie.numberInStock--;
    await movie.save({ session });
    
    //commit the transaction
    await session.commitTransaction();
    res.status(201).send(rental);
  }
  //catch any errors
  catch (error) {
    //rollback the transaction if an error occurs
    await session.abortTransaction();
    session.endSession();
    res.status(500).send('Internal server error');
  }
});

module.exports = router;