import knex, { migrate, seed } from '#postgres/knex.js'
import express from 'express'
import env from './config/env/env.js'
import { fetchTariffs } from './services/tariffs-service.js'

const app = express()
const port = env.APP_PORT

app.get('/health', (req, res) => {
	res.send('ok')
})

app.listen(port, async () => {
	console.log(`App listening on port ${port}`)

	fetchTariffs('2025-09-27').then((data) =>
		console.log(JSON.stringify(data))
	)

	// await migrate.latest()
	// await seed.run()
	// console.log('All migrations and seeds have been run')
})
