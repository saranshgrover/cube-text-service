import { Competition, Person } from '@wca/helpers'
import { firestore } from './adminDb'

export async function getCompetitionAllowed(
	competitionId: string,
	userId: string
) {
	try {
		const user = await firestore
			.collection('competitions')
			.doc(competitionId)
			.collection('persons')
			.doc(userId)
			.get()
		const userInfo = user.data() as Person
		if (userInfo.roles?.includes('organizer')) return true
		if (userInfo.roles?.includes('delegate')) return true

		return false
	} catch (err) {
		return false
	}
}
