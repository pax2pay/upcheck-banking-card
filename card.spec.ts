import { gracely } from "gracely"
import "isomorphic-fetch"
import { pax2pay } from "@pax2pay/model-banking"
import * as dotenv from "dotenv"

dotenv.config()

const client = process.env.url && process.env.key ? pax2pay.Client.create(process.env.url, process.env.key) : undefined
client && (client.realm = "test")
client && (client.organization = "agpiPo0v")

describe("pax2pay.Card", () => {
	let card: gracely.Error | pax2pay.Card | undefined
	let fetched: pax2pay.Card | undefined | gracely.Error
	beforeAll(async () => {
		card = await client?.cards.create(creatable)
		console.log("card", card)
		fetched = await client?.cards.fetch(id)
		console.log("fetched", fetched)
	})
	it("create", () => {
		expect(pax2pay.Card.is(card)).toBeTruthy()
	})
	it("fetch", () => {
		expect(pax2pay.Card.is(fetched)).toBeTruthy()
	})
	it("update", async () => {
		const amount = pax2pay.Card.is(fetched) && fetched?.limit[1] == 2000 ? 1000 : 2000
		const updated = await client?.cards
			.update(id, {
				limit: ["USD", amount],
			})
			.then(r => (gracely.Error.is(r) ? undefined : r))
		expect(pax2pay.Card.is(updated)).toBeTruthy()
		expect(updated?.limit[1]).toEqual(amount)
	})
})

const id = "zzzzztgfIFvzR0b_"
const creatable: pax2pay.Card.Creatable = {
	account: "WzauRHBO",
	details: { expiry: [26, 12], holder: "Upcheck", iin: "411111" },
	limit: ["USD", 1000],
	preset: "p2p-ta-pg-200",
	rules: [],
}
