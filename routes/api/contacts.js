const express = require('express')
const {NotFound, BadRequest, Unauthorized} = require('http-errors')

const {Contact} = require('../../models')
const {joiSchemaContact} = require('../../models/contact')

const {authenticate} = require('../../middleware')

const router = express.Router()

router.get('/', authenticate, async (req, res, next) => {
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
})

router.get('/:contactId', authenticate, async (req, res, next) => {
	try {
		const {contactId} = req.params
		const {_id} = req.user

		const contact = await Contact.findById(contactId)
		if (!contact) {
			throw new NotFound()
		}

		const userId = _id.toString()
		if (!contact.owner) {
			res.json(contact)
		}
		const ownerId = contact.owner.toString()

		if (ownerId !== userId) {
			throw new Unauthorized('No access')
		}
		res.json(contact)
	} catch (error) {
		if (error.message.includes('Cast to ObjectId failed')) {
			error.status = 404
		}
		next(error)
	}
})

router.post('/', authenticate, async (req, res, next) => {
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
})

router.delete('/:contactId', authenticate, async (req, res, next) => {
	try {
		const {contactId} = req.params
		const {_id} = req.user

		const contact = await Contact.findById(contactId)
		if (!contact) {
			throw new NotFound()
		}
		const userId = _id.toString()
		if (!contact.owner) {
			await Contact.findByIdAndRemove(contactId)
			res.json({message: 'product delete'})
		}
		const ownerId = contact.owner.toString()

		if (ownerId !== userId) {
			throw new Unauthorized('No access')
		}
		await Contact.findByIdAndRemove(contactId)
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
})

router.put('/:contactId', authenticate, async (req, res, next) => {
	try {
		// const {error} = joiSchemaContact.validate(req.body)
		// if (error) {
		// 	throw new BadRequest('missing fields')
		// }
		const {contactId} = req.params
		const {_id} = req.user

		const contact = await Contact.findById(contactId)
		if (!contact) {
			throw new NotFound()
		}
		const userId = _id.toString()
		if (!contact.owner) {
			const updateContact = await Contact.findByIdAndUpdate(
				contactId,
				req.body,
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
		const updateContact = await Contact.findByIdAndUpdate(contactId, req.body, {
			new: true,
		})
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
})

router.patch('/:contactId/favorite', authenticate, async (req, res, next) => {
	try {
		const {contactId} = req.params
		const {favorite} = req.body
		console.log(favorite)
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
})

module.exports = router
