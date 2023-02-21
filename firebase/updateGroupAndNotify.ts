import { NodusActivity } from '@/types/activity'
import { firestore } from '@/firebase/adminDb'
import { Venue } from '@wca/helpers'

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
		return true
	} catch (err) {
		return false
	}
}
