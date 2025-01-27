import "isomorphic-fetch"
import { pax2pay } from "@pax2pay/model-banking"
import { Card } from "./Card"
import { Clients, clients } from "./Clients"

jest.setTimeout(10 * 60 * 1000)
let client: Clients | undefined
describe("library", () => {
	beforeAll(async () => {
		client = await clients
	})
	it("paxgiro refunds", async () => {
		const total = 1
		const result = await refund(client, total)
		// const successes = result.reduce((sum: number, value) => sum + (value == 200 ? 1 : 0), 0)
		console.log("Refunded: ", result, " of ", total)
		expect(result).toEqual(total)
	})
})
async function refund(clients: Clients | undefined, total: number): Promise<number | undefined> {
	let result: number | undefined = undefined
	const card = clients && clients.pax2pay && (await Card.create(clients.pax2pay, "Sq0o_qOR"))
	if (pax2pay.Card.type.is(card)) {
		const creatables = new Array(total).fill(0).map(() => ({
			type: "refund",
			id: "string",
			batch: "20241211y7",
			card: (card as any).id + "Sq0o_qOR",
			merchant: {
				name: "paxair",
				id: "abcd1234",
				category: "4511",
				country: "GB",
				city: "upcheck town",
				zip: "12345",
				address: "Streetname 1, 12345 Towncity",
				reference: "2345erty-abcd1234",
			},
			acquirer: {
				id: "2345erty",
				number: "1351858913568",
				country: "GB",
			},
			fee: ["GBP", 1],
			amount: ["GBP", 1],
		}))
		const response = await fetch("https://banking.pax2pay.app/processor/test-tpl-paxgiro/refund", {
			body: JSON.stringify(creatables),
			method: "POST",
			headers: { "Content-Type": "application/json", authorization: "Bearer " + (clients?.token ?? "") },
		})
		const refunds = await response.json()
		if (Array.isArray(refunds))
			result = refunds.reduce((sum: number, value: any) => sum + (value.transaction?.status == "finalized" ? 1 : 0), 0)
		else
			console.log("Refund failed: ", JSON.stringify(refunds, null))
	} else
		console.log(card)
	return result
}
