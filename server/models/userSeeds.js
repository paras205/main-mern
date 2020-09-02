const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

mongoose.connect(process.env.DATABASE, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true,
	useFindAndModify: false
});

const User = require('./user');

User.collection.drop();

User.create([
	{
		name: 'admin',
		email: 'admin@admin.com',
		role: [ 'admin' ],
		password: 'adminpassword',
		passwordConfrim: 'adminpassword'
	},
	{
		name: 'user',
		email: 'user@user.com',
		role: [ 'user' ],
		password: 'userpassword',
		passwordConfrim: 'userpassword'
	}
])
	.then((user) => {
		console.log(`${user.length} users created`);
	})
	.catch((err) => {
		console.log(err);
	})
	.finally(() => {
		mongoose.connection.close();
	});
