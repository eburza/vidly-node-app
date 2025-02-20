const auth = require('../middleware/auth');
const asyncMiddleware = require('../middleware/asyncMiddleware');
const {Customer, validate} = require('../models/customer'); 
const express = require('express');
const router = express.Router();

import type { Request, Response } from 'express';

router.get('/', asyncMiddleware(async (req: Request, res: Response) => {
  const customers = await Customer.find().sort('name');
  res.send(customers);
}));

router.post('/', auth, asyncMiddleware(async (req: Request, res: Response) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error);

  const customer = new Customer({ 
    name: req.body.name,
    isGold: req.body.isGold,
    phone: req.body.phone
  });
  await customer.save();
  
  res.send(customer);
}));

router.put('/:id', auth, asyncMiddleware(async (req: Request, res: Response) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error);

  const customer = await Customer.findByIdAndUpdate(req.params.id,
    { 
      name: req.body.name,
      isGold: req.body.isGold,
      phone: req.body.phone
    }, { new: true });

  if (!customer) return res.status(404).send('The customer with the given ID was not found.');
  
  res.send(customer);
}));

router.delete('/:id', auth, asyncMiddleware(async (req: Request, res: Response) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error);

  const customer = await Customer.findByIdAndRemove(req.params.id);

  if (!customer) return res.status(404).send('The customer with the given ID was not found.');

  res.send(customer);
}));

router.get('/:id', asyncMiddleware(async (req: Request, res: Response) => {
  const customer = await Customer.findById(req.params.id);

  if (!customer) return res.status(404).send('The customer with the given ID was not found.');

  res.send(customer);
}));

module.exports = router; 