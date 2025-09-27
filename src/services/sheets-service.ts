import { sheets } from '#config/google-sheets.js'

export async function getRange(spreadsheetId: string, range: string | null) {
	return await sheets.spreadsheets.values.get({
		spreadsheetId,
		range: range ?? 'A1:A2'
	})
}