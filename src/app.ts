import { migrate, seed } from '#postgres/knex.js'
import express from 'express'
import env from './config/env/env.js'
import { fetchTariffs } from '#services/tariffs-service.js'
import { readSpreadsheet } from '#services/sheets-service.js'
import { saveTariffs } from '#models/tariff-model.js'
import { getSheetsIds } from '#models/sheets-model.js'
import { plan } from '#utils/scheduler.js'
import { listMajors } from '#quickstart.js'

const app = express()
const port = env.APP_PORT

app.get('/health', (req, res) => {
	res.send('ok')
})

// for check in browser
app.get('/tariffs', (req, res) => {
	const queryDate = req.query?.date ? req.query.date.toString() : new Date().toLocaleDateString('en-CA')
	fetchTariffs(queryDate)
		.then((data) => {
			saveTariffs(data.response, queryDate)
				.then(() => console.log('saveTariffs success'))
				.catch((e) => console.error('saveTariffs', e))
			res.json(data)
		})
		.catch((e) => console.error('fetchTariffs', e))
})

app.get('/sheets', (req, res) => {
	listMajors()
		.then(result => res.json(result))
		.catch(e => {
			console.error('listMajors', e)
			res.status(500)
		})
	// getSheetsIds()
	// 	.then(result => res.json(result))
	// 	.catch(e => console.error('getSheetsIds', e))
	// readSpreadsheet(env.SPREADSHEET_ID)
	// 	.then((result) => {
	// 		res.json(result)
	// 	})
	// 	.catch(e => console.error('readSpreadsheet', e))
})

app.listen(port, async () => {
	await migrate.latest()
	await seed.run()
	console.log('All migrations and seeds have been run')

	// fetch on start app
	fetchTariffsHandler()
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
				.then(() => console.log('saveTariffs success'))
				.catch((e) => console.error('saveTariffs', e))
		})
		.catch((e) => console.error('fetchTariffs', e))
}
