const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [ true, 'This field is required' ]
	},
	email: {
		type: String,
		required: [ true, 'This field is required' ],
		unique: true,
		lowercase: true,
		validate: [ validator.isEmail, 'Invalid Email' ]
	},
	photo: String,
	role: [
		{
			type: String
		}
	],
	password: {
		type: String,
		required: [ true, 'Password field is required' ],
		minlength: 8,
		select: false
	},
	passwordConfrim: {
		type: String,
		required: [ true, 'passwordConfrim field is required' ],
		validate: {
			validator: function(el) {
				return el === this.password;
			},
			message: 'Password does not match'
		}
	},
	passwordChangedAt: Date,
	passwordResetToken: String,
	passwordResetExpires: Date,
	active: {
		type: Boolean,
		default: true,
		select: false
	}
});

userSchema.pre('save', async function(next) {
	if (!this.isModified('password')) return next();
	this.password = await bcrypt.hash(this.password, 12);
	this.passwordConfrim = undefined;
	next();
});

userSchema.methods.comparePassword = async function(candidatePassword, userPassword) {
	return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
