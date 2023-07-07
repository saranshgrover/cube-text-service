import { Activity, Schedule } from '@wca/helpers'

export const flattenActivities = (schedule: Schedule) => {
	let flatActivites: Activity[] = []
	for (const venue of schedule.venues) {
		for (const room of venue.rooms) {
			for (const activity of room.activities) {
				flatActivites.push(activity)
				if (activity.childActivities) {
					for (const childActivity of activity.childActivities)
						flatActivites.push(childActivity)
				}
			}
		}
	}
	return flatActivites
}
