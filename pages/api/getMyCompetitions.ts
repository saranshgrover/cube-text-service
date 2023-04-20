import { getCompetitionIds } from '@/firebase/getAdminConfigData'
import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { getToken } from 'next-auth/jwt'
import { authOptions } from './auth/[...nextauth]'
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
		var today = new Date()
		var thirtyDaysAgo = new Date(
			new Date().setDate(today.getDate() - 30)
		).toISOString()

		const wcaRes = await fetch(
			`https://worldcubeassociation.org/api/v0/competitions?managed_by_me=true&start=${thirtyDaysAgo}`,
			{
				method: 'GET',
				credentials: 'include',
				headers: new Headers({
					Authorization: `Bearer ${token.accessToken!}`,
				}),
			}
		)
		const competitions = await wcaRes.json()
		const sortedCompetitions = competitions
			? competitions.sort(function (a: any, b: any) {
					// @ts-ignore
					return new Date(a.start_date) - new Date(b.start_date)
			  })
			: []
		const addedCompetitions = await getCompetitionIds()
		res.json({
			allCompetitions: sortedCompetitions,
			addedCompetitions,
		})
	} else {
		res.status(403).json({})
	}
}
