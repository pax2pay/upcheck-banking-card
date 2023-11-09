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
	let succeeded: pax2pay.Authorization | undefined
	let flaglesslySucceeded: pax2pay.Authorization | undefined
	let failed: pax2pay.Authorization | undefined
	beforeAll(async () => {
		const { succeeding, failing, flagless } = await Authorization.getCreatables(pax2payClient)
		succeeded = await client?.post<pax2pay.Authorization>("/authorization", succeeding)
		flaglesslySucceeded = await client?.post<pax2pay.Authorization>("/authorization", flagless)
		failed = await client?.post<pax2pay.Authorization>("/authorization", failing)
	})
	it("create succeeded", () => {
		console.log("authorization", JSON.stringify(succeeded, null, 2))
		expect(pax2pay.Authorization.is(succeeded))
		expect(succeeded?.status).toEqual("approved")
	})
	it("create flagless", () => {
		console.log("flagless", JSON.stringify(succeeded, null, 2))
		expect(pax2pay.Authorization.is(flaglesslySucceeded))
		expect(flaglesslySucceeded?.status).toEqual("approved")
	})
	it("create failed", () => {
		console.log("failed", JSON.stringify(succeeded, null, 2))
		expect(failed?.status).not.toEqual("approved")
	})
})
