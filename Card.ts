import { gracely } from "gracely"
import { pax2pay } from "@pax2pay/model-banking"

export namespace Card {
	export const currency = "GBP"
	export async function create(client?: pax2pay.Client): Promise<pax2pay.Card | gracely.Error | undefined> {
		return await client?.cards.create(creatable)
	}
	export const creatable: pax2pay.Card.Creatable = {
		account: "WzauRHBO",
		details: { expiry: [26, 12], holder: "Upcheck" },
		limit: [currency, 9000],
		preset: "test-ta-pg-200",
		rules: [],
	}
}
