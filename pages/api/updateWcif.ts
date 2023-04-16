import { firestore } from '@/firebase/adminDb'
import { updateWcif } from '@/firebase/updateWcif'
import { Competition } from '@wca/helpers'
import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { getToken } from 'next-auth/jwt'
import { authOptions } from './auth/[...nextauth]'
const secret = process.env.NEXTAUTH_SECRET

export default async function handler(
	req: NextApiRequest,
	response: NextApiResponse
) {
	if (req.method === 'POST') {
		const session = await getServerSession(req, response, authOptions)
		const token = await getToken({
			secret,
			req,
		})
		if (session && token) {
			const current = await firestore
				.collection('competitions')
				.doc('PretzelMania2023')
				.get()
			const currentComp = current.data()
			const wcaRes = await fetch(
				`https://worldcubeassociation.org/api/v0/competitions/PretzelMania2023/wcif`,
				{
					method: 'GET',
					credentials: 'include',
					headers: new Headers({
						Authorization: `Bearer ${token.accessToken!}`,
					}),
				}
			)
			const wcif = await wcaRes.json()
			if (currentComp) {
				const res = await updateWcif(currentComp as Competition, wcif)
				if (res === true) {
					console.log('done')
					response.status(200).json({})
				}
				if (res === false) {
					response.status(404).json({})
				}
			} else {
				response.status(403).json({})
			}
		}
		console.log('hello?')
		response.status(403).json({})
	}
}
