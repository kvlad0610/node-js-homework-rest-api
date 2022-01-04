const {Schema, model} = require('mongoose')
const Joi = require('joi')

const codeName =
	/([A-Z]{1}[a-z]{1,30}[- ]{0,1}|[A-Z]{1}[- \\']{1}[A-Z]{0,1}[a-z]{1,30}[- ]{0,1}|[a-z]{1,2}[ -\\']{1}[A-Z]{1}[a-z]{1,30}){2,5}/

const codeEmail =
	/^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/

const codePhone = /^\([0-9]{3}\) [0-9]{3}-[0-9]{2}-[0-9]{2}/

const contactSchema = Schema(
	{
		name: {
			type: String,
			minlength: 2,
			match: codeName,
			required: [true, 'Set name for contact'],
		},
		email: {
			type: String,
			match: codeEmail,
			require: true,
			unique: true,
		},
		phone: {
			type: String,
			required: true,
			match: codePhone,
			unique: true,
		},
		favorite: {
			type: Boolean,
			default: false,
		},
		owner: {
			type: Schema.Types.ObjectId,
			ref: 'user',
		},
	},
	{
		versionKey: false,
		timestamps: true,
	}
)

const Contact = model('contact', contactSchema)

const joiSchemaContact = Joi.object({
	name: Joi.string().min(2).pattern(codeName).required(),
	email: Joi.string().pattern(codeEmail).required(),
	phone: Joi.string().pattern(codePhone).required(),
	favorite: Joi.boolean(),
})

module.exports = {
	Contact,
	joiSchemaContact,
}
