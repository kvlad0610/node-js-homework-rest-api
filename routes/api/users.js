const express = require('express')
const {BadRequest, Conflict, Unauthorized} = require('http-errors')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const {User} = require('../../models')
const {joiSchemaUser} = require('../../models/user')

const {authenticate} = require('../../middleware')

const {SECRET_KEY} = process.env

const router = express.Router()

router.post('/signup', async (req, res, next) => {
	try {
		const {error} = joiSchemaUser.validate(req.body)
		if (error) {
			throw new BadRequest(error.message)
		}
		const {email, password} = req.body
		const user = await User.findOne({email})
		if (user) {
			throw new Conflict('Email in use')
		}
		const salt = await bcrypt.genSalt(10)
		const hashPassword = await bcrypt.hash(password, salt)
		const newUser = await User.create({email, password: hashPassword})
		res.status(201).json({
			user: {
				email: newUser.email,
				subscription: newUser.subscription,
			},
		})
	} catch (error) {
		next(error)
	}
})

router.post('/login', async (req, res, next) => {
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
})

router.get('/logout', authenticate, async (req, res, next) => {
	const {_id} = req.user
	await User.findByIdAndUpdate(_id, {token: null})
	res.status(204).send()
})

router.get('/current', authenticate, async (req, res) => {
	const {email, subscription} = req.user
	res.status(200).json({
		email,
		subscription,
	})
})

router.patch('/', authenticate, async (req, res, next) => {
	try {
		// const {error} = joiSchemaUserSubscription.validate(req.body)
		// if (error) {
		// 	throw new BadRequest(error.message)
		// }
		const {_id} = req.user
		const {subscription} = req.body
		if (
			subscription !== 'starter' &&
			subscription !== 'pro' &&
			subscription !== 'business'
		) {
			throw new BadRequest('one of ( starter, pro, business )')
		}
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
})

module.exports = router
