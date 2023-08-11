import "isomorphic-fetch"
import { pax2pay } from "@pax2pay/model-banking"
import { http } from "cloudly-http"
import * as dotenv from "dotenv"

dotenv.config()

const client =
	process.env.paxgiroUrl && process.env.paxgiroAuth
		? new http.Client(process.env.paxgiroUrl, process.env.paxgiroAuth)
		: undefined

describe("pax2pay.Authorization", () => {
	let authorization: pax2pay.Authorization | undefined
	let failedAuthorization: pax2pay.Authorization | undefined
	beforeAll(async () => {
		authorization = await client?.post<pax2pay.Authorization>("/authorization", creatable)
		console.log("authorization", authorization)
		failedAuthorization = await client?.post<pax2pay.Authorization>("/authorization", failedCreatable)
	})
	it("create succeeded", () => {
		expect(pax2pay.Authorization.is(authorization))
		expect(authorization?.status).toEqual("approved")
	})
	it("create failed", () => {
		expect(failedAuthorization?.status).not.toEqual("approved")
	})
})

const creatable: pax2pay.Authorization.Creatable = {
	card: "zzzzztgdunMKF7ur",
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
const failedCreatable: pax2pay.Authorization.Creatable = {
	card: "zzzzztgdunMKF7ur",
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
