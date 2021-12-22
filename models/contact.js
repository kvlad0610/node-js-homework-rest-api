const {Schema, model} = require('mongoose')
const Joi = require('joi')

const contactSchema = Schema(
	{
		name: {
			type: String,
			required: [true, 'Set name for contact'],
			minlength: 2,
		},
		email: {
			type: String,
			require: true,
		},
		phone: {
			type: String,
			required: true,
			match: /^\([0-9]{3}\) [0-9]{3}-[0-9]{2}-[0-9]{2}/,
		},
		favorite: {
			type: Boolean,
			default: false,
		},
	},
	{versionKey: false, timestamps: true}
)

const Contact = model('contact', contactSchema)

const joiSchemaContact = Joi.object({
	name: Joi.string().required(),
	email: Joi.string().required(),
	phone: Joi.string().required(),
	favorite: Joi.boolean(),
})

module.exports = {
	Contact,
	joiSchemaContact,
}
