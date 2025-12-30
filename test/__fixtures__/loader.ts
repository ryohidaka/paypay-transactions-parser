import { readFileSync } from 'node:fs'
import { join } from 'node:path'

/**
 * Load CSV fixture data from the __fixtures__/csv directory.
 *
 * This helper reads a CSV file (Japanese or English) for testing.
 * Use this to easily switch between localized PayPay transaction data fixtures.
 *
 * @param filename - CSV filename (e.g. "paypay_transactions_en.csv" or "paypay_transactions_ja.csv")
 * @returns The CSV file content as a UTF-8 string
 * @throws {Error} If the file cannot be found or read
 */
export function loadCSVData(filename: string): string {
	// Build an absolute path to the fixture file
	const fixturePath = join(import.meta.dir, `../__fixtures__/csv/${filename}`)

	// Read the CSV file as UTF-8 string
	const csvData = readFileSync(fixturePath, 'utf8')

	// Return raw CSV content
	return csvData
}
