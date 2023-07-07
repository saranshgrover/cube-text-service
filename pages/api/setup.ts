import { addWcif } from '@/firebase/addWcif'
import { getCompetitionIds } from '@/firebase/getAdminConfigData'
import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { getToken } from 'next-auth/jwt'
import { authOptions } from './auth/[...nextauth]'
import { WCA_URL } from '@/config'
const secret = process.env.NEXTAUTH_SECRET

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const session = await getServerSession(req, res, authOptions)
	const token = await getToken({
		secret,
		req,
	})
	if (session && token) {
		const { id } = JSON.parse(req.body)
		const ids = await getCompetitionIds()
		if (!ids?.eligible?.some((i) => i === id)) res.status(404).json({})
		try {
			const wcaRes = await fetch(`${WCA_URL}/api/v0/competitions/${id}/wcif`, {
				method: 'GET',
				credentials: 'include',
				headers: new Headers({
					Authorization: `Bearer ${token.accessToken!}`,
				}),
			})
			const wcif = await wcaRes.json()
			const response = await addWcif(wcif)
			if (response) res.status(400).json({ status: 'success' })
			else res.status(404).json({ status: 'error' })
		} catch (err) {
			res.status(404).json({ status: 'error' })
		}
	} else {
		res.status(403).json({})
	}
}
