import type { ColumnType } from 'typeorm'

const isProd = () => process.env.APP_ENV === 'production'

/**
 * Returns 'jsonb' for PostgreSQL (prod) or 'simple-json' for SQLite (dev).
 * SQLite doesn't support jsonb; TypeORM stores it as TEXT with JSON serialization.
 */
export const jsonCol = (): ColumnType => (isProd() ? 'jsonb' : 'simple-json')

/**
 * Returns 'double precision' for PostgreSQL (prod) or 'float' for SQLite (dev).
 * Use for monetary/decimal columns.
 */
export const floatCol = (): ColumnType => (isProd() ? 'double precision' : 'float')

/**
 * Returns 'timestamptz' for PostgreSQL (prod) or 'datetime' for SQLite (dev).
 * Use with @CreateDateColumn / @UpdateDateColumn / @Column({ type: timestampCol() }).
 */
export const timestampCol = (): ColumnType => (isProd() ? 'timestamptz' : 'datetime')
