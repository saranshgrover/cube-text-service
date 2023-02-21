// initFirebaseAdmin.ts

import {
	AppOptions,
	cert,
	getApp,
	getApps,
	initializeApp,
	ServiceAccount,
} from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

const credentials: ServiceAccount = {
	clientEmail: 'firebase-adminsdk-byiyj@nodus-15cac.iam.gserviceaccount.com',
	privateKey: process.env.FIREBASE_PRIVATE_KEY,
	projectId: 'nodus-15cac',
}

const options: AppOptions = {
	credential: cert(credentials),
	databaseURL: process.env.databaseURL,
}

function createFirebaseAdminApp(config: AppOptions) {
	if (getApps().length === 0) {
		return initializeApp(config)
	} else {
		return getApp()
	}
}

const firebaseAdmin = createFirebaseAdminApp(options)
export const db = firebaseAdmin
export const firestore = getFirestore()
