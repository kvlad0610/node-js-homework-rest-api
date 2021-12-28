const express = require('express')
const {BadRequest, Conflict, Unauthorized} = require('http-errors')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const {User} = require('../../models')
const {joiSchemaUser} = require('../../models/user')

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
		const payload = {
			id: user._id,
		}
		const token = jwt.sign(payload, SECRET_KEY, {expiresIn: '2h'})
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

module.exports = router
