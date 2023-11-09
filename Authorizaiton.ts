import { gracely } from "gracely"
import { isoly } from "isoly"
import { pax2pay } from "@pax2pay/model-banking"
import { http } from "cloudly-http"
import { Card } from "./Card"

export namespace Authorization {
	const authorizations = ["succeeding", "failing", "flagless"] as const
	export type Authorizations = typeof authorizations[number]
	export async function create(
		client: http.Client,
		pax2payClient: pax2pay.Client
	): Promise<Partial<Record<Authorizations, pax2pay.Authorization>> | undefined> {
		const result: Partial<Record<Authorizations, pax2pay.Authorization>> = {}
		const currentMinute = isoly.DateTime.getMinute(isoly.DateTime.now())
		const currentHour = isoly.DateTime.getHour(isoly.DateTime.now())
		let card
		for (const authorization of authorizations) {
			!(authorization == "failing" && !(currentHour % 6) && currentMinute > 50) &&
				(card = await Card.create(pax2payClient).then(c => (gracely.Error.is(c) ? undefined : c?.id)))
			result[authorization] =
				card != undefined
					? await client?.post<pax2pay.Authorization>("/authorization", {
							...creatables[authorization][~~(currentMinute / (60 / creatables[authorization].length))],
							card,
					  })
					: undefined
		}
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
const flagless: Omit<pax2pay.Authorization.Creatable, "card" | "reference"> = {
	amount: amount.normal,
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
		id: "2345erty",
		number: "1351858913568",
		country: "GB",
	},
	description: "An upcheck test authorization, to succeed.",
}
const creatables: Record<Authorization.Authorizations, Omit<pax2pay.Authorization.Creatable, "card" | "reference">[]> =
	{
		succeeding: [
			{ ...flagless, amount: amount.low, description: flagless.description + " with low amount flag." },
			{
				...flagless,
				amount: amount.highOrganization,
				description: flagless.description + " with high organizaiton amount flag.",
			},
			{
				...flagless,
				amount: amount.highRealm,
				description: flagless.description + " with high realm amount flag.",
			},
		],
		flagless: [flagless],
		failing: [
			{
				...flagless,
				merchant: { ...flagless.merchant, country: "KP" },
				description: "Authorization to fail on the realm level due to sanctioned merchant country.",
			},
			{
				...flagless,
				amount: amount.veryHighOrganization,
				description: "Authorization to fail on the organization level due to very high amount.",
			},
			{
				...flagless,
				amount: amount.veryHighRealm,
				description: "Authorization to fail on the realm level due to very high amount.",
			},
			{
				...flagless,
				merchant: {
					...flagless.merchant,
					name: "paxsino",
					category: "7801",
				},
				description: "Authorization to fail due to casino MCC.",
			},
			{
				...flagless,
				merchant: {
					...flagless.merchant,
					name: "pax dog and horse racing",
					category: "7802",
				},
				description: "Authorization to fail due to gambling MCC.",
			},
		],
	}
