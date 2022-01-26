const {Contact} = require('../../models')
const {joiSchemaContact} = require('../../models/contact')
const {BadRequest} = require('http-errors')

const add = async (req, res, next) => {
	try {
		const {error} = joiSchemaContact.validate(req.body)
		if (error) {
			throw new BadRequest(error.message)
		}
		const {_id} = req.user
		const newContact = await Contact.create({...req.body, owner: _id})
		res.status(201).json(newContact)
	} catch (error) {
		if (
			error.message.includes('contact validation') ||
			error.message.includes('E11000 duplicate key')
		) {
			error.status = 400
		}
		next(error)
	}
}

module.exports = add
