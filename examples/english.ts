import fs from 'node:fs'
import parse from '../src'

const csvText = fs.readFileSync(
	'test/__fixtures__/csv/transactions_en.csv',
	'utf-8',
)
const transactions = await parse(csvText)

console.log(`length: ${transactions.length}`)
console.log(transactions[0])
