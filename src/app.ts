import knex, { migrate, seed } from '#postgres/knex.js'
import express from 'express'
import env from './config/env/env.js'

const app = express()
const port = env.APP_PORT

app.get('/health', (req, res) => {
	res.send('ok')
})

app.listen(port, async () => {
	console.log(`Example app listening on port ${port}`)
	// await migrate.latest()
	// await seed.run()
	// console.log('All migrations and seeds have been run')
})
