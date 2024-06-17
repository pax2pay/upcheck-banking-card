import { gracely } from "gracely"
import { pax2pay } from "@pax2pay/model-banking"

export namespace Card {
	export const currency = "GBP"
	export async function create(client: pax2pay.Client, account?: string): Promise<pax2pay.Card | gracely.Error> {
		return await client.cards.create(typeof account == "string" ? { ...creatable, account } : creatable)
	}
	export const creatable: pax2pay.Card.Creatable = {
		/* cspell: disable-next-line */
		account: "WzauRHBO",
		details: { expiry: [26, 12], holder: "Upcheck" },
		limit: [currency, 9000],
		preset: "test-ta-pg-200",
		rules: [],
	}
}
