import "isomorphic-fetch"
import { pax2pay } from "@pax2pay/model-banking"
import { http } from "cloudly-http"
import * as dotenv from "dotenv"
import { Authorization } from "./Authorizaiton"

dotenv.config()
jest.setTimeout(15000)
export const client =
	process.env.paxgiroUrl && process.env.paxgiroAuth
		? new http.Client(process.env.paxgiroUrl, process.env.paxgiroAuth)
		: undefined
const pax2payClient =
	process.env.url && process.env.key ? pax2pay.Client.create(process.env.url, process.env.key) : undefined
pax2payClient && (pax2payClient.realm = "test")
pax2payClient && (pax2payClient.organization = "agpiPo0v")
describe("pax2pay.Authorization", () => {
	let authorization: Partial<Record<Authorization.Authorizations, pax2pay.Authorization>> | undefined
	beforeAll(async () => {
		authorization = client && pax2payClient && (await Authorization.create(client, pax2payClient))
	})
	it("create succeeding", () => {
		console.log("succeeding", JSON.stringify(authorization?.succeeding, null, 2))
		expect(pax2pay.Authorization.is(authorization?.succeeding))
		expect(authorization?.succeeding?.status).toEqual("approved")
	})
	it("create flagless", () => {
		console.log("flagless", JSON.stringify(authorization?.flagless, null, 2))
		expect(pax2pay.Authorization.is(authorization?.flagless))
		expect(authorization?.flagless?.status).toEqual("approved")
	})
	it("create failing", () => {
		console.log("failing", JSON.stringify(authorization?.failing, null, 2))
		expect(authorization?.failing?.status).not.toEqual("approved")
	})
})
