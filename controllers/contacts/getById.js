const {Contact} = require('../../models')
const {NotFound} = require('http-errors')

const getById = async (req, res, next) => {
	try {
		const {contactId} = req.params
		const {_id} = req.user

		const contact = await Contact.findOne({_id: contactId, owner: _id})

		// const contact = await Contact.findById(contactId)
		if (!contact) {
			throw new NotFound()
		}

		// const userId = _id.toString()
		// if (!contact.owner) {
		// 	res.json(contact)
		// }
		// const ownerId = contact.owner.toString()

		// if (ownerId !== userId) {
		// 	throw new Unauthorized('No access')
		// }
		res.json(contact)
	} catch (error) {
		if (error.message.includes('Cast to ObjectId failed')) {
			error.status = 404
		}
		next(error)
	}
}

module.exports = getById
