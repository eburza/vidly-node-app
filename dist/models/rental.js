"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Joi = require('joi');
const mongoose_1 = require("mongoose");
const rentalSchema = new mongoose_1.Schema({
    //create new schema for customer instead of one using in customer model
    // not all properties in object are needed
    customer: {
        type: new mongoose_1.Schema({
            name: {
                type: String,
                required: true,
                minlength: 5,
                maxlength: 50
            },
            isGold: {
                type: Boolean,
                default: false
            },
            phone: {
                type: String,
                required: true,
                minlength: 5,
                maxlength: 50
            }
        }),
        required: true
    },
    movie: {
        type: new mongoose_1.Schema({
            title: {
                type: String,
                required: true,
                trim: true,
                minlength: 5,
                maxlength: 255
            },
            dailyRentalRate: {
                type: Number,
                required: true,
                min: 0,
                max: 255
            }
        }),
        required: true
    },
    dateOut: {
        type: Date,
        required: true,
        default: Date.now
    },
    dateReturned: {
        type: Date,
    },
    rentalFee: {
        type: Number,
        min: 0
    }
});
function validateRental(rental) {
    const schema = {
        customerId: Joi.string().required(),
        movieId: Joi.string().required()
    };
    return Joi.validate(rental, schema);
}
const Rental = (0, mongoose_1.model)('Rental', rentalSchema);
exports.Rental = Rental;
exports.validate = validateRental;
