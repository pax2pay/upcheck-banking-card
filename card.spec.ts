import { gracely } from "gracely"
import "isomorphic-fetch"
import { pax2pay } from "@pax2pay/model-banking"
import * as dotenv from "dotenv"
import { Card } from "./Card"

dotenv.config()
jest.setTimeout(15000)
const client = process.env.url && process.env.key ? pax2pay.Client.create(process.env.url, process.env.key) : undefined
client && (client.realm = "test")
client && (client.organization = "agpiPo0v")

describe("pax2pay.Card", () => {
	let card: pax2pay.Card
	let fetched: pax2pay.Card | undefined | gracely.Error
	beforeAll(async () => {
		const created = await Card.create(client)
		console.log("created", created)
		if (!created || gracely.Error.is(created))
			console.log("created", created)
		else {
			card = created
			fetched = await client?.cards.fetch(card.id)
			console.log("fetched", fetched)
		}
	})
	it("create", () => {
		expect(pax2pay.Card.is(card)).toBeTruthy()
	})
	it("fetch", () => {
		expect(pax2pay.Card.is(fetched)).toBeTruthy()
	})
	it("update", async () => {
		const amount = 10000
		const updated = await client?.cards
			.update(card?.id, {
				limit: [Card.currency, amount],
			})
			.then(r => (gracely.Error.is(r) ? (console.log("updated: ", r), undefined) : r))
		expect(pax2pay.Card.is(updated)).toBeTruthy()
		expect(updated?.limit[1]).toEqual(amount)
	})
})
