import { parse as csvParse, type Options } from 'csv-parse/sync'

type CsvOptions = Omit<Options, 'columns'>

/**
 * Parse PayPay transactions CSV string safely.
 *
 * @param input - CSV content as string, Buffer, or Uint8Array
 * @param options - Optional csv-parse options (columns: true is enforced)
 * @returns Array of record objects representing parsed CSV rows
 * @throws {TypeError} If input is not string, Buffer, or Uint8Array
 * @throws {Error} If CSV parsing fails
 */
export default function parse(
	input: Buffer | string | Uint8Array,
	options: CsvOptions = {},
): Record<string, string>[] {
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

	try {
		// Safe cast due to TypeScript's limitations in csv-parse v6
		return csvParse(input, parserOptions) as unknown as Record<string, string>[]
	} catch (err) {
		const message =
			err instanceof Error ? err.message : 'Unknown CSV parsing error.'
		throw new Error(`Failed to parse CSV: ${message}`)
	}
}
