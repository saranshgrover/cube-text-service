import React from 'react'
import {
	Box,
	Flex,
	Heading,
	Text,
	Button,
	Image,
	Grid,
	Stack,
} from '@chakra-ui/react'
import Link from 'next/link'
import Head from '@/components/head'

const LandingPage: React.FC = () => {
	return (
		<>
			<Head title='Drop Off Table' />
			<Box
				w='100%'
				minH='100vh'
				// bgGradient='linear(to-b, #1cbbb4, #009688)'
				py={20}>
				<Flex
					direction={'column'}
					align='center'
					maxW='2xl'
					mx='auto'
					textAlign='center'>
					<Image
						w={64}
						h={64}
						src='/dropofftable.png'
						alt='cubing competition'
						mb={10}
					/>

					<Heading as='h1' size='4xl' fontWeight='bold' mb={2}>
						Drop Off Table
					</Heading>
					<Heading as='p' size='md' fontWeight={'semibold'} mb={4}>
						Live WCA Competition Software
					</Heading>
					<Text fontSize='2xl' mb={12}>
						Get real-time updates and notifications during cubing competitions
						sent straight to your phone via text message.
					</Text>
					<Stack
						direction={['column', 'row']}
						justify='center'
						align='center'
						mb={12}>
						<Link href='/competitions'>
							<Button
								size='lg'
								colorScheme='blue'
								variant='solid'
								mr={{ sm: 0, lg: 6 }}>
								For Competitors
							</Button>
						</Link>
						<Link href='/setup'>
							<Button size='lg' colorScheme='blue' variant='outline'>
								For Organizers
							</Button>
						</Link>
					</Stack>
				</Flex>
			</Box>
		</>
	)
}

export default LandingPage
