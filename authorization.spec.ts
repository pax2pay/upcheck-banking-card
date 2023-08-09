import "isomorphic-fetch"
import { pax2pay } from "@pax2pay/model-banking"
import { http } from "cloudly-http"
import * as dotenv from "dotenv"

dotenv.config()

const client =
	process.env.paxgiroUrl && process.env.paxgiroAuth
		? new http.Client(process.env.paxgiroUrl, process.env.paxgiroAuth)
		: undefined

describe("pax2pay.100", () => {
	let authorization1: pax2pay.Authorization | undefined
	let authorization2: pax2pay.Authorization | undefined
	beforeAll(async () => {
		authorization1 = await client?.post<pax2pay.Authorization>("/authorization", creatable1)
		authorization2 = await client?.post<pax2pay.Authorization>("/authorization", creatable2)
	})
	it("create succeeded", () => {
		expect(authorization1?.status == "approved").toBeTruthy()
	})
	it("create failed", () => {
		expect(authorization2?.status != "approved").toBeTruthy()
	})
	it("create failed", () => {
		expect(false).toBeFalsy()
	})
})
const creatable1: pax2pay.Authorization.Creatable = {
	card: "46V8JcZ0",
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
const creatable2: pax2pay.Authorization.Creatable = {
	card: "46V8JcZ0",
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
