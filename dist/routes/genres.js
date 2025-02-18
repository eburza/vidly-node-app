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
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const { Genre, validate } = require('../models/genre');
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const genres = yield Genre.find().sort('name');
    res.send(genres);
}));
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = validate(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);
    let genre = new Genre({ name: req.body.name });
    genre = yield genre.save();
    res.send(genre);
}));
router.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = validate(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);
    const genre = yield Genre.findByIdAndUpdate(req.params.id, { name: req.body.name }, {
        new: true
    });
    if (!genre)
        return res.status(404).send('The genre with the given ID was not found.');
    res.send(genre);
}));
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const genre = yield Genre.findByIdAndRemove(req.params.id);
    if (!genre)
        return res.status(404).send('The genre with the given ID was not found.');
    res.send(genre);
}));
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const genre = yield Genre.findById(req.params.id);
    if (!genre)
        return res.status(404).send('The genre with the given ID was not found.');
    res.send(genre);
}));
module.exports = router;
