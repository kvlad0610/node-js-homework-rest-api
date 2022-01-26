const {Contact} = require('../../models')
const {NotFound} = require('http-errors')

const update = async (req, res, next) => {
	try {
		// const {error} = joiSchemaContact.validate(req.body)
		// if (error) {
		// 	throw new BadRequest('missing fields')
		// }
		const {contactId} = req.params
		const {_id} = req.user
		const contact = await Contact.findOneAndUpdate(
			{_id: contactId, owner: _id},
			req.body,
			{new: true}
		)
		// const contact = await Contact.findById(contactId)
		if (!contact) {
			throw new NotFound()
		}
		// const userId = _id.toString()
		// if (!contact.owner) {
		// 	const updateContact = await Contact.findByIdAndUpdate(
		// 		contactId,
		// 		req.body,
		// 		{
		// 			new: true,
		// 		}
		// 	)
		// 	res.json(updateContact)
		// }
		// const ownerId = contact.owner.toString()

		// if (ownerId !== userId) {
		// 	throw new Unauthorized('No access')
		// }
		// const updateContact = await Contact.findByIdAndUpdate(contactId, req.body, {
		// 	new: true,
		// })
		// if (!updateContact) {
		// 	throw new NotFound()
		// }
		res.json(contact)
	} catch (error) {
		if (error.message.includes('Cast to ObjectId failed')) {
			error.status = 404
		}
		next(error)
	}
}

module.exports = update
