import { isoly } from "isoly"
import { pax2pay } from "@pax2pay/model-banking"
import { http } from "cloudly-http"
import { Card } from "./Card"

export namespace Authorization {
	export interface Creatable {
		card: string
		preset: string
		amount: [isoly.Currency, number]
		merchant: pax2pay.Merchant
		acquirer: pax2pay.Acquirer
		description: string
	}
	export async function create(
		client: http.Client,
		pax2payClient: pax2pay.Client
	): Promise<pax2pay.Authorization | undefined> {
		const currentMinute = isoly.DateTime.getMinute(isoly.DateTime.now())
		const currentHour = isoly.DateTime.getHour(isoly.DateTime.now())
		return await authorize(currentHour, currentMinute, client, pax2payClient)
	}
	async function authorize(
		currentHour: number,
		currentMinute: number,
		client: http.Client,
		pax2payClient: pax2pay.Client
	): Promise<pax2pay.Authorization | undefined> {
		let card: string | undefined = undefined
		const start = performance.now()
		const created = await Card.create(pax2payClient, undefined)
		!pax2pay.Card.type.is(created)
			? console.log("Authorization test failed due to card creation error: ", JSON.stringify(created, null, 2))
			: (card = created.reference)
		const result: pax2pay.Authorization | undefined =
			card == undefined
				? undefined
				: await client.post<pax2pay.Authorization>("/authorization", {
						...creatables[~~(currentMinute / (60 / creatables.length))],
						card,
				  })
		console.log(`Authorization took ${performance.now() - start} ms`)
		return result
	}
}
const amount: Record<
	"low" | "normal" | "highOrganization" | "highRealm" | "veryHighOrganization" | "veryHighRealm",
	pax2pay.Amount
> = {
	low: [Card.currency, 1],
	normal: [Card.currency, 15],
	highOrganization: [Card.currency, 501],
	highRealm: [Card.currency, 801],
	veryHighOrganization: [Card.currency, 2000],
	veryHighRealm: [Card.currency, 2600],
}
const flagless: Omit<Authorization.Creatable, "card" | "reference"> & { preset: string } = {
	amount: amount.normal,
	preset: "test-ta-pg-200",
	merchant: {
		name: "paxair",
		id: "abcd1234",
		category: "4511",
		country: "GB",
		city: "upcheck town",
		zip: "12345",
		address: "Streetname 1, 12345 Towncity",
	},
	acquirer: {
		/* cspell: disable-next-line */
		id: "2345erty",
		number: "1351858913568",
		country: "GB",
	},
	description: "An upcheck test authorization, to succeed.",
}
const creatables: Omit<Authorization.Creatable, "card" | "reference">[] = [
	{ ...flagless, amount: amount.low, description: flagless.description + " with low amount flag." },
	{
		...flagless,
		amount: amount.highOrganization,
		description: flagless.description + " with high organization amount flag.",
	},
	{
		...flagless,
		amount: amount.highRealm,
		description: flagless.description + " with high realm amount flag.",
	},
]
