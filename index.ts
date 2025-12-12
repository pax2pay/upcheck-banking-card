async function createCard(): Promise<void> {}
async function createAuthorization(): Promise<void> {
	const card = await createCard()
	console.log(card)
}

main()
async function main(): Promise<void> {
	try {
		await createAuthorization()
		await 
	} catch (e) {
		slack(e)
	}
}
