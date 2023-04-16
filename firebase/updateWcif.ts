import { Competition } from '@wca/helpers'
import { firestore } from './adminDb'
import { FieldValue } from 'firebase-admin/firestore'
import { BigBatch } from '@/config/BigBatch'

export async function updateWcif(prevWcif: Competition, newWcif: Competition) {
	const persons = newWcif.persons
	const batch = new BigBatch({ firestore })
	const compRef = firestore.collection('competitions').doc(prevWcif.id)

	const compPersonRef = firestore
		.collection('competitions')
		.doc(prevWcif.id)
		.collection('persons')
	for (const person of persons) {
		batch.update(compPersonRef.doc(String(person.wcaUserId)), {
			...person,
			activityIds: person.assignments?.map((a) => a.activityId) || [],
		})
	}
	try {
		await batch.commit()
		for (const person of persons) {
			const assignments = person.assignments
			const activityIds = person.assignments?.map((a) => a.activityId) || []
			const docs = await firestore
				.collection('competitions')
				.doc('PretzelMania2023')
				.collection('users')
				.where('personName', '==', person.name)
				.get()
			for (const doc of docs.docs) {
				await firestore
					.collection('competitions')
					.doc('PretzelMania2023')
					.collection('users')
					.doc(doc.id)
					.update({ assignments, activityIds })
			}
		}
		return true
	} catch (err) {
		return false
	}
}
