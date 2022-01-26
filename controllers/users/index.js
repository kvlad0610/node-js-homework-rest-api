const signup = require('./signup')
const login = require('./login')
const logout = require('./logout')
const currentUser = require('./currentUser')
const updateSubscription = require('./updateSubscription')
const updateAvatar = require('./updateAvatar')
const verification = require('./verification')
const sendVerify = require('./sendVerify')

module.exports = {
	signup,
	login,
	logout,
	currentUser,
	updateSubscription,
	updateAvatar,
	verification,
	sendVerify,
}
