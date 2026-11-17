import { gracely } from "gracely"
import { pax2pay } from "@pax2pay/model-banking"
import { http } from "cloudly-http"
import * as dotenv from "dotenv"

export class Clients {
	token?: string
	user?: pax2pay.Client
	pax2pay?: pax2pay.Client & Record<string, any>
	paxgiro?: http.Client
	constructor() {}
	async login(): Promise<boolean> {
		const key = await this.user?.me.login(process.env.email ?? "", process.env.password ?? "", "test")
		if (gracely.Error.is(key) || !key) {
			return false
		} else {
			this.token = key
			this.paxgiro && (this.paxgiro.key = key)
			this.user && (this.user.key = key)
			this.pax2pay && (this.pax2pay.key = key)
			return true
		}
	}

	static async open(): Promise<Clients> {
		const start = performance.now()
		const clients = new Clients()
		clients.paxgiro = new http.Client("https://sandbox.pays.pax2pay.app/hook/pseudopay", "")
		clients.user = pax2pay.Client.create("https://banking.pax2pay.app", "")
		clients.user && (clients.user.realm = "test")
		clients.pax2pay = pax2pay.Client.create("https://sandbox.pays.pax2pay.app/api/legacy", "")
		clients.pax2pay && (clients.pax2pay.realm = "test")
		clients.pax2pay && (clients.pax2pay.organization = "upcheck")
		await clients.login()
		console.log(`Clients opened in ${performance.now() - start} ms`)
		return clients
	}
}
dotenv.config()
export const clients = Clients.open()
