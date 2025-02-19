const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const express = require('express');
const router = express.Router();
const { Genre, validate } = require('../models/genre');

import type { Request, Response } from 'express';

router.get('/', async (req: Request, res: Response) => {
  const genres = await Genre.find().sort('name');
  res.send(genres);
});

//add the auth middleware to the post route, so that only authenticated users can access this route
router.post('/', auth, async (req: Request, res: Response) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error);

  const genre = new Genre({ name: req.body.name });
  await genre.save();
  
  res.send(genre);
});

router.put('/:id', auth, async (req: Request, res: Response) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error);

  const genre = await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name }, {
    new: true
  });

  if (!genre) return res.status(404).send('The genre with the given ID was not found.');
  
  res.send(genre);
});

//add the auth and admin middleware to the delete route, so that only authenticated users with admin privileges can access this route
//middleware functions are executed in the order they are added
router.delete('/:id', [auth, admin], async (req: Request, res: Response) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error);
  
  const genre = await Genre.findByIdAndRemove(req.params.id);

  if (!genre) return res.status(404).send('The genre with the given ID was not found.');

  res.send(genre);
});

router.get('/:id', async (req: Request, res: Response) => {
  const genre = await Genre.findById(req.params.id);

  if (!genre) return res.status(404).send('The genre with the given ID was not found.');

  res.send(genre);
});

module.exports = router;