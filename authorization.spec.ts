import "isomorphic-fetch"
import { pax2pay } from "@pax2pay/model-banking"
import { http } from "cloudly-http"
import * as dotenv from "dotenv"
import { Authorization } from "./Authorization"
import { Clients } from "./Clients"

dotenv.config()
jest.setTimeout(15000)
let client: { pax2payClient?: pax2pay.Client & Record<string, any>; paxgiro?: http.Client }
let login: boolean | undefined
let authorization: Partial<Record<Authorization.Authorizations, pax2pay.Authorization>> | undefined
describe("pax2pay.Authorization", () => {
	beforeAll(async () => {
		const now = Date.now() / 1000
		client = await Clients.create()
		console.log("await Clients.create()", Date.now() / 1000 - now)
		login = client && (await Clients.login(client))
		console.log("login", Date.now() / 1000 - now)
		authorization =
			client.paxgiro && client.pax2payClient && (await Authorization.create(client.paxgiro, client.pax2payClient))
		console.log("pax2pay.Authorization", Date.now() / 1000 - now)
	})
	it("get token", async () => {
		expect(login).toBeTruthy()
	})
	it("create succeeding", () => {
		// console.log("succeeding", JSON.stringify(authorization?.succeeding, null, 2))
		expect(pax2pay.Authorization.is(authorization?.succeeding))
		expect(authorization?.succeeding?.status).toEqual("approved")
	})
	it("create flagless", () => {
		// console.log("flagless", JSON.stringify(authorization?.flagless, null, 2))
		expect(pax2pay.Authorization.is(authorization?.flagless))
		expect(authorization?.flagless?.status).toEqual("approved")
	})
	it("create failing", () => {
		// console.log("failing", JSON.stringify(authorization?.failing, null, 2))
		expect(authorization?.failing?.status).not.toEqual("approved")
	})
})
