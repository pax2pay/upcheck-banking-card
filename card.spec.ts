import { gracely } from "gracely"
import "isomorphic-fetch"
import { pax2pay } from "@pax2pay/model-banking"
import * as dotenv from "dotenv"
import { Card } from "./Card"
import { Clients } from "./Clients"

dotenv.config()
jest.setTimeout(15000)
let client: { pax2payClient?: pax2pay.Client & Record<string, any> }
let login: boolean | undefined
let card: pax2pay.Card

describe("pax2pay.Card", () => {
	beforeAll(async () => {
		client = await Clients.create()
		login = await Clients.login(client)
		let created: pax2pay.Card | gracely.Error
		let fetched: pax2pay.Card | gracely.Error
		if (!client.pax2payClient) {
			console.log("Client creation failed; check environment.")
		} else if (gracely.Error.is((created = await Card.create(client.pax2payClient)))) {
			console.log("Card creation failed in before all: ", JSON.stringify(created, null, 2))
		} else if (gracely.Error.is((fetched = await client.pax2payClient.cards.fetch(card.id)))) {
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
		const updated = await client?.pax2payClient?.cards.update(card?.id, {
			limit: [Card.currency, amount],
		})
		const isCard = pax2pay.Card.is(updated)
		if (!isCard) {
			console.log("updated: ", updated)
			console.log("updated flaw: ", pax2pay.Card.type.flaw(updated))
		}
		expect(isCard).toBeTruthy()
		expect(updated && "limit" in updated && updated.limit[1]).toEqual(amount)
	})
})
