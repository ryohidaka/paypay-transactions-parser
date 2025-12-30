import { parse as csvParse, type Options } from 'csv-parse/sync'
import { EN_HEADERS, JP_HEADERS } from './constants'
import { transactionSchema } from './schemas'
import type { Transaction } from './types'

type CsvOptions = Omit<Options, 'columns'>

/**
 * Parse PayPay transactions CSV string safely.
 *
 * @param input - CSV content as string, Buffer, or Uint8Array
 * @param options - Optional csv-parse options (columns: true is enforced)
 * @returns Array of validated and type-safe Transaction objects
 * @throws {TypeError} If input is not string, Buffer, or Uint8Array
 * @throws {Error} If CSV parsing or schema validation fails
 */
export default function parse(
	input: Buffer | string | Uint8Array,
	options: CsvOptions = {},
): Transaction[] {
	if (
		typeof input !== 'string' &&
		!(input instanceof Buffer) &&
		!(input instanceof Uint8Array)
	) {
		throw new TypeError(
			'Invalid input type: expected string, Buffer, or Uint8Array.',
		)
	}

	const parserOptions: Options = {
		columns: true,
		skip_empty_lines: true,
		trim: true,
		...options,
	}

	let rawRecords: Record<string, string>[]

	try {
		// Parse raw CSV rows into plain objects
		rawRecords = csvParse(input, parserOptions) as unknown as Record<
			string,
			string
		>[]
	} catch (err) {
		const message =
			err instanceof Error ? err.message : 'Unknown CSV parsing error.'
		throw new Error(`Failed to parse CSV: ${message}`)
	}

	// Detect CSV language header mapping
	const firstRecord = rawRecords[0]
	const headers = firstRecord ? Object.keys(firstRecord) : []
	const headerMap = headers.some(
		(h) => JP_HEADERS[h as keyof typeof JP_HEADERS],
	)
		? JP_HEADERS
		: EN_HEADERS

	// Normalize record keys and validate each with Zod
	const validatedRecords: Transaction[] = rawRecords.map((record, index) => {
		const normalized: Record<string, string> = {}

		for (const [key, value] of Object.entries(record)) {
			const mapped = headerMap[key as keyof typeof headerMap]
			if (mapped) normalized[mapped] = value
		}

		try {
			return transactionSchema.parse(normalized)
		} catch (e) {
			const message =
				e instanceof Error ? e.message : 'Unknown Zod validation error.'
			throw new Error(`Invalid record at line ${index + 2}: ${message}`)
		}
	})

	return validatedRecords
}
