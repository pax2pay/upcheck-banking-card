import { gracely } from "gracely"
import { pax2pay } from "@pax2pay/model-banking"
import { http } from "cloudly-http"
import * as dotenv from "dotenv"

export class Clients {
	token?: string
	pax2pay?: pax2pay.Client & Record<string, any>
	paxgiro?: http.Client
	constructor() {}
	async login(): Promise<boolean> {
		const key = (await this.pax2pay?.me.login(process.env.email ?? "", process.env.password ?? "", "test")) as any as
			| string
			| gracely.Error
			| undefined
		if (gracely.Error.is(key) || !key)
			return false
		else {
			this.token = key
			this.paxgiro && (this.paxgiro.key = key)
			this.pax2pay && (this.pax2pay.key = key)
			return true
		}
	}

	static async open(): Promise<Clients> {
		const start = performance.now()
		const clients = new Clients()
		clients.paxgiro =
			process.env.paxgiroUrl && process.env.paxgiroAuth
				? new http.Client(process.env.paxgiroUrl, process.env.paxgiroAuth)
				: undefined
		clients.pax2pay = process.env.url ? pax2pay.Client.create(process.env.url, "") : undefined
		clients.pax2pay && (clients.pax2pay.realm = "test")
		/* cspell: disable-next-line */
		clients.pax2pay && (clients.pax2pay.organization = "agpiPo0v")
		await clients.login()
		console.log(`Clients opened in ${performance.now() - start} ms`)
		return clients
	}
}
dotenv.config()
export const clients = Clients.open()
