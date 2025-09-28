import env from '#config/env/env.js'

/**
 * @param {import('knex').Knex} knex
 * @returns {Promise<void>}
 */
export async function seed(knex) {
	await knex('spreadsheets')
		.insert([{ spreadsheet_id: env.SPREADSHEET_ID ?? 'some_spreadsheet' }])
		.onConflict(['spreadsheet_id'])
		.ignore()
}
