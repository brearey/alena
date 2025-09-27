import { knexClient } from '../postgres/knex-client.js'

const tableName = 'tariffs'

interface WarehouseData {
	warehouseName: string
	geoName: string
	boxDeliveryBase: string
	boxDeliveryLiter: string
	boxDeliveryCoefExpr: string
	boxDeliveryMarketplaceBase: string
	boxDeliveryMarketplaceLiter: string
	boxDeliveryMarketplaceCoefExpr: string
	boxStorageBase: string
	boxStorageLiter: string
	boxStorageCoefExpr: string
}

interface TariffsResponse {
	data: {
		dtNextBox: string
		dtTillMax: string
		warehouseList: WarehouseData[]
	}
}

interface TariffDBRecord {
	dt_next_box: string
	dt_till_max: string
	warehouse_name: string
	geo_name: string
	box_delivery_base: number
	box_delivery_liter: number
	box_delivery_coef_expr: string
	box_delivery_marketplace_base: number
	box_delivery_marketplace_liter: number
	box_delivery_marketplace_coef_expr: string
	box_storage_base: number
	box_storage_liter: number
	box_storage_coef_expr: string
	tariff_date: string
	updated_at: Date
}

function parseDecimal(value: string): number {
	if (!value) return 0
	return parseFloat(value.replace(',', '.')) || 0
}

export async function saveTariffs(
	tariffsData: TariffsResponse,
	tariffDate: string
) {
	const { dtNextBox, dtTillMax, warehouseList } = tariffsData.data

	const tariffsToInsert: TariffDBRecord[] = warehouseList.map(
		(warehouse: WarehouseData) => ({
			dt_next_box: dtNextBox,
			dt_till_max: dtTillMax,
			warehouse_name: warehouse.warehouseName,
			geo_name: warehouse.geoName,
			box_delivery_base: parseDecimal(warehouse.boxDeliveryBase),
			box_delivery_liter: parseDecimal(warehouse.boxDeliveryLiter),
			box_delivery_coef_expr: warehouse.boxDeliveryCoefExpr,
			box_delivery_marketplace_base: parseDecimal(
				warehouse.boxDeliveryMarketplaceBase
			),
			box_delivery_marketplace_liter: parseDecimal(
				warehouse.boxDeliveryMarketplaceLiter
			),
			box_delivery_marketplace_coef_expr:
				warehouse.boxDeliveryMarketplaceCoefExpr,
			box_storage_base: parseDecimal(warehouse.boxStorageBase),
			box_storage_liter: parseDecimal(warehouse.boxStorageLiter),
			box_storage_coef_expr: warehouse.boxStorageCoefExpr,
			tariff_date: tariffDate,
			updated_at: new Date(),
		})
	)

	return await knexClient.transaction(async (trx) => {
		await trx(tableName).where('tariff_date', tariffDate).delete()
		await trx(tableName).insert(tariffsToInsert)
	})
}

export async function getSortedTariffs(tariffDate: string): Promise<any[]> {
	return await knexClient(tableName)
		.select(
			'warehouse_name',
			'geo_name',
			'box_delivery_base',
			'box_delivery_liter',
			'box_delivery_coef_expr',
			'box_delivery_marketplace_base',
			'box_delivery_marketplace_liter',
			'box_delivery_marketplace_coef_expr',
			'box_storage_base',
			'box_storage_liter',
			'box_storage_coef_expr',
			'dt_next_box',
			'dt_till_max',
			'tariff_date'
		)
		.where('tariff_date', tariffDate)
		.orderBy('box_delivery_coef_expr', 'asc')
}
