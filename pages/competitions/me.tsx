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
} from '@chakra-ui/react'
import { APICompetition, Competition } from '@/types/competition'
import Link from 'next/link'
import { ORIGIN_URL } from '@/config'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Head from '@/components/head'

interface Props {}

const UpcomingCompetitionsPage: React.FC<Props> = ({}) => {
	const [all, setAll] = useState<APICompetition[] | null>()
	const [settingUp, setSettingUp] = useState(false)
	const toast = useToast()
	const [added, setAdded] = useState<{
		eligible: string[]
		added: string[]
	} | null>()
	const router = useRouter()
	useEffect(() => {
		getComps()
	}, [])
	async function getComps() {
		const res = await fetch(`${ORIGIN_URL}/api/getMyCompetitions`)
		if (!res) return
		const json = await res.json()
		setAll(json.allCompetitions ?? [])
		setAdded(json.addedCompetitions ?? [])
	}

	async function addCompetition(id: string) {
		setSettingUp(true)
		try {
			const res = await fetch(`${ORIGIN_URL}/api/setup`, {
				method: 'POST',
				body: JSON.stringify({
					id,
				}),
			})
			const json = await res.json()
			setSettingUp(false)
			if (json.status === 'success') router.push(`/competition/${id}/manage`)
		} catch (err) {
			setSettingUp(false)
			toast({
				title: 'Error - Please try again',
				status: 'error',
			})
		}
	}

	const session = useSession()
	if (session.status === 'unauthenticated') router.push('/')
	const listBg = useColorModeValue('whiteAlpha.', 'blackAlpha.')
	if (!all) return <></>
	return (
		<>
			<Head title='Competitions - Drop Off Table' />
			<Box bg={`${listBg}800`} p={8} rounded='md'>
				<Heading mb={4} size='lg'>
					Your Managable Competitions
				</Heading>
				<List spacing={4}>
					{all.map((comp) => (
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
										{`${comp.city}`}
									</Text>
									<Text mt={2} fontSize='sm'>
										{new Date(comp.start_date).toLocaleDateString()}
									</Text>
								</Box>
								<ButtonGroup>
									{added?.added.some((s) => s === comp.id) ? (
										<Link href={`/competition/${comp.id}/manage`}>
											<Button variant='solid' colorScheme='blue'>
												Manage
											</Button>
										</Link>
									) : added?.eligible.some((s) => s === comp.id) ? (
										<Button
											isLoading={settingUp}
											onClick={() => addCompetition(comp.id)}
											variant='solid'
											colorScheme='blue'>
											Setup Now
										</Button>
									) : (
										<Link href={`mailto:contact@saranshgrover.com`}>
											<Button variant='solid' colorScheme='red'>
												Request Setup
											</Button>
										</Link>
									)}
								</ButtonGroup>
							</Flex>
						</ListItem>
					))}
				</List>
			</Box>
		</>
	)
}

export default UpcomingCompetitionsPage
