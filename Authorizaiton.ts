import { gracely } from "gracely"
import { isoly } from "isoly"
import { pax2pay } from "@pax2pay/model-banking"

export namespace Authorization {
	async function getCard(client: pax2pay.Client | undefined, amount: number) {
		const cards = (await client?.cards.list().then(r => (gracely.Error.is(r) ? [] : r))) ?? []
		let card: any = undefined
		console.log("cards:", cards)
		while (!card && (cards?.length ?? 0) > 0) {
			const contender = cards?.shift()
			if (contender && contender.organization == client?.organization)
				card = (
					await client?.cards
						.fetch(contender.id)
						.then(c =>
							!gracely.Error.is(c) && c.limit[0] == Authorization.currency && c.limit[1] > amount && c.rules.length == 0
								? c
								: undefined
						)
				)?.id
		}
		return card
	}
	export async function getCreatables(
		client: pax2pay.Client | undefined
	): Promise<Record<"succeeding" | "failing", Omit<pax2pay.Authorization.Creatable, "reference">>> {
		const currentMinute = isoly.DateTime.getMinute(isoly.DateTime.now())
		const creatable = successes[~~(currentMinute / (60 / successes.length))]
		const card: string = await getCard(client, creatable.amount[1])
		return {
			succeeding: { ...creatable, card },
			failing: {
				...fails[~~(currentMinute / (60 / fails.length))],
				card,
			},
		}
	}

	export const currency = "GBP"
}
const amount: Record<
	"low" | "normal" | "highOrganization" | "highRealm" | "veryHighOrganization" | "veryHighRealm",
	pax2pay.Amount
> = {
	low: [Authorization.currency, 1],
	normal: [Authorization.currency, 15],
	highOrganization: [Authorization.currency, 501],
	highRealm: [Authorization.currency, 801],
	veryHighOrganization: [Authorization.currency, 2000],
	veryHighRealm: [Authorization.currency, 2600],
}
const baseCreatable: Omit<pax2pay.Authorization.Creatable, "card" | "reference"> = {
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
	description: "An upcheck test authorization, to succeed",
}
const successes: Omit<pax2pay.Authorization.Creatable, "card" | "reference">[] = [
	{ ...baseCreatable, amount: amount.low, description: baseCreatable.description + " with low amount flag." },
	baseCreatable,
	{
		...baseCreatable,
		amount: amount.highOrganization,
		description: baseCreatable.description + " with high organizaiton amount flag.",
	},
	{
		...baseCreatable,
		amount: amount.highRealm,
		description: baseCreatable.description + " with high realm amount flag.",
	},
]
const fails: Omit<pax2pay.Authorization.Creatable, "card" | "reference">[] = [
	{
		...baseCreatable,
		merchant: { ...baseCreatable.merchant, country: "KP" },
		description: "Authorization to fail on the realm level due to sanctioned merchant country.",
	},
	{
		...baseCreatable,
		amount: amount.veryHighOrganization,
		description: "Authorization to fail on the organization level due to very high amount.",
	},
	{
		...baseCreatable,
		amount: amount.veryHighRealm,
		description: "Authorization to fail on the realm level due to very high amount.",
	},
	{
		...baseCreatable,
		merchant: {
			...baseCreatable.merchant,
			name: "paxsino",
			category: "7801",
		},
		description: "Authorization to fail due to casino MCC.",
	},
	{
		...baseCreatable,
		merchant: {
			...baseCreatable.merchant,
			name: "pax dog and horse racing",
			category: "7802",
		},
		description: "Authorization to fail due to gambling MCC.",
	},
]
