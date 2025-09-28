import { knexClient } from '../postgres/knex-client.js'

const tableName = 'spreadsheets'

export async function getSheetsIds(): Promise<any[]> {
	return await knexClient(tableName)
		.select(
			'spreadsheet_id',
		)
}
