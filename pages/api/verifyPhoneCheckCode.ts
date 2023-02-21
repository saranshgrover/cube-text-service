// API using the Twilio Verify API to verify a phone number
import { NextApiRequest, NextApiResponse } from 'next'
const authToken = process.env.TWILIO_AUTH_TOKEN
const accountSid = process.env.TWILIO_ACCOUNT_SID
import addUser from '../../firebase/addUser'

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method === 'POST') {
		const { phoneNumber, code, name, selectedEvents, competitionId } = req.body
		const client = require('twilio')(accountSid, authToken)
		console.log(code)
		try {
			const verify = await client.verify
				.services('VA7df62011d6704dc0be3edf0ac2e9aff1')
				.verificationChecks.create({
					to: phoneNumber,
					code: code,
				})
			if (verify.status === 'approved') {
				const user = await addUser(
					{ phoneNumber, name, selectedEvents },
					competitionId
				)
				if (user) {
					await client.messages.create({
						body: `Hello ${name}, you have successfully registered for the following events: ${selectedEvents.join(
							', '
						)}`,
						from: process.env.MY_NUMBER,
						to: phoneNumber,
					})
					res.status(200).json({ status: verify.status })
				} else {
					res.status(500).json({ error: 'Error adding user to database' })
				}
			}
		} catch (err) {
			console.log(err)
			res.status(500).json({ error: err })
		}
	}
}
