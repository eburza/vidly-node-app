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
const { Movie, validate } = require('../models/movie');
const { Genre } = require('../models/genre');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const movies = yield Movie.find().sort('name');
    res.send(movies);
}));
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = validate(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);
    //check if the genre exists in the database, it also has version property
    const genre = yield Genre.findById(req.body.genreId);
    if (!genre)
        return res.status(400).send('Invalid genre.');
    //create a new movie
    let movie = new Movie({
        title: req.body.title,
        //genre with _id and name, not the whole genre object
        genre: {
            _id: genre._id,
            name: genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    });
    movie = yield movie.save();
    res.send(movie);
}));
router.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = validate(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);
    const movie = yield Movie.findByIdAndUpdate(req.params.id, { name: req.body.name }, {
        new: true
    });
    if (!Movie)
        return res.status(404).send('The Movie with the given ID was not found.');
    res.send(Movie);
}));
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const movie = yield Movie.findByIdAndRemove(req.params.id);
    if (!movie)
        return res.status(404).send('The Movie with the given ID was not found.');
    res.send(Movie);
}));
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const movie = yield Movie.findById(req.params.id);
    if (!movie)
        return res.status(404).send('The Movie with the given ID was not found.');
    res.send(movie);
}));
module.exports = router;
