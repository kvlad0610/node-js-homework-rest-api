const {Schema, model} = require('mongoose')
const Joi = require('joi')

const codeEmail =
	/^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/

const userSchema = Schema(
	{
		password: {
			type: String,
			minlength: 6,
			required: [true, 'Password is required'],
		},
		email: {
			type: String,
			required: [true, 'Email is required'],
			match: codeEmail,
			unique: true,
		},
		subscription: {
			type: String,
			enum: ['starter', 'pro', 'business'],
			default: 'starter',
		},
		token: {
			type: String,
			default: null,
		},
	},
	{versionKey: false, timestamps: true}
)

const User = model('user', userSchema)

const joiSchemaUser = Joi.object({
	password: Joi.string().min(6).required(),
	email: Joi.string().pattern(codeEmail).required(),
	subscription: Joi.string().valid('starter', 'pro', 'business'),
	token: Joi.string(),
})

const joiSchemaUserSubscription = Joi.object({
	subscription: Joi.string().valid('starter', 'pro', 'business').required(),
})

module.exports = {
	User,
	joiSchemaUser,
	joiSchemaUserSubscription,
}
