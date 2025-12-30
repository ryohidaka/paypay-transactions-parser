import { z } from 'zod'

/**
 * Amount string in CSV, transforms "-" to null and removes commas.
 */
export const amountSchema: z.ZodPipe<
	z.ZodString,
	z.ZodTransform<number | null, string>
> = z
	.string()
	.transform((val) => (val === '-' ? 0 : Number(val.replace(/,/g, ''))))

/**
 * Date string in CSV, transforms to Date object.
 */
export const dateSchema: z.ZodPipe<
	z.ZodString,
	z.ZodTransform<Date, string>
> = z.string().transform((val) => {
	const d = new Date(val)
	if (Number.isNaN(d.getTime())) throw new Error(`Invalid date: ${val}`)
	return d
})

/**
 * Generic nullable string schema for CSV cells that may contain "-".
 * Converts "-" to null.
 */
export const nullableDashString: z.ZodPipe<
	z.ZodString,
	z.ZodTransform<string | null, string>
> = z.string().transform((val) => (val === '-' ? null : val))

/**
 * Transaction schema for CSV records.
 * Supports English and Japanese CSV headers mapped to this format.
 */
export const transactionSchema: z.ZodObject<
	{
		date: z.ZodPipe<z.ZodString, z.ZodTransform<Date, string>>
		amountOutgoing: z.ZodPipe<
			z.ZodString,
			z.ZodTransform<number | null, string>
		>
		amountIncoming: z.ZodPipe<
			z.ZodString,
			z.ZodTransform<number | null, string>
		>
		amountOutgoingOverseas: z.ZodNullable<
			z.ZodPipe<z.ZodString, z.ZodTransform<number | null, string>>
		>
		currency: z.ZodNullable<
			z.ZodPipe<z.ZodString, z.ZodTransform<string | null, string>>
		>
		exchangeRate: z.ZodPipe<z.ZodString, z.ZodTransform<number | null, string>>
		countryPaidIn: z.ZodNullable<
			z.ZodPipe<z.ZodString, z.ZodTransform<string | null, string>>
		>
		transactionType: z.ZodString
		businessName: z.ZodString
		method: z.ZodNullable<
			z.ZodPipe<z.ZodString, z.ZodTransform<string | null, string>>
		>
		paymentOption: z.ZodNullable<
			z.ZodPipe<z.ZodString, z.ZodTransform<string | null, string>>
		>
		user: z.ZodNullable<
			z.ZodPipe<z.ZodString, z.ZodTransform<string | null, string>>
		>
		transactionId: z.ZodString
	},
	z.core.$strip
> = z.object({
	date: dateSchema,
	amountOutgoing: amountSchema,
	amountIncoming: amountSchema,
	amountOutgoingOverseas: amountSchema.nullable(),
	currency: nullableDashString.nullable(),
	exchangeRate: amountSchema,
	countryPaidIn: nullableDashString.nullable(),
	transactionType: z.string(),
	businessName: z.string(),
	method: nullableDashString.nullable(),
	paymentOption: nullableDashString.nullable(),
	user: nullableDashString.nullable(),
	transactionId: z.string(),
})
