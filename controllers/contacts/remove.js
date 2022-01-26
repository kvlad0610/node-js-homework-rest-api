const {Contact} = require('../../models')
const {NotFound} = require('http-errors')

const remove = async (req, res, next) => {
	try {
		const {contactId} = req.params
		const {_id} = req.user

		const contact = await Contact.findOneAndDelete({_id: contactId, owner: _id})
		console.log(contact)
		// const contact = await Contact.findById(contactId)
		if (!contact) {
			throw new NotFound()
		}
		// const userId = _id.toString()
		// if (!contact.owner) {
		// 	await Contact.findByIdAndRemove(contactId)
		// 	res.json({message: 'product delete'})
		// }
		// const ownerId = contact.owner.toString()

		// if (ownerId !== userId) {
		// 	throw new Unauthorized('No access')
		// }
		// await Contact.findByIdAndRemove(contactId)
		// if (!deleteContact) {
		// 	throw new NotFound()
		// }
		res.json({message: 'product delete'})
	} catch (error) {
		if (error.message.includes('Cast to ObjectId failed')) {
			error.status = 404
		}
		next(error)
	}
}

module.exports = remove
