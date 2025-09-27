import { sheets } from '#config/google-sheets.js'
import { getSortedTariffs } from '#models/tariff-model.js'

function parseCoef(coefExpr: string): number {
	if (!coefExpr) return 0
	const match = coefExpr.match(/^([\d.,]+)/)
	return match ? parseFloat(match[1].replace(',', '.')) : 0
}

function prepareDataForSheets(tariffs: any[]): any[][] {
	const headers = [
		'Склад',
		'Регион',
		'Логистика база (₽)',
		'Логистика литр (₽)',
		'Коэф. логистики (%)',
		'FBS база (₽)',
		'FBS литр (₽)',
		'Коэф. FBS (%)',
		'Хранение база (₽)',
		'Хранение литр (₽)',
		'Коэф. хранения (%)',
		'Дата след. тарифа',
		'Дата окончания',
		'Дата обновления',
	]

	const rows = tariffs.map((tariff) => [
		tariff.warehouse_name,
		tariff.geo_name,
		tariff.box_delivery_base,
		tariff.box_delivery_liter,
		parseCoef(tariff.box_delivery_coef_expr),
		tariff.box_delivery_marketplace_base,
		tariff.box_delivery_marketplace_liter,
		parseCoef(tariff.box_delivery_marketplace_coef_expr),
		tariff.box_storage_base,
		tariff.box_storage_liter,
		parseCoef(tariff.box_storage_coef_expr),
		tariff.dt_next_box,
		tariff.dt_till_max,
		tariff.tariff_date,
	])

	return [headers, ...rows]
}

export async function updateSpreadsheet(spreadsheetId: string): Promise<void> {
	try {
		const currentDate = new Date().toLocaleDateString('en-CA')
		const tariffs = await getSortedTariffs(currentDate)
		const data = prepareDataForSheets(tariffs)

		await sheets.spreadsheets.values.clear({
			spreadsheetId,
			range: 'stocks_coefs!A2:N',
		})

		const response = await sheets.spreadsheets.values.update({
			spreadsheetId,
			range: 'stocks_coefs!A2:N',
			valueInputOption: 'RAW',
			requestBody: {
				values: data.slice(1),
			},
		})

		console.log(`Данные обновлены в таблице: ${spreadsheetId}`)
		console.log(`Обновлено ячеек: ${response.data.updatedCells}`)
	} catch (err) {
		console.error(`Ошибка обновления таблицы ${spreadsheetId}:`, err)
		throw err
	}
}

export async function readSpreadsheet(spreadsheetId: string): Promise<void> {
	try {
		const response = await sheets.spreadsheets.values.get({
			spreadsheetId,
			range: 'stocks_coefs!A1:N10',
		})

		const range = response.data
		if (!range.values || range.values.length === 0) {
			console.log('No data found.')
			return
		}

		console.log('Данные из таблицы:')
		range.values.forEach((row) => {
			console.log(row.join(', '))
		})
	} catch (err) {
		console.error('Ошибка чтения таблицы:', err)
	}
}
