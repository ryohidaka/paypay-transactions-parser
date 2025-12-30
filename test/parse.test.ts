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
				date: new Date('2025/01/01 12:00:00'),
				amountOutgoing: 3000,
				amountIncoming: 0,
				amountOutgoingOverseas: 0,
				currency: null,
				exchangeRate: 0,
				countryPaidIn: null,
				transactionType: 'Payment',
				businessName: 'ファミリーマート - 東京ガーデンテラス',
				method: 'VISA xxxx',
				paymentOption: null,
				user: null,
				transactionId: '***',
			})
		})

		it('should keep comma-formatted numbers as strings', () => {
			const result = parse(csvData)
			expect(result[2].amountOutgoing).toBe(30000)
		})

		it("should handle '-' values correctly", () => {
			const result = parse(csvData)
			expect(result[3].amountOutgoing).toBe(0)
			expect(result[3].amountIncoming).toBe(10000)
		})

		it('should parse quoted fields containing commas', () => {
			const result = parse(csvData)
			expect(result[4].transactionType).toBe('Points, Balance Earned')
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
				date: new Date('2025/01/01 12:00:00'),
				amountOutgoing: 3000,
				amountIncoming: 0,
				amountOutgoingOverseas: 0,
				currency: null,
				exchangeRate: 0,
				countryPaidIn: null,
				transactionType: '支払い',
				businessName: 'ファミリーマート - 東京ガーデンテラス',
				method: 'VISA xxxx',
				paymentOption: null,
				user: null,
				transactionId: '***',
			})
		})

		it('should keep comma-formatted numbers as strings', () => {
			const result = parse(csvData)
			expect(result[2].amountOutgoing).toBe(30000)
		})

		it("should handle '-' values correctly", () => {
			const result = parse(csvData)
			expect(result[3].amountOutgoing).toBe(0)
			expect(result[3].amountIncoming).toBe(10000)
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
