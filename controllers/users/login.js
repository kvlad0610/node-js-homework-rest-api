const {BadRequest, Unauthorized} = require('http-errors')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const {User} = require('../../models')
const {joiSchemaUser} = require('../../models/user')

const {SECRET_KEY} = process.env

const login = async (req, res, next) => {
	try {
		const {error} = joiSchemaUser.validate(req.body)
		if (error) {
			throw new BadRequest(error.message)
		}
		const {email, password} = req.body
		const user = await User.findOne({email})
		if (!user) {
			throw new Unauthorized('Email or password is wrong')
		}
		if (!user.verify) {
			throw new Unauthorized('Email not verify')
		}
		const passwordCompare = await bcrypt.compare(password, user.password)
		if (!passwordCompare) {
			throw new Unauthorized('Email or password is wrong')
		}
		const {_id} = user
		const payload = {
			id: _id,
		}
		const token = jwt.sign(payload, SECRET_KEY, {expiresIn: '2h'})
		await User.findByIdAndUpdate(_id, {token})

		res.status(200).json({
			token,
			user: {
				email: user.email,
				subscription: user.subscription,
			},
		})
	} catch (error) {
		next(error)
	}
}

module.exports = login
