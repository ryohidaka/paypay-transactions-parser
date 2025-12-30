import { describe, expect, it } from 'bun:test'
import parse from '../src'
import { loadCSVData } from './__fixtures__/loader'

describe('parse', () => {
	describe('English CSV', () => {
		const csvData = loadCSVData('transactions_en.csv')

		it('should correctly parse PayPay English CSV fixture', () => {
			const result = parse(csvData)
			expect(result).toHaveLength(8)
			expect(result[0]).toEqual({
				'Date & Time': '2025/01/01 12:00:00',
				'Amount Outgoing (Yen)': '3,000',
				'Amount Incoming (Yen)': '-',
				'Amount Outgoing Overseas': '-',
				Currency: '-',
				'Exchange Rate (Yen)': '-',
				'Country Paid In': '-',
				'Transaction Type': 'Payment',
				'Business Name': 'ファミリーマート - 東京ガーデンテラス',
				Method: 'VISA xxxx',
				'Payment Option': '-',
				User: '-',
				'Transaction ID': '***',
			})
		})

		it('should keep comma-formatted numbers as strings', () => {
			const result = parse(csvData)
			expect(result[2]['Amount Outgoing (Yen)']).toBe('30,000')
		})

		it("should handle '-' values correctly", () => {
			const result = parse(csvData)
			expect(result[3]['Amount Outgoing (Yen)']).toBe('-')
			expect(result[3]['Amount Incoming (Yen)']).toBe('10,000')
		})

		it('should parse quoted fields containing commas', () => {
			const result = parse(csvData)
			expect(result[4]['Transaction Type']).toBe('Points, Balance Earned')
		})

		it('should throw TypeError for invalid input type', () => {
			// @ts-expect-error intentional test
			expect(() => parse(12345)).toThrow(TypeError)
		})

		it('should throw Error for malformed CSV', () => {
			const malformed = 'Date & Time,Amount Outgoing (Yen)\n2025/01/01 12:00:00'
			expect(() => parse(malformed)).toThrow(Error)
		})
	})

	describe('Japanese CSV', () => {
		const csvData = loadCSVData('transactions_ja.csv')

		it('should correctly parse PayPay Japanese CSV fixture', () => {
			const result = parse(csvData)
			expect(result).toHaveLength(8)
			expect(result[0]).toEqual({
				取引日: '2025/01/01 12:00:00',
				'出金金額（円）': '3,000',
				'入金金額（円）': '-',
				海外出金金額: '-',
				通貨: '-',
				'変換レート（円）': '-',
				利用国: '-',
				取引内容: '支払い',
				取引先: 'ファミリーマート - 東京ガーデンテラス',
				取引方法: 'VISA xxxx',
				支払い区分: '-',
				利用者: '-',
				取引番号: '***',
			})
		})

		it('should keep comma-formatted numbers as strings', () => {
			const result = parse(csvData)
			expect(result[2]['出金金額（円）']).toBe('30,000')
		})

		it("should handle '-' values correctly", () => {
			const result = parse(csvData)
			expect(result[3]['出金金額（円）']).toBe('-')
			expect(result[3]['入金金額（円）']).toBe('10,000')
		})

		it('should throw TypeError for invalid input type', () => {
			// @ts-expect-error intentional test
			expect(() => parse(12345)).toThrow(TypeError)
		})

		it('should throw Error for malformed CSV', () => {
			const malformed = '取引日,出金金額（円）\n2025/01/01 12:00:00'
			expect(() => parse(malformed)).toThrow(Error)
		})
	})
})
