import env from '#config/env/env.js'

export async function fetchTariffs(date: string) {
	const url = `https://common-api.wildberries.ru/api/v1/tariffs/box?date=${date}`
	const apiKey = env.WB_API_KEY

	try {
		const response = await fetch(url, {
			method: 'GET',
			headers: {
				'Authorization': `Bearer ${apiKey}`,
				'Content-Type': 'application/json',
			},
		})

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`)
		}

		const data = await response.json()
		return data
	} catch (error) {
		console.error(error)
		return null
	}
}