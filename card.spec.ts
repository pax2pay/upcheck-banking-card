import { gracely } from "gracely"
import "isomorphic-fetch"
import { pax2pay } from "@pax2pay/model-banking"
import * as dotenv from "dotenv"
import { Card } from "./Card"
import { Clients } from "./Clients"

dotenv.config()
jest.setTimeout(15000)
let client: { pax2payClient?: pax2pay.Client & Record<string, any> }
let login: boolean | undefined = undefined
let card: pax2pay.Card | undefined = undefined

describe("pax2pay.Card", () => {
	beforeAll(async () => {
		client = await Clients.create()
		login = await Clients.login(client)
		let created: pax2pay.Card | gracely.Error
		let fetched: pax2pay.Card | gracely.Error
		if (!client.pax2payClient) {
			console.log("Client creation failed; check environment.")
		} else if (!pax2pay.Card.is((created = await Card.create(client.pax2payClient)))) {
			console.log("Card creation failed in before all: ", JSON.stringify(created, null, 2))
		} else if (!pax2pay.Card.is((fetched = await client.pax2payClient.cards.fetch(created.id)))) {
			console.log("Card fetch failed in before all: ", JSON.stringify(fetched, null, 2))
		} else
			card = created
	})
	it("get token", async () => {
		expect(login).toBeTruthy()
	})
	it("create", () => {
		expect(pax2pay.Card.is(card)).toBeTruthy()
	})
	it("update", async () => {
		const amount = 10000
		let updated: pax2pay.Card | gracely.Error | undefined = undefined
		if (!client.pax2payClient)
			console.log("Client creation failed; check environment.")
		else if (!card)
			console.log("card.update test failed due to global variable card being undefined.")
		else if (
			pax2pay.Card.is(
				(updated = await client.pax2payClient.cards.update(card.id, {
					limit: [Card.currency, amount],
				}))
			)
		)
			console.log(
				"card.update failed with: ",
				JSON.stringify(updated, null, 2),
				"\nflaw: ",
				JSON.stringify(pax2pay.Card.type.flaw(updated), null, 2)
			)
		expect(pax2pay.Card.is(updated)).toBeTruthy()
		expect(updated && "limit" in updated && updated.limit[1]).toEqual(amount)
	})
})
