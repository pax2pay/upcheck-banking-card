import { gracely } from "gracely"
import { pax2pay } from "@pax2pay/model-banking"
import { http } from "cloudly-http"

export namespace Clients {
	export async function create(): Promise<{
		pax2payClient?: pax2pay.Client & Record<string, any>
		paxgiro?: http.Client
	}> {
		const paxgiro =
			process.env.paxgiroUrl && process.env.paxgiroAuth
				? new http.Client(process.env.paxgiroUrl, process.env.paxgiroAuth)
				: undefined
		const pax2payClient = process.env.previewurl ? pax2pay.Client.create(process.env.previewurl, "") : undefined
		pax2payClient && (pax2payClient.realm = "test")
		pax2payClient && (pax2payClient.organization = "agpiPo0v")
		return { pax2payClient: pax2payClient, paxgiro: paxgiro }
	}
	export async function login(client: {
		pax2payClient?: pax2pay.Client & Record<string, any>
		paxgiro?: http.Client
	}): Promise<boolean> {
		const key = await client.pax2payClient
			?.userwidgets("https://user.pax2pay.app", "https://dash.pax2pay.app")
			.me.login({
				user: process.env.email ?? "",
				password: process.env.password ?? "",
			})
		if (gracely.Error.is(key) || !key)
			return false
		else {
			client.paxgiro && (client.paxgiro.key = key.token)
			client.pax2payClient && (client.pax2payClient.key = key.token)
			return true
		}
	}
}
