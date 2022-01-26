const express = require('express')

const {authenticate, upload} = require('../../middleware')
const {
	signup,
	login,
	logout,
	currentUser,
	updateSubscription,
	updateAvatar,
	verification,
	sendVerify,
} = require('../../controllers/users')

const router = express.Router()

router.post('/signup', signup)

router.post('/login', login)

router.get('/logout', authenticate, logout)

router.get('/current', authenticate, currentUser)

router.patch('/', authenticate, updateSubscription)

router.patch('/avatars', authenticate, upload.single('avatar'), updateAvatar)

router.get('/verify/:verificationToken', verification)

router.post('/verify', sendVerify)

module.exports = router
