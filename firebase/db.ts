// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
	apiKey: 'AIzaSyCHPpweTbeP4IXNxe50taNiFTwxZnMGzA0',
	authDomain: 'nodus-15cac.firebaseapp.com',
	projectId: 'nodus-15cac',
	storageBucket: 'nodus-15cac.appspot.com',
	messagingSenderId: '95369301686',
	appId: '1:95369301686:web:8249385982d0ec4de1a017',
	measurementId: 'G-BGQ6KJJ9Z6',
}

// Initialize Firebase
const clientApp = initializeApp(firebaseConfig, 'client')
const clientDb = getFirestore(clientApp)

export { clientDb, clientApp }
