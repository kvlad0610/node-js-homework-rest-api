const {Contact} = require('../../models')
const {NotFound, BadRequest, Unauthorized} = require('http-errors')

const updateFavorite = async (req, res, next) => {
	try {
		const {contactId} = req.params
		const {favorite} = req.body
		const {_id} = req.user

		if (favorite === undefined) {
			throw new BadRequest('missing field favorite')
		}
		const contact = await Contact.findById(contactId)
		if (!contact) {
			throw new NotFound()
		}
		const userId = _id.toString()
		if (!contact.owner) {
			const updateContact = await Contact.findByIdAndUpdate(
				contactId,
				{favorite, owner: _id},
				{
					new: true,
				}
			)
			res.json(updateContact)
		}

		const ownerId = contact.owner.toString()

		if (ownerId !== userId) {
			throw new Unauthorized('No access')
		}

		const updateContact = await Contact.findByIdAndUpdate(
			contactId,
			{favorite},
			{
				new: true,
			}
		)
		// if (!updateContact) {
		// 	throw new NotFound()
		// }
		res.json(updateContact)
	} catch (error) {
		if (error.message.includes('Cast to ObjectId failed')) {
			error.status = 404
		}
		next(error)
	}
}

module.exports = updateFavorite
