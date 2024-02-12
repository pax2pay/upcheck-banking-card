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
let fetched: pax2pay.Card | undefined | gracely.Error

describe("pax2pay.Card", () => {
	beforeAll(async () => {
		const now = Date.now() / 1000
		client = await Clients.create()
		login = await Clients.login(client)
		const created = await Card.create(client?.pax2payClient)
		console.log("created", created)
		if (!created || gracely.Error.is(created))
			console.log("created", created)
		else {
			card = created
			fetched = await client?.pax2payClient?.cards.fetch(card.id)
			console.log("fetched", fetched)
		}
		console.log("before all", Date.now() / 1000 - now)
	})
	it("get token", async () => {
		expect(login).toBeTruthy()
	})
	it("create", () => {
		expect(pax2pay.Card.is(card)).toBeTruthy()
	})
	it("fetch", () => {
		expect(pax2pay.Card.is(fetched)).toBeTruthy()
	})
	it("update", async () => {
		const now = Date.now() / 1000
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
		console.log("update", Date.now() / 1000 - now)
	})
})
