import { firestore } from './adminDb'

export interface CompetitionIds {
	eligible: string[]
	added: string[]
}

export async function getCompetitionIds(): Promise<CompetitionIds | undefined> {
	const res = await firestore
		.collection('adminConfig')
		.doc('competitions')
		.get()
	return res.data() as CompetitionIds
}
