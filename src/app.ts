import knex, { migrate, seed } from '#postgres/knex.js'
import express from 'express'

await migrate.latest()
await seed.run()

console.log('All migrations and seeds have been run')

const app = express()
const port = 3000

app.get('/health', (req, res) => {
	res.send('ok')
})

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
})
