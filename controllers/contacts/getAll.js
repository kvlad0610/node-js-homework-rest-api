const {Contact} = require('../../models')

const getAll = async (req, res, next) => {
	try {
		const {_id} = req.user
		const {page = 1, limit = 5, favorite} = req.query

		const skip = (page - 1) * limit
		if (favorite === undefined) {
			const contacts = await Contact.find(
				{owner: _id},
				'-createdAt -updatedAt',
				{
					skip,
					limit: +limit,
				}
			)
			res.json(contacts)
		}
		const contacts = await Contact.find(
			{owner: _id, favorite},
			'-createdAt -updatedAt',
			{
				skip,
				limit: +limit,
			}
		)
		res.json(contacts)
	} catch (error) {
		next(error)
	}
}

module.exports = getAll
