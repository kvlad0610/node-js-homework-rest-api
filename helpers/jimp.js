const Jimp = require('jimp')

const jimp = async (path) => {
	await Jimp.read(path)
		.then((file) => {
			return file
				.cover(250, 250) // resize
				.quality(60) // set JPEG quality
				.greyscale() // set greyscale
				.write(path) // save
		})
		.catch((err) => {
			console.error(err)
		})
}

module.exports = jimp
