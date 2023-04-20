import { Competition } from '@wca/helpers'
import { firestore } from './adminDb'
import { FieldValue } from 'firebase-admin/firestore'
import { BigBatch } from '@/config/BigBatch'

export async function addWcif(wcif: Competition) {
	const batch = new BigBatch({ firestore })
	const { persons, ...rest } = wcif
	const compRef = firestore.collection('competitions').doc(wcif.id)
	const personRefs = []
	for (const person of persons) {
		personRefs.push({
			id: person.wcaUserId,
			name: person.name,
			wcaId: person.wcaId,
		})
	}
	batch.set(compRef, { ...rest, persons: personRefs, complete: false })
	const compPersonRef = firestore
		.collection('competitions')
		.doc(wcif.id)
		.collection('persons')
	for (const person of persons) {
		batch.set(compPersonRef.doc(String(person.wcaUserId)), {
			...person,
			activityIds: person.assignments?.map((a) => a.activityId) || [],
		})
	}
	const compIdRef = firestore.collection('adminConfig').doc('competitions')
	batch.update(compIdRef, {
		eligible: FieldValue.arrayRemove(wcif.id),
		added: FieldValue.arrayUnion(wcif.id),
	})
	try {
		await batch.commit()
		return true
	} catch (err) {
		return false
	}
}
