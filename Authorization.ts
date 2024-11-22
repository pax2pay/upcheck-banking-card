import { isoly } from "isoly"
import { pax2pay } from "@pax2pay/model-banking"
import { http } from "cloudly-http"
import { Card } from "./Card"

export namespace Authorization {
	const authorizations = ["succeeding"] as const //["succeeding", "failing", "credit"] as const
	export type Authorizations = typeof authorizations[number]
	export async function create(
		client: http.Client,
		pax2payClient: pax2pay.Client
	): Promise<Partial<Record<Authorizations, pax2pay.Authorization>> | undefined> {
		const currentMinute = isoly.DateTime.getMinute(isoly.DateTime.now())
		const currentHour = isoly.DateTime.getHour(isoly.DateTime.now())
		return Object.fromEntries(
			await Promise.all(authorizations.map(a => authorize(a, currentHour, currentMinute, client, pax2payClient)))
		)
	}
	async function authorize(
		type: Authorizations,
		currentHour: number,
		currentMinute: number,
		client: http.Client,
		pax2payClient: pax2pay.Client
	): Promise<[Authorizations, pax2pay.Authorization | undefined]> {
		let card: string | undefined = undefined
		const start = performance.now()
		const created = await Card.create(pax2payClient, undefined)
		!pax2pay.Card.type.is(created)
			? console.log(`authorization test ${type} failed due to card creation error: `, JSON.stringify(created, null, 2))
			: (card = created.reference)
		const result: [Authorizations, pax2pay.Authorization | undefined] = [
			type,
			card == undefined
				? undefined
				: await client.post<pax2pay.Authorization>("/authorization", {
						...creatables[type][~~(currentMinute / (60 / creatables[type].length))],
						card,
				  }),
		]
		console.log(`Authorization ${type} took ${performance.now() - start} ms`)
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
const flagless: Omit<pax2pay.Authorization.Creatable, "card" | "reference"> & { preset: string } = {
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
const creatables: Record<"succeeding", Omit<pax2pay.Authorization.Creatable, "card" | "reference">[]> = {
	succeeding: [
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
	],
	// failing: [
	// 	{
	// 		...flagless,
	// 		merchant: { ...flagless.merchant, country: "KP" },
	// 		description: "Authorization to fail on the realm level due to sanctioned merchant country.",
	// 	},
	// 	{
	// 		...flagless,
	// 		amount: amount.veryHighOrganization,
	// 		description: "Authorization to fail on the organization level due to very high amount.",
	// 	},
	// 	{
	// 		...flagless,
	// 		amount: amount.veryHighRealm,
	// 		description: "Authorization to fail on the realm level due to very high amount.",
	// 	},
	// 	{
	// 		...flagless,
	// 		merchant: {
	// 			...flagless.merchant,
	// 			/* cspell: disable-next-line */
	// 			name: "paxsino",
	// 			category: "7801",
	// 		},
	// 		description: "Authorization to fail due to casino MCC.",
	// 	},
	// 	{
	// 		...flagless,
	// 		merchant: {
	// 			...flagless.merchant,
	// 			name: "pax dog and horse racing",
	// 			category: "7802",
	// 		},
	// 		description: "Authorization to fail due to gambling MCC.",
	// 	},
	// ],
	// credit: [{ ...flagless, amount: amount.low, description: flagless.description + " with low amount flag." }],
}
