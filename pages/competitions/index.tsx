import {
	Box,
	Heading,
	Text,
	ListItem,
	List,
	useColorModeValue,
	Flex,
	Button,
	ButtonGroup,
} from '@chakra-ui/react'
import { Competition } from '@wca/helpers'
import { getUpcomingCompetitions } from '@/firebase/getCompetitions'
import Link from 'next/link'

interface Props {
	competitions: Competition[]
}

const UpcomingCompetitionsPage: React.FC<Props> = ({ competitions }) => {
	const listBg = useColorModeValue('whiteAlpha.', 'blackAlpha.')
	return (
		<Box bg={`${listBg}800`} p={8} rounded='md'>
			<Heading mb={4} size='lg'>
				Upcoming Competitions
			</Heading>
			<List spacing={4}>
				{competitions.map((comp) => (
					<ListItem
						key={comp.id}
						borderBottom='1px'
						_first={{ borderTop: '1px' }}>
						<Flex align='center' justify='space-between' w='100%' px={4}>
							<Box bg={`${listBg}700`} p={4} rounded='md'>
								<Heading as='a' size='md'>
									{comp.name}
								</Heading>
								<Text mt={2} fontSize='sm'>
									{`${comp.schedule.venues[0].countryIso2}`}
								</Text>
								<Text mt={2} fontSize='sm'>
									{new Date(comp.schedule.startDate).toLocaleDateString()}
								</Text>
							</Box>
							<ButtonGroup>
								<Link href={`/competition/${comp.id}/alerts`}>
									<Button variant='solid' colorScheme='blue'>
										Sign Up For Alerts
									</Button>
								</Link>
								<Link href={`/competition/${comp.id}/live`}>
									<Button variant='solid' colorScheme='red'>
										Live Updates
									</Button>
								</Link>
							</ButtonGroup>
						</Flex>
					</ListItem>
				))}
			</List>
		</Box>
	)
}

export default UpcomingCompetitionsPage

// Get static props function to get list of competitions
export async function getStaticProps() {
	const competitions = await getUpcomingCompetitions()
	return {
		props: {
			competitions,
		},
	}
}
