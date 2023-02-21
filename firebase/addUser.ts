import { firestore } from './adminDb'

interface UserInput {
	name: string
	phoneNumber: string
	selectedEvents: { label: string; value: string }[]
}

export default async function addUser(user: UserInput, competitionId: string) {
	try {
		for (const person of user.selectedEvents) {
			const userInfo = await firestore
				.collection('competitions')
				.doc(competitionId)
				.collection('persons')
				.doc(String(person.value))
				.get()
			const doc = userInfo.data()
			if (doc) {
				const batch = firestore.batch()
				// const prevDocIfAny = await firestore.collection('competitions').doc(competitionId).collection('users').where('phoneNumber','==',user.phoneNumber).wh
				const phoneNumRef = firestore
					.collection('competitions')
					.doc(competitionId)
					.collection('phoneNumbers')
					.doc()
				batch.set(phoneNumRef, {
					name: user.name,
					phoneNumber: user.phoneNumber,
					persons: user.selectedEvents.map((event) => String(event.value)),
				})
				const usersRef = firestore
					.collection('competitions')
					.doc(competitionId)
					.collection('users')
					.doc()
				batch.set(usersRef, {
					name: user.name,
					phoneNumber: user.phoneNumber,
					id: person.value,
					personName: person.label,
					activityIds: doc.activityIds ?? [],
					assignments: doc.assignments ?? [],
				})
				await batch.commit()
			}
		}
		return true
	} catch (e) {
		console.log(e)
		return null
	}
}
