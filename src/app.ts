import { migrate, seed } from '#postgres/knex.js'
import express from 'express'
import env from './config/env/env.js'
import { fetchTariffs } from './services/tariffs-service.js'
import { saveTariffs } from '#models/tariff-model.js'
import { plan } from '#utils/scheduler.js'

const app = express()
const port = env.APP_PORT

app.get('/health', (req, res) => {
	res.send('ok')
})

app.listen(port, async () => {
	await migrate.latest()
	await seed.run()
	console.log('All migrations and seeds have been run')

	// Plan a fetching tariffs function
	plan(fetchTariffsHandler)

	console.log(`App listening on port ${port} at ${new Date().toLocaleString()}`)
})

function fetchTariffsHandler() {
	const currentDate = new Date().toLocaleDateString('en-CA')

	console.log(`Fetching tariffs for date: ${currentDate}`)

	fetchTariffs(currentDate)
		.then((data) => {
			saveTariffs(data.response, currentDate)
				.then((result) => console.log('saveTariffs success'))
				.catch((e) => console.error('saveTariffs', e))
		})
		.catch((e) => console.error('fetchTariffs', e))
}
