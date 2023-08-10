import { gracely } from "gracely"
import "isomorphic-fetch"
import { pax2pay } from "@pax2pay/model-banking"
import * as dotenv from "dotenv"

dotenv.config()

const client = process.env.url && process.env.key ? pax2pay.Client.create(process.env.url, process.env.key) : undefined
client && (client.realm = "test")
client && (client.organization = "Y2TgAgLN")

describe("pax2pay.Card", () => {
	let card: gracely.Error | pax2pay.Card | undefined
	let fetched: pax2pay.Card | undefined
	beforeAll(async () => {
		card = await client?.cards.create(creatable)
		fetched = await client?.cards.fetch(id).then(r => (gracely.Error.is(r) ? undefined : r))
	})
	it("create", () => {
		expect(pax2pay.Card.is(card)).toBeTruthy()
	})
	it("fetch", () => {
		expect(pax2pay.Card.is(fetched)).toBeTruthy()
	})
	it("update", async () => {
		const amount = fetched?.limit[1] == 2000 ? 1000 : 2000
		const updated = await client?.cards
			.update(fetched?.id ?? id, {
				limit: ["USD", amount],
			})
			.then(r => (gracely.Error.is(r) ? undefined : r))
		expect(pax2pay.Card.is(updated)).toBeTruthy()
		expect(updated?.limit[1]).toEqual(amount)
	})
})

const id = "03s9NKVp"
const creatable: pax2pay.Card.Creatable = {
	account: "0qbsfo2j",
	details: { expiry: [26, 12], holder: "Upcheck", iin: "411111" },
	limit: ["USD", 1000],
	preset: "p2p-ta-pg-200",
	rules: [],
}
