import { gracely } from "gracely"
import { pax2pay } from "@pax2pay/model-banking"

export namespace Card {
	export const currency = "GBP"
	export async function create(client: pax2pay.Client, account?: string): Promise<pax2pay.Card | gracely.Error> {
		return await client.cards.create(typeof account == "string" ? { ...creatable, account } : creatable)
	}
	const keys = {
		public: `MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAv7LQNTjG1425nHqWSckzc3+0TuJTcUIWE+DM8nM5OlK49qYzsLBgR7H60fiVwIZ61rwlS3644V4Hg9CMdDCSb1A1kx7b3hrQOSykV6g/AP7y4RnTaE7kI/X8oh0oyS1WW1XC7F+5abaCfOracnqPNlVvCLAoSZjKAIp+oPBBqSP3Y5dfZEgk7bS+YF7Py2nY1GnXbfYOwKc3PIXiMkZkDzWIKY4w+bC/HH8XUVd/3FWnNfqLViHHHn6Qqmy4McxvTtPIAGWdwcPD3b7MimcclXcj3H+3v/EgV+Kb/rbdrmMQzZjOS5d7Q0OsChVNfzrZQwRMHJY6Jl3xzVyfDV/IPwIDAQAB`,
		private: `MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC/stA1OMbXjbmcepZJyTNzf7RO4lNxQhYT4Mzyczk6Urj2pjOwsGBHsfrR+JXAhnrWvCVLfrjhXgeD0Ix0MJJvUDWTHtveGtA5LKRXqD8A/vLhGdNoTuQj9fyiHSjJLVZbVcLsX7lptoJ86tpyeo82VW8IsChJmMoAin6g8EGpI/djl19kSCTttL5gXs/LadjUaddt9g7Apzc8heIyRmQPNYgpjjD5sL8cfxdRV3/cVac1+otWIccefpCqbLgxzG9O08gAZZ3Bw8PdvsyKZxyVdyPcf7e/8SBX4pv+tt2uYxDNmM5Ll3tDQ6wKFU1/OtlDBEwcljomXfHNXJ8NX8g/AgMBAAECggEABot201JYa5SRoTeIOQWvBYL3J3hPq/67HTugE6j+a7DWUsly21XyO5BmhVOs3TFaMUmkJlMxwbQBoqz0lqTv4vAEnDzB+e/FayZMiBec6w5JQYktsBJ9dILZ+LjxIwkyuRSQ/pv4CxVpmBU2lxD7IbpB+7Rz86tNPj58O0donnsmPkTIOMo7mmoFc46RWSTO65iCxeavK1n8bRS/+GyZ32SFFluUDkCw8Qng3umKUWd2njHzQWpZPwXHdyPN8+MCiF1pytq9817bsgjuRe6D9lVgN+9bmhrEwY6op0maKxkDdKyHFo1i/vhWHe5+Mykd/+aBxeH1gykd+witM+wJgQKBgQDiW4iZDIBQhOgBl/yo6gPL33bFwd2Pp8vylGboVVHiE5PWs/n3Y2OYwk/4ims8d3+NrMD4zrKbB0YJdE31J7SqIzxfFGx/VjD8oGlru81VpFydT1gc6uxIeUYCCcCjEpgkSAgEp+MKsMkxcYVeIBupZojeTGff+c/C0/dg610TvwKBgQDYzVxZIIYrLNU4Ky1cZtgOZeImnrbWKV8ZDrrNG4fz4df8EiKCB7bJ0p/xNQ5VBRjqJpe9gbOhUm1GLTjlDjdM4QAF3cgsFGmGUnxM+NfqbWAGmgR5xVvtg32+LMQtmYpyIpmRSB6qxI2wvXKv+A5oNTWApZe9L2ajM3E6ochrgQKBgFDr0jCMxI6EhQCU2jF0v3ix4Z8fCFsj7IhDP2rNnaFJyG9YFgO311I0HSzIJ0ANpF78pFwOYNGFTydwGbKLyE2OnTWMcqEvKgIWQrnOAMEeKjHevKxR27ipCjsOS3zA1/0Ydy1a65LV0odHgxs8NUdhLYrzG6t5fimzZ1uRqMu3AoGAIsw7cVbGEjH8+yn6+uTK8uypctdws0kqqWPy2a78kEmEmEH05fgE/7nd0CJa7YyG5jZRjqo9wbvwLB5gDmvMtns6vLZPRbv1AAlHSDd8uHTbv9OCumTSD3pWeWrIBiWp0g35phb0TSaFM4QE33eqIFHCB6cMhuIP0EwWdXm4KIECgYEAgCTuwr6mxC3XWFuF31BB1JI1eK0rWQdEkvfUHvKAKmN3gCun0eUwA6dSC9tgqWn31gxVhPP/bqmp/d4UtlsA8+pWYX9x8+JX86qaiCUNpd9zBGWuvyAdGF9CEfgDHtk+MuqUc431HQoRaNtVklRf8BR5J537Eah7Oc30SwhO71I=`,
	}
	export const creatable: pax2pay.Card.Creatable = {
		/* cspell: disable-next-line */
		account: "WzauRHBO",
		details: { expiry: [26, 12], holder: "Upcheck" },
		limit: [currency, 9000],
		preset: "test-ta-pg-200",
		rules: [],
		key: keys.public,
	}
}
