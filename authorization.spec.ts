import { pax2pay } from "@pax2pay/model-banking"
import { Authorization } from "./Authorization"
import { Clients, clients } from "./Clients"

let client: Clients | undefined
let authorization: pax2pay.Authorization | undefined
describe("pax2pay.Authorization", () => {
	beforeAll(async () => {
		client = await clients
		authorization = client.paxgiro && client.pax2pay && (await Authorization.create(client.paxgiro, client.pax2pay))
	})
	it("get token", async () => {
		expect(client?.token).toBeTruthy()
	})
	it("create authorization", () => {
		authorization?.status !== "approved" && console.log("succeeding", JSON.stringify(authorization, null, 2))
		expect(pax2pay.Authorization.type.is(authorization))
		expect(authorization?.status).toEqual("approved")
	})
})
