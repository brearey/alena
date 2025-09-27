import pkg from 'knex'
import knexConfig from '#config/knex/knexfile.js'

const { knex } = pkg
export const knexClient = knex(knexConfig)