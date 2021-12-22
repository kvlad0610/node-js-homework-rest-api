const mongoose = require('mongoose')
require('dotenv').config()

const {DB_HOST} = process.env
const app = require('../app')
const PORT = process.env.PORT || 3000

mongoose
	.connect(DB_HOST)
	.then(() => {
		console.log('Database connection successful')
		app.listen(PORT, () => {
			console.log(`Server running. Use our API on port: ${PORT}`)
		})
	})
	.catch((error) => {
		console.log(error.message)
		process.exit(1)
	})
