"use strict";
const mongoose = require('mongoose');
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const rentals = require('./routes/rentals');
const express = require('express');
const app = express();
require('dotenv').config({ path: '.env.local' });
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => {
    console.error('MongoDB connection error:', err);
    console.log('MONGODB_URI:', process.env.MONGODB_URI);
});
app.use(express.json());
app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/rentals', rentals);
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
