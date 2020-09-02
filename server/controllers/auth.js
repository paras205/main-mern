const User = require('../models/user');
const jwt = require('jsonwebtoken');
const AppError = require('../utlis/AppError');
const fetch = require('node-fetch');
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client('394735795480-e9n4424030u2f1uet9ahs5afhng56bml.apps.googleusercontent.com');

const signToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES
	});
};

const createUser = async (res, email, name) => {
	const user = await User.findOne({ email });
	if (!user) {
		return res.status(400).json({
			error: 'something went wrong'
		});
	}
	if (user) {
		const token = jwt.sign({ _id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
		const { _id, name, email } = user;
		res.json({ token, user: { _id, name, email } });
	} else {
		let password = email + Date.now();
		let passwordConfrim = email + Date.now();
		let newUser = new User({ name, email, password, passwordConfrim });
		await newUser.save();
		const token = jwt.signToken(data.id);
		const { _id, name, email } = newUser;
		res.json({ token, user: { _id, name, email } });
	}
};

exports.register = async (req, res) => {
	console.log(req.body);
	try {
		const user = await User.create({
			name: req.body.name,
			email: req.body.email,
			password: req.body.password,
			passwordConfrim: req.body.passwordConfrim
		});
		const token = signToken(user._id);
		res.status(200).json({
			message: 'success',
			token,
			data: user
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({
			status: 'fail',
			message: err
		});
	}
};

exports.login = async (req, res, next) => {
	try {
		const { email, password } = req.body;
		if (!email || !password) {
			return next(new AppError('Please enter email and password', 400));
		}
		const user = await User.findOne({ email }).select('+password');
		if (!user || !await user.comparePassword(password, user.password)) {
			return next(new AppError('Incorrect email or password', 401));
		}
		const token = signToken(user._id);
		res.status(200).json({
			message: 'success',
			token,
			data: user
		});
	} catch (err) {
		res.status(500).json({
			status: 'fail',
			message: err
		});
	}
};

exports.registerWithGoogle = async (req, res) => {
	const { tokenId } = req.body;
	client
		.verifyIdToken({
			idToken: tokenId,
			audience: '394735795480-e9n4424030u2f1uet9ahs5afhng56bml.apps.googleusercontent.com'
		})
		.then((response) => {
			const { email, email_verified, name } = response.payload;
			if (email_verified) {
				createUser(res, email, name);
			}
		});
};

exports.registerWithFacebook = async (req, res) => {
	const { access_token, userID } = req.body;
	let urlGraphFacebook = `https://graph.facebook.com/v2.11/${userID}/?fields=id,name,email&access_token=${access_token}`;
	fetch(urlGraphFacebook, {
		method: 'GET'
	})
		.then((response) => response.json())
		.then((response) => {
			const { email, name } = response;
			createUser(res, email, name);
		});
};

exports.forgotPassword = async (req, res) => {};
exports.resetPassword = async (req, res) => {};
exports.updatePassword = async (req, res) => {};
exports.deactivateAccount = async (req, res) => {};
exports.deleteAccount = async (req, res) => {};
