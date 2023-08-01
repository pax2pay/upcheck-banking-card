import "isomorphic-fetch"
import { pax2pay } from "@pax2pay/model-banking"
import * as dotenv from "dotenv"

dotenv.config()

const creatable: pax2pay.Card.Creatable = {
	account: "lgFWzV9m",
	details: { expiry: [26, 12], holder: "Upcheck", iin: "411111" },
	limit: ["GBP", 1000],
	preset: "p2p-ta-pg-200",
	rules: [],
}
const client = process.env.url && process.env.key ? pax2pay.Client.create(process.env.url, process.env.key) : undefined
client && (client.realm = "test")
client && (client.organization = "Y2TgAgLN")

describe("pax2pay.Card", () => {
	it("create", async () => {
		expect(pax2pay.Card.is(await client?.cards.create(creatable))).toBeTruthy()
	})
})
