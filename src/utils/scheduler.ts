import cron from 'node-cron'

export function plan(callback: Function): void {
	// every hour for example 13:00, 14:00, 15:00)
	//             s m h d m d
	cron.schedule('* 0 * * * *', async () => {
		console.log(
			`[${new Date().toLocaleString()}] Scheduled function started`
		)

		callback()
	})

	console.log('Scheduler started (runs hourly at 0 minutes)')
}
