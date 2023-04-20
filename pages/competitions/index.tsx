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
	useToast,
	Skeleton,
	Spinner,
	Center,
} from '@chakra-ui/react'
import { Competition } from '@wca/helpers/'
import { getUpcomingCompetitions } from '@/firebase/getCompetitions'
import Link from 'next/link'
import Head from '@/components/head'
import { useEffect, useState } from 'react'

interface Props {}

const UpcomingCompetitionsPage: React.FC<Props> = () => {
	const listBg = useColorModeValue('whiteAlpha.', 'blackAlpha.')
	const [data, setCompetitions] = useState<{
		competitions: Competition[] | null
	}>()
	const toast = useToast()
	useEffect(() => {
		getUpcomingCompetitions()
			.then((res) => setCompetitions({ competitions: res }))
			.catch((_) => toast({ title: 'Error', status: 'error' }))
	}, [])
	return (
		<>
			<Head title='Competitions - Drop Off Table' />
			<Box bg={`${listBg}800`} p={8} rounded='md'>
				<Heading mb={4} size='lg'>
					Upcoming Competitions
				</Heading>
				<List spacing={4}>
					{data?.competitions ? (
						<>
							{data.competitions.map((comp) => (
								<ListItem
									key={comp.id}
									borderBottom='1px'
									_first={{ borderTop: '1px' }}>
									<Flex
										align='center'
										justify='space-between'
										w='100%'
										px={4}
										direction={{ base: 'column', md: 'row' }}>
										<Box bg={`${listBg}700`} p={4} rounded='md'>
											<Heading as='a' size='md'>
												{comp.name}
											</Heading>
											<Text mt={2} fontSize='sm'>
												{`${comp.schedule.venues[0].countryIso2}`}
											</Text>
											<Text mt={2} fontSize='sm'>
												{comp.schedule.startDate}
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
						</>
					) : (
						<Center>
							<Spinner />
							<Skeleton height={'30px'} />
						</Center>
					)}
				</List>
			</Box>
		</>
	)
}

export default UpcomingCompetitionsPage
