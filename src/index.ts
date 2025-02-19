const mongoose = require('mongoose');
const config = require('config') // config file
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const rentals = require('./routes/rentals');
const users = require('./routes/users');
const auth = require('./routes/auth');
const express = require('express');
const app = express();
require('dotenv').config({ path: '.env.local' });

//check if the jwtPrivateKey is set
if (!config.get('jwtPrivateKey')) {
  console.log('FATAL ERROR: jwtPrivateKey is not defined.');
  // throw new Error('FATAL ERROR: jwtPrivateKey is not defined.');
  //exit the process
  process.exit(1); //exit the process with a failure code, 0 is success
}

mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('Connected to MongoDB'))
.catch((err: Error) => {
  console.error('MongoDB connection error:', err);
  console.log('MONGODB_URI:', process.env.MONGODB_URI);
});

app.use(express.json());
app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/rentals', rentals);
app.use('/api/users', users);
app.use('/api/auth', auth);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));