import { NodusActivity } from '@/types/activity'
import { firestore } from '@/firebase/adminDb'
import { activityCodeToName, Venue } from '@wca/helpers'
import Twilio from 'twilio/lib/rest/Twilio'
const authToken = process.env.TWILIO_AUTH_TOKEN
const accountSid = process.env.TWILIO_ACCOUNT_SID

function parseRole(role: string) {
	switch (role) {
		case 'competitor':
			return 'to COMPETE'
		case 'staff-judge':
			return 'to JUDGE'
		case 'staff-scrambler':
			return 'to SCRAMBLE'
		case 'staff-runner':
			return 'to RUN'
		default:
			return ''
	}
}

export async function updateGroupAndNotify(
	competitionId: string,
	activity: NodusActivity,
	notify: 'yes' | 'no',
	venueId: number,
	roomId: number,
	parentActivity: NodusActivity | null
) {
	try {
		const competitionDoc = await firestore
			.collection('competitions')
			.doc(competitionId)
			.get()
		const competition = competitionDoc.data()
		if (!competition) return false
		const venue = (competition.schedule.venues as Venue[]).find(
			(v: Venue) => v.id === venueId
		)
		if (!venue) return false
		const room = venue.rooms.find((r) => r.id === roomId)
		if (!room) return false
		const existingActivity = room.activities.find((a) => {
			if (parentActivity && a.id === parentActivity.id) return true
			else if (a.id === activity.id) return true
		})
		if (!existingActivity) return false
		const newCompetition = {
			...competition,
			schedule: {
				...competition.schedule,
				venues: [
					...competition.schedule.venues.filter((v: Venue) => v.id !== venueId),
					{
						...venue,
						rooms: [
							...venue.rooms.filter((r) => r.id !== roomId),
							{
								...room,
								activities: [
									...room.activities.filter(
										(a) => a.id !== existingActivity.id
									),
									{
										...existingActivity,
										childActivities:
											parentActivity &&
											existingActivity.childActivities !== null
												? [
														...existingActivity.childActivities?.filter(
															(a) => a.id !== activity.id
														),
														{
															...activity,
														},
												  ].sort((a, b) => a.id - b.id)
												: existingActivity.childActivities,
										status: !parentActivity ? activity.status : null,
									},
								].sort((a, b) => a.id - b.id),
							},
						].sort((a, b) => a.id - b.id),
					},
				].sort((a, b) => a.id - b.id),
			},
		}
		await firestore
			.collection('competitions')
			.doc(competitionId)
			.update(newCompetition)
		if (notify === 'yes') await updateCompetitors(activity, competitionId)
		return true
	} catch (err) {
		return false
	}
}

async function updateCompetitors(
	activity: NodusActivity,
	competitionId: string
) {
	const twilio: Twilio = require('twilio')(accountSid, authToken)
	const activityName = activityCodeToName(activity.activityCode)
	try {
		const competitorsSnapshot = await firestore
			.collection('competitions')
			.doc(competitionId)
			.collection('users')
			.where('activityIds', 'array-contains', activity.id)
			.get()
		if (competitorsSnapshot.empty) return
		else {
			for (const doc of competitorsSnapshot.docs) {
				const user = doc.data()
				const number = user.phoneNumber
				const assignment = user.assignments.find(
					(a: any) => a.activityId === activity.id
				)
				const message =
					activity.status === 'ongoing'
						? `Now Calling: ${activityName}. ${
								user.personName
						  } is scheduled ${parseRole(assignment.assignmentCode ?? '')}`
						: `Now Ending: ${activityName} has ended`
				await twilio.messages.create({
					body: message,
					from: process.env.TWILIO_MESSAGING_SID,
					to: number,
				})
			}
		}
	} catch (err) {
		console.log(err)
		return false
	}
}
