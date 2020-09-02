const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(`${__dirname}/public`));
if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}

const userRoutes = require('./routes/users');
const AppError = require('./utlis/AppError');

app.use('/api/v1/users', userRoutes);

app.all('*', (req, res, next) => {
	next(new AppError('Incorrect email or password', 404));
});

module.exports = app;
