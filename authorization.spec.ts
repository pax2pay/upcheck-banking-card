import { gracely } from "gracely"
import "isomorphic-fetch"
import { pax2pay } from "@pax2pay/model-banking"
import { http } from "cloudly-http"
import * as dotenv from "dotenv"

dotenv.config()

const client =
	process.env.paxgiroUrl && process.env.paxgiroAuth
		? new http.Client(process.env.paxgiroUrl, process.env.paxgiroAuth)
		: undefined
const pax2payClient =
	process.env.url && process.env.key ? pax2pay.Client.create(process.env.url, process.env.key) : undefined
pax2payClient && (pax2payClient.realm = "test")
pax2payClient && (pax2payClient.organization = "agpiPo0v")
describe("pax2pay.Authorization", () => {
	let authorization: pax2pay.Authorization | undefined
	let failedAuthorization: pax2pay.Authorization | undefined
	beforeAll(async () => {
		const card = await pax2payClient?.cards.list().then(r => (gracely.Error.is(r) ? undefined : r[1].id))
		authorization = await client?.post<pax2pay.Authorization>("/authorization", { ...creatable, card })
		await client?.post<pax2pay.Authorization>("/authorization", {
			...creatable,
			card,
			amount: [creatable.amount[0], -creatable.amount[1]],
		}) // This is to revert the effect the authorization has on the account.
		console.log("authorization", authorization)
		failedAuthorization = await client?.post<pax2pay.Authorization>("/authorization", { ...failedCreatable, card })
	})
	it("create succeeded", () => {
		expect(pax2pay.Authorization.is(authorization))
		expect(authorization?.status).toEqual("approved")
	})
	it("create failed", () => {
		expect(failedAuthorization?.status).not.toEqual("approved")
	})
})

const creatable: Omit<pax2pay.Authorization.Creatable, "card" | "reference"> = {
	amount: ["USD", 1],
	merchant: {
		name: "Merchant",
		id: "abcd1234",
		category: "4511",
		country: "GB",
		address: "Streetname 1, 12345 Towncity",
	},
	acquirer: {
		id: "2345erty",
		number: "1351858913568",
		country: "GB",
	},
	description: "An upcheck test authorization, to succeed",
}
const failedCreatable: Omit<pax2pay.Authorization.Creatable, "card" | "reference"> = {
	amount: ["USD", 1],
	merchant: {
		name: "Merchant",
		id: "abcd1234",
		category: "4511",
		country: "KP",
		address: "Streetname 1, 12345 Towncity",
	},
	acquirer: {
		id: "2345erty",
		number: "1351858913568",
		country: "GB",
	},
	description: "An upcheck test authorization, to fail",
}
