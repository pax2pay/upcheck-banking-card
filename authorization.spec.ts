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
	let authorization: pax2pay.Authorization | undefined
	let failedAuthorization: pax2pay.Authorization | undefined
	beforeAll(async () => {
		const { succeeding, failing } = await Authorization.getCreatables(pax2payClient)
		authorization = await client?.post<pax2pay.Authorization>("/authorization", succeeding)
		console.log("authorization", JSON.stringify(authorization, null, 2))
		failedAuthorization = await client?.post<pax2pay.Authorization>("/authorization", failing)
	})
	it("create succeeded", () => {
		expect(pax2pay.Authorization.is(authorization))
		expect(authorization?.status).toEqual("approved")
	})
	it("create failed", () => {
		expect(failedAuthorization?.status).not.toEqual("approved")
	})
})
