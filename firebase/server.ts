import * as admin from 'firebase-admin'
const app = !admin.apps.length
	? admin.initializeApp(
			{
				credential: admin.credential.cert({
					clientEmail:
						'firebase-adminsdk-byiyj@nodus-15cac.iam.gserviceaccount.com',
					privateKey: process.env.FIREBASE_PRIVATE_KEY,
					projectId: 'nodus-15cac',
				}),
			},
			'server'
	  )
	: admin.app()
const db = app.firestore()
export default db
