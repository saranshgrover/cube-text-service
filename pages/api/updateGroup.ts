// Make sure user is logged in
// Make sure logged in user has permission to edit competition (is organizer/delegate)
// Update the assignment info
// If notification needed ->
// 	Find all users with activityId
//	Text all of them
import { getServerSession } from 'next-auth'
import { getToken } from 'next-auth/jwt'
import { authOptions } from './auth/[...nextauth]'
import { NextApiRequest, NextApiResponse } from 'next'
import { getCompetitionAllowed } from '@/firebase/getCompetitionAllowed'
import { updateGroupAndNotify } from '@/firebase/updateGroupAndNotify'
const secret = process.env.NEXTAUTH_SECRET

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method === 'POST') {
		const session = await getServerSession(req, res, authOptions)
		const token = await getToken({
			secret,
			req,
		})
		const { competitionId, activity, notify, venueId, roomId, parentActivity } =
			JSON.parse(req.body)
		if (
			session &&
			token &&
			competitionId &&
			activity &&
			notify &&
			venueId &&
			roomId
		) {
			const userId = token?.sub as string
			// check if user is allowed
			const allowed = await getCompetitionAllowed(competitionId, userId)
			if (!allowed) res.status(403).json({ error: 'Unauthorized' })
			else {
				try {
					const done = await updateGroupAndNotify(
						competitionId,
						activity,
						notify,
						Number(venueId),
						Number(roomId),
						parentActivity
					)
					if (done) res.status(400).json({ status: 'done' })
					else res.status(404).json({ error: 'Unable to update' })
				} catch (err) {
					res.status(404).json({ error: err })
				}
			}
		}
	}
}
