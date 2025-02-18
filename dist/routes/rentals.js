"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const { Rental, validate } = require('../models/rental');
const { Movie } = require('../models/movie');
const { Customer } = require('../models/customer');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
//get all rentals
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const rentals = yield Rental.find().sort('-dateOut');
    res.send(rentals);
}));
//create a new rental
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = validate(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);
    //check if the customer exists in the database
    const customer = yield Customer.findById(req.body.customerId);
    if (!customer)
        return res.status(400).send('Invalid genre.');
    //check if the movie exists in the database
    const movie = yield Movie.findById(req.body.movieId);
    if (!movie)
        return res.status(400).send('Invalid movie.');
    if (movie.numberInStock === 0)
        return res.status(400).send('Movie not in stock.');
    //create session
    const session = yield Rental.startSession();
    if (!session)
        return res.status(400).send('Failed to create session.');
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
        yield rental.save({ session });
        //update the movie
        movie.numberInStock--;
        yield movie.save({ session });
        //commit the transaction
        yield session.commitTransaction();
        res.status(201).send(rental);
    }
    //catch any errors
    catch (error) {
        //rollback the transaction if an error occurs
        yield session.abortTransaction();
        session.endSession();
        res.status(500).send('Internal server error');
    }
}));
module.exports = router;
