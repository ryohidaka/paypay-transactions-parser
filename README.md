# paypay-transactions-parser

[![CI](https://github.com/ryohidaka/paypay-transactions-parser/actions/workflows/ci.yml/badge.svg)](https://github.com/ryohidaka/paypay-transactions-parser/actions/workflows/ci.yml)

Node.js library to parse paypay transactions csv

## Installation

```bash
bun add paypay-transactions-parser
```

## Usage

```typescript
import parse from 'paypay-transactions-parser';
import fs from 'fs';

// Read CSV data (English headers)
const csv = fs.readFileSync('<PATH_TO_YOUR_TRANSACTION_CSV>', 'utf8');

// Parse and validate
const transactions = parse(csv);
console.log(transactions[0]);
```

**outputs**
```
{
    date: 2025-01-01T12:00:00.000Z,
    amountOutgoing: 3000,
    amountIncoming: null,
    amountOutgoingOverseas: null,
    currency: null,
    exchangeRate: null,
    countryPaidIn: null,
    transactionType: 'Payment',
    businessName: 'ファミリーマート - 東京ガーデンテラス',
    method: 'VISA xxxx',
    paymentOption: null,
    user: null,
    transactionId: '***'
}
```

## Contributing

Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for contribution guidelines.

## License

MIT
