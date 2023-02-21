import { collection, addDoc } from 'firebase/firestore'
import { clientDb } from './db'
// Add a new document in the "competitions"" collection with basic information about the competition
export default async function addCompetition(
	competitionName: string,
	competitionDate: string,
	competitionLocation: string,
	competitionDescription: string,
	competitionImage: string
) {
	const docRef = await addDoc(collection(clientDb, 'competitions'), {
		competitionName,
		competitionDate,
		competitionLocation,
		competitionDescription,
		competitionImage,
	})
	console.log('Document written with ID: ', docRef.id)
}
