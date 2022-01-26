const path = require('path')
const fs = require('fs/promises')

const {User} = require('../../models')
const {jimp} = require('../../helpers')

const avatarsDir = path.join(__dirname, '../../', 'public', 'avatars')

const updateAvatar = async (req, res) => {
	const {path: tempUpload, filename} = req.file
	await jimp(tempUpload)
	const [extension] = filename.split('.').reverse()
	const newFileName = `${req.user._id}.${extension}`
	const fileUpload = path.join(avatarsDir, newFileName)
	await fs.rename(tempUpload, fileUpload)
	const avatarURL = path.join('avatars', newFileName)
	await User.findByIdAndUpdate(req.user._id, {avatarURL})

	res.json({avatarURL})
}

module.exports = updateAvatar
