import { Box, Flex, Heading, List, ListItem, Text } from '@chakra-ui/layout'
import { parseActivityCode } from '@wca/helpers'
import { NodusActivity } from '@/types/activity'
import React, { useMemo, useState } from 'react'
import '@cubing/icons'
import UpdateActivityModal from './UpdateActivityModal'

type Props = {
	activities: NodusActivity[]
	roomId: number
	venueId: number
	competitionId: string
}

export default function ActivityList({
	activities,
	roomId,
	venueId,
	competitionId,
}: Props) {
	const allActivities = useMemo(
		() =>
			activities
				.flatMap((a) =>
					a.childActivities && a.childActivities.length > 0
						? a.childActivities.map((ca) => ({ ...ca, parent: a }))
						: a
				)
				//@ts-ignore
				.sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
				.sort((a, b) =>
					a.status === b.status ||
					((a.status === 'pending' || a.status === undefined) &&
						(b.status === 'pending' || b.status === undefined))
						? 0
						: a.status === 'completed' || b.status === 'ongoing'
						? 1
						: -1
				),
		[activities]
	)
	const [selectedActivity, setSelectedActivity] = useState<NodusActivity>()

	return (
		<>
			<List px={2} spacing={2}>
				{allActivities.map((activity) => (
					<ListItem
						borderRadius={'md'}
						bgColor={
							activity.status === 'ongoing'
								? 'green'
								: activity.status === 'completed'
								? 'dimgray'
								: ''
						}
						w='100%'
						as='button'
						onClick={() => {
							setSelectedActivity(activity)
						}}
						key={activity.id}
						textAlign='left'
						px={1}
						pt={2}
						pb={3}
						_hover={{
							bg:
								!activity.status || activity.status === 'pending'
									? 'whiteAlpha.300'
									: '',
						}}>
						<Flex gap={2}>
							{!isNaN(Number(activity.activityCode.slice(0, 1))) && (
								<Box
									className={`cubing-icon event-${
										parseActivityCode(activity.activityCode).eventId
									}`}></Box>
							)}
							<Heading fontSize={'md'}>{activity.name}</Heading>
						</Flex>
						<Text>{new Date(activity.startTime).toLocaleString()}</Text>
					</ListItem>
				))}
			</List>
			<UpdateActivityModal
				competitionId={competitionId}
				roomId={roomId}
				venueId={venueId}
				selectedActivity={selectedActivity}
				parentActivity={selectedActivity?.parent}
				onClose={() => setSelectedActivity(undefined)}
			/>
		</>
	)
}
