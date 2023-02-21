import { firestore } from './adminDb'

export async function newUser(userInfo: any) {
	await firestore.collection('users').add(userInfo)
}
