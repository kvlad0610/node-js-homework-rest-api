const express = require('express')

const {
	getAll,
	getById,
	add,
	remove,
	update,
	updateFavorite,
} = require('../../controllers/contacts')

const {authenticate} = require('../../middleware')

const router = express.Router()

router.get('/', authenticate, getAll)

router.get('/:contactId', authenticate, getById)

router.post('/', authenticate, add)

router.delete('/:contactId', authenticate, remove)

router.put('/:contactId', authenticate, update)

router.patch('/:contactId/favorite', authenticate, updateFavorite)

module.exports = router
