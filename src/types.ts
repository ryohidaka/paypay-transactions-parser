import type { transactionSchema } from './schemas'

/**
 * TypeScript type inferred from transaction schema.
 */
export type Transaction = ReturnType<typeof transactionSchema.parse>
