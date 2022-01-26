const {BadRequest} = require('http-errors')

const {User} = require('../../models')
const {joiSchemaUserSubscription} = require('../../models/user')

const updateSubscription = async (req, res, next) => {
	try {
		const {error} = joiSchemaUserSubscription.validate(req.body)
		if (error) {
			throw new BadRequest(error.message)
		}
		const {_id} = req.user
		const {subscription} = req.body
		if (!subscription) {
			throw new BadRequest('missing field subscription')
		}
		const updateSubscription = await User.findByIdAndUpdate(
			_id,
			{subscription},
			{new: true}
		)
		res.json({
			email: updateSubscription.email,
			subscription: updateSubscription.subscription,
		})
	} catch (error) {
		next(error)
	}
}

module.exports = updateSubscription
