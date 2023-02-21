import { Competition } from '@wca/helpers'
import { firestore } from './adminDb'

export async function getMyCompetitions(id: string) {
	let firestoreCompetitions: Competition[] = []
	const q = await firestore
		.collection('competitions')
		.where('managers', 'array-contains', id)
		.get()
	q.forEach((doc) => firestoreCompetitions.push(doc.data() as Competition))
	return firestoreCompetitions
}
