import { NodusActivity } from '@/types/activity'
import { useColorModeValue } from '@chakra-ui/color-mode'
import {
	Box,
	Circle,
	Flex,
	Grid,
	GridItem,
	Heading,
	Center,
} from '@chakra-ui/layout'
import { Competition, Venue } from '@wca/helpers'
import React from 'react'
import ActivityList from './ActivityList'

type Props = {
	venue: Venue
	competition: Competition
	live: boolean
}

export default function VenueManager({ venue, competition, live }: Props) {
	const rooms = venue.rooms
	console.log(rooms.length)
	const border = useColorModeValue('black', 'white')
	const bg = useColorModeValue('blackAlpha.50', 'whiteAlpha.100')
	return (
		<Grid
			mt='2em'
			templateColumns={{
				sm: `repeat(1, 1fr)`,
				lg: `repeat(${rooms.length}, 1fr)`,
			}}
			gap={6}
			w='100%'>
			{/* // templateRows={{ default: `repeat(${rooms.length},1fr)`, md: undefined }} */}

			{rooms.map((room) => (
				<GridItem
					bgColor={bg}
					key={room.id}
					border='1px'
					borderRadius={'md'}
					h={{ sm: '30vh', lg: live ? '80vh' : '70vh' }}>
					<Flex
						h={{ sm: '20%', lg: 'auto' }}
						p={2}
						w='100%'
						justify={'center'}
						align='center'
						gap={3}
						mb='0.5em'
						borderBottom={'1px'}>
						<Circle
							border={`1px solid ${border}`}
							size={'10'}
							bgColor={room.color}
						/>
						<Heading>{room.name}</Heading>
					</Flex>
					<Box
						h={{ sm: '75%', lg: '70%' }}
						maxH={{ sm: '75%', lg: '100%' }}
						overflowY='auto'>
						<ActivityList
							live={live}
							competitionId={competition.id}
							roomId={room.id}
							venueId={venue.id}
							activities={room.activities as NodusActivity[]}
						/>
					</Box>
				</GridItem>
			))}
		</Grid>
	)
}
