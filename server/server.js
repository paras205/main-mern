const dotenv = require('dotenv');
const User = require('./models/user');
const mongoose = require('mongoose');
dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE;
mongoose
	.connect(DB, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useUnifiedTopology: true,
		useFindAndModify: false
	})
	.then(() => {
		console.log('Database connected...');
	});

User.countDocuments('users').exec((err, count) => {
	if (count > 0) {
		return;
	}
	require('./models/userSeeds');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log(`App running on port ${port}...`);
});
