import "isomorphic-fetch"
import { pax2pay } from "@pax2pay/model-banking"
import { Authorization } from "./Authorization"
import { Clients, clients } from "./Clients"

jest.setTimeout(20000)
let client: Clients | undefined
let authorization: Partial<Record<Authorization.Authorizations, pax2pay.Authorization>> | undefined
describe("pax2pay.Authorization", () => {
	beforeAll(async () => {
		client = await clients
		authorization = client.paxgiro && client.pax2pay && (await Authorization.create(client.paxgiro, client.pax2pay))
	})
	it("get token", async () => {
		expect(client?.token).toBeTruthy()
	})
	it("create succeeding", () => {
		authorization?.succeeding?.status !== "approved" &&
			console.log("succeeding", JSON.stringify(authorization?.succeeding, null, 2))
		expect(pax2pay.Authorization.type.is(authorization?.succeeding))
		expect(authorization?.succeeding?.status).toEqual("approved")
	})
	// it("create failing", () => {
	// 	authorization?.failing?.status === "approved" &&
	// 		console.log("failing", JSON.stringify(authorization?.failing, null, 2))
	// 	expect(authorization?.failing?.status).not.toEqual("approved")
	// })
	// it("create credit", () => {
	// 	authorization?.credit?.status !== "approved" &&
	// 		console.log("credit", JSON.stringify(authorization?.credit, null, 2))
	// 	expect(authorization?.credit?.status).toEqual("approved")
	// })
})
