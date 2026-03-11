import type { ColumnType } from 'typeorm'

const isProd = () => process.env.APP_ENV === 'production'

/**
 * Returns 'jsonb' for PostgreSQL (prod) or 'simple-json' for SQLite (dev).
 * SQLite doesn't support jsonb; TypeORM stores it as TEXT with JSON serialization.
 */
export const jsonCol = (): ColumnType => (isProd() ? 'jsonb' : 'simple-json')
