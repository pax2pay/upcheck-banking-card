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
	): Promise<any> {
		let card: { id: string; scheme: string } | undefined = undefined
		const startCard = performance.now()
		const created = await Card.create(pax2payClient, undefined)
		console.log(`Card Creation for authorization took ${performance.now() - startCard} ms`)
		!pax2pay.Card.type.is(created)
			? console.log("Authorization test failed due to card creation error: ", JSON.stringify(created, null, 2))
			: (card = { id: created.id, scheme: created.scheme })
		const startAuthorization = performance.now()
		const { amount, description } = creatableInputs[~~(currentMinute / (60 / creatableInputs.length))]
		const result =
			card == undefined ? undefined : await client.post("/authorize", createCreatable(card, amount, description))
		console.log(`Authorization took ${performance.now() - startAuthorization} ms`)
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
const creatableInputs: { amount: pax2pay.Amount; description: string }[] = [
	{ amount: amount.low, description: "An upcheck test authorization, to succeed. with low amount flag." },
	{
		amount: amount.highOrganization,
		description: "An upcheck test authorization, to succeed. with high organization amount flag.",
	},
	{ amount: amount.highRealm, description: "An upcheck test authorization, to succeed. with high realm amount flag." },
]
function createCreatable(card: { id: string; scheme: string }, amount: pax2pay.Amount, description: string) {
	return {
		amount: amount[1],
		counterpart: {
			category: "4511",
			city: "Breathing",
			country: "GB",
			name: "paxair",
			type: "merchant",
			id: "abcd1234",
			address: "Streetname 1, 12345 Towncity",
			acquirer: {
				/* cspell: disable-next-line */
				id: "2345erty",
				retrievalReferenceNumber: "120600001965",
				systemTraceAuditNumber: "494868",
				country: "GB",
			},
		},
		currency: amount[0],
		description,
		instrument: { id: card.id, type: "card" },
		rail: card.scheme,
		reference: crypto.randomUUID(),
		type: "outgoing",
	}
}
