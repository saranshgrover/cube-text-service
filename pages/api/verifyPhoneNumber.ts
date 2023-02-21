// API using the Twilio Verify API to verify a phone number
import { NextApiRequest, NextApiResponse } from 'next'
const authToken = process.env.TWILIO_AUTH_TOKEN
const accountSid = process.env.TWILIO_ACCOUNT_SID

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method === 'POST') {
		const { phoneNumber } = req.body
		const client = require('twilio')(accountSid, authToken)

		client.verify
			.services('VA7df62011d6704dc0be3edf0ac2e9aff1')
			.verifications.create({
				to: phoneNumber,
				channel: 'sms',
			})
			.then((verification: any) => {
				res.status(200).json({ status: verification.status })
			})
			.catch((err: any) => {
				console.log(err)
				res.status(500).json({ error: err })
			})
	}
}
