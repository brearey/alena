/**
 * @param {import('knex').Knex} knex
 * @returns {Promise<void>}
 */
export async function up(knex) {
  return knex.schema.createTable('tariffs', (table) => {
    table.increments('id').primary();
    table.decimal('box_delivery_base', 10, 2).comment('Логистика, первый литр, ₽');
    table.string('box_delivery_coef_expr').comment('Коэффициент Логистика, %');
    table.decimal('box_delivery_liter', 10, 2).comment('Логистика, дополнительный литр, ₽');
    table.decimal('box_delivery_marketplace_base', 10, 2).comment('Логистика FBS, первый литр, ₽');
    table.string('box_delivery_marketplace_coef_expr').comment('Коэффициент FBS, %');
    table.decimal('box_delivery_marketplace_liter', 10, 2).comment('Логистика FBS, дополнительный литр, ₽');
    table.decimal('box_storage_base', 10, 2).comment('Хранение в день, первый литр, ₽');
    table.string('box_storage_coef_expr').comment('Коэффициент Хранение, %');
    table.decimal('box_storage_liter', 10, 2).comment('Хранение в день, дополнительный литр, ₽');
    table.string('geo_name').notNullable().comment('Страна, для РФ — округ');
    table.string('warehouse_name').notNullable().comment('Название склада');

    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.index(['warehouse_name']);
    table.index(['geo_name']);
  });
}

/**
 * @param {import('knex').Knex} knex
 * @returns {Promise<void>}
 */
export async function down(knex) {
  return knex.schema.dropTable('tariffs');
}