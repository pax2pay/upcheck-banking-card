import { gracely } from "gracely"
import { pax2pay } from "@pax2pay/model-banking"
import { Card } from "./Card"
import { Clients, clients } from "./Clients"

let card: pax2pay.Card | undefined = undefined
let client: Clients | undefined
describe("pax2pay.Card", () => {
	beforeAll(async () => {
		let created: pax2pay.Card | gracely.Error
		let fetched: pax2pay.Card | gracely.Error
		client = await clients
		if (!client?.pax2pay) {
			console.log("Client creation failed; check environment.")
		} else if (!pax2pay.Card.type.is((created = await Card.create(client.pax2pay)))) {
			console.log("Card creation failed in before all: ", JSON.stringify(created, null, 2))
		} else if (!pax2pay.Card.type.is((fetched = await client.pax2pay.cards.fetch(created.id)))) {
			console.log("Card fetch failed in before all: ", JSON.stringify(fetched, null, 2))
		} else
			card = created
	})
	it("create", () => {
		expect(pax2pay.Card.type.is(card)).toBeTruthy()
	})
	it("update", async () => {
		const amount = 10000
		let updated: pax2pay.Card | gracely.Error | undefined = undefined
		if (!client?.pax2pay)
			console.log("Client creation failed; check environment.")
		else if (!card)
			console.log("card.update test failed due to global variable card being undefined.")
		else if (
			!pax2pay.Card.type.is((updated = await client.pax2pay.cards.update(card.id, { limit: [Card.currency, amount] })))
		)
			console.log(
				"card.update failed with: ",
				JSON.stringify(updated, null, 2),
				"\nflaw: ",
				JSON.stringify(pax2pay.Card.type.flaw(updated), null, 2)
			)
		expect(pax2pay.Card.type.is(updated)).toBeTruthy()
		expect(updated && "limit" in updated && updated.limit[1]).toEqual(amount)
	})
})
