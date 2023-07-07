import { Box, Flex, Heading, List, ListItem, Text } from '@chakra-ui/layout'
import {
	Accordion,
	AccordionItem,
	AccordionButton,
	AccordionPanel,
	AccordionIcon,
	useColorModeValue,
} from '@chakra-ui/react'
import { parseActivityCode, activityCodeToName, Person } from '@wca/helpers'
import { NodusActivity } from '@/types/activity'
import React, { useEffect, useMemo, useState } from 'react'
import '@cubing/icons'
import UpdateActivityModal from './UpdateActivityModal'
import useStore from '@/config/store'

type Props = {
	activities: NodusActivity[]
	roomId: number
	venueId: number
	competitionId: string
	live: boolean
}

export default function ActivityList({
	activities,
	roomId,
	venueId,
	competitionId,
	live,
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
	const { competitors } = useStore()
	const [selectedActivity, setSelectedActivity] = useState<NodusActivity>()
	const [expandedActivity, setExpandedActivity] = useState<NodusActivity>()
	const [selectedCompetitors, setSelectedCompetitors] = useState<Person[]>()
	useEffect(() => {
		if (expandedActivity) {
			const filteredCompetitors = competitors?.filter((comp) =>
				comp.assignments?.some(
					(assignment) => assignment.activityId === expandedActivity.id
				)
			)
			setSelectedCompetitors(filteredCompetitors)
		}
	}, [expandedActivity, competitors])
	const ongoing = useColorModeValue('green.200', 'green.600')

	return (
		<>
			{live ? (
				<List>
					{allActivities
						.filter((activity) => activity.status === 'ongoing')
						.map((activity) => {
							return (
								<ListItem
									borderRadius={'md'}
									w='100%'
									h='100%'
									as='button'
									key={activity.id}
									textAlign='center'
									px={1}
									pt={2}
									pb={3}>
									<Flex
										height={'100%'}
										justify='center'
										align='center'
										direction={'column'}
										gap={2}>
										{activity.activityCode.includes('other') ? (
											<Heading size='4xl'>
												{activity.activityCode.substring(6)}
											</Heading>
										) : (
											<>
												{!isNaN(Number(activity?.activityCode.slice(0, 1))) && (
													<Box
														fontSize={'100'}
														className={`cubing-icon event-${
															parseActivityCode(activity?.activityCode).eventId
														}`}></Box>
												)}
												<Heading size='2xl'>
													{
														parseActivityCode(activity?.activityCode ?? '')
															?.eventId
													}
												</Heading>

												<Heading size='4xl'>
													Group{' '}
													{
														parseActivityCode(activity.activityCode)
															?.groupNumber
													}
												</Heading>
											</>
										)}
									</Flex>
									{/* <Text>{new Date(activity.startTime).toLocaleString()}</Text> */}
								</ListItem>
							)
						})}
				</List>
			) : (
				<Accordion px={2} allowToggle={true}>
					{allActivities.map((activity) => (
						<AccordionItem
							h='100%'
							borderRadius={'md'}
							bgColor={
								activity.status === 'ongoing'
									? ongoing
									: activity.status === 'completed'
									? 'dimgray'
									: ''
							}
							w='100%'
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
							<Flex w='100%' justify='space-between'>
								<Box
									w='100%'
									as='button'
									onClick={() => {
										setSelectedActivity(activity)
									}}>
									<Flex
										w='80%'
										gap={2}
										as='button'
										justify={'flex-start'}
										alignContent={'flex-start'}>
										{!isNaN(Number(activity.activityCode.slice(0, 1))) && (
											<Box
												className={`cubing-icon event-${
													parseActivityCode(activity.activityCode).eventId
												}`}></Box>
										)}
										<Heading fontSize={'md'}>{activity.name}</Heading>
									</Flex>
									<Text textAlign={'start'}>
										{new Date(activity.startTime).toLocaleString()}
									</Text>
								</Box>
								<AccordionButton
									w='auto'
									onClick={() =>
										expandedActivity?.id !== activity.id &&
										setExpandedActivity(activity)
									}>
									<AccordionIcon />
								</AccordionButton>
							</Flex>
							<AccordionPanel>
								<List>
									{expandedActivity?.id === activity.id && (
										<Flex direction={{ base: 'column', md: 'row' }} gap={4}>
											<Box>
												<Heading size='md'>Compete</Heading>
												{selectedCompetitors
													?.filter((c) =>
														c.assignments?.find(
															(a) =>
																a.activityId === activity.id &&
																a.assignmentCode.includes('competitor')
														)
													)
													.map((person) => (
														<ListItem key={person.wcaUserId}>
															{person.name}
														</ListItem>
													))}
											</Box>
											<Box>
												<Heading size='md'>Scramble</Heading>
												{selectedCompetitors
													?.filter((c) =>
														c.assignments?.find(
															(a) =>
																a.activityId === activity.id &&
																a.assignmentCode.includes('scramble')
														)
													)
													.map((person) => (
														<ListItem key={person.wcaUserId}>
															{person.name}
														</ListItem>
													))}
											</Box>
											<Box>
												<Heading size='md'>Judge</Heading>
												{selectedCompetitors
													?.filter((c) =>
														c.assignments?.find(
															(a) =>
																a.activityId === activity.id &&
																a.assignmentCode.includes('judge')
														)
													)
													.map((person) => (
														<ListItem key={person.wcaUserId}>
															{person.name}
														</ListItem>
													))}
											</Box>
											<Box>
												<Heading size='md'>Run</Heading>
												{selectedCompetitors
													?.filter((c) =>
														c.assignments?.find(
															(a) =>
																a.activityId === activity.id &&
																a.assignmentCode.includes('run')
														)
													)
													.map((person) => (
														<ListItem key={person.wcaUserId}>
															{person.name}
														</ListItem>
													))}
											</Box>
										</Flex>
									)}
								</List>
							</AccordionPanel>
						</AccordionItem>
					))}
				</Accordion>
			)}
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
