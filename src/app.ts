import { migrate, seed } from '#postgres/knex.js'
import express from 'express'
import env from './config/env/env.js'
import { fetchTariffs } from './services/tariffs-service.js'
import { saveTariffs } from '#models/tariff-model.js'

const app = express()
const port = env.APP_PORT

app.get('/health', (req, res) => {
	res.send('ok')
})

app.listen(port, async () => {
	await migrate.latest()
	await seed.run()
	console.log('All migrations and seeds have been run')

	const date = '2025-09-27'

	fetchTariffs(date)
		.then((data) => {
			saveTariffs(data.response, date)
				.then((result) => console.log('saveTariffs success'))
				.catch((e) => console.error('saveTariffs', e))
		})
		.catch((e) => console.error('fetchTariffs', e))

	console.log(`App listening on port ${port} on ${new Date().toLocaleString()}`)
})
