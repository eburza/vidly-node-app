"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Joi = require('joi');
const mongoose = require('mongoose');
const mongoose_1 = require("mongoose");
//mongoose schema
const genreSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    }
});
const Genre = (0, mongoose_1.model)('Genre', genreSchema);
//Joi schema for validation
function validateGenre(genre) {
    const schema = {
        name: Joi.string().min(5).max(50).required()
    };
    return Joi.validate(genre, schema);
}
exports.genreSchema = genreSchema;
exports.Genre = Genre;
exports.validate = validateGenre;
