import { clientDb } from './db'
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore'
import { Competition } from '@/types/competition'

export async function getAllCompetitions() {
	const q = query(collection(clientDb, 'competitions'))
	const querySnapshot = await getDocs(q)
	const competitions: Competition[] = []
	querySnapshot.forEach((doc) => {
		const { endTime, ...rest } = doc.data()
		competitions.push(rest as Competition)
	})
	return competitions
}

// Get upcoming competitions only
export async function getUpcomingCompetitions() {
	const q = query(collection(clientDb, 'competitions'))
	const querySnapshot = await getDocs(q)
	const competitions: Competition[] = []
	querySnapshot.forEach((doc) => {
		const { endTime, ...data } = doc.data()
		// Convert Timestamp to Date
		competitions.push(data as Competition)
	})
	return competitions
}
