import { Assignment, Competition } from '@wca/helpers'
import { firestore } from './adminDb'
import { FieldValue } from 'firebase-admin/firestore'
import { BigBatch } from '@/config/BigBatch'
import { flattenActivities } from '@/utils/wcif'

export async function updateWcif(prevWcif: Competition, newWcif: Competition) {
	const persons = newWcif.persons
	const batch = new BigBatch({ firestore })
	const compRef = firestore.collection('competitions').doc(prevWcif.id)
	const personActivities: {
		[id: number]: {
			activities: number[]
			assignments: Assignment[] | undefined
		}
	} = {}
	const activities = flattenActivities(newWcif.schedule)

	const compPersonRef = firestore
		.collection('competitions')
		.doc(prevWcif.id)
		.collection('persons')
	for (const person of persons) {
		const personActivity = person.assignments?.map((a) => a.activityId) || []
		personActivities[person.wcaUserId] = {
			activities: personActivity,
			assignments: person.assignments,
		}
		batch.update(compPersonRef.doc(String(person.wcaUserId)), {
			...person,
			activityIds: personActivity,
		})
	}
	try {
		await batch.commit()
		const snapshot = await firestore
			.collection('competitions')
			.doc(prevWcif.id)
			.collection('users')
			.get()
		for (const doc of snapshot.docs) {
			const userData = doc.data()
			await firestore
				.collection('competitions')
				.doc(prevWcif.id)
				.collection('users')
				.doc(doc.id)
				.update({ ...userData, ...personActivities[userData.id] })
		}
		return true
	} catch (err) {
		return false
	}
}
