import React from 'react'
import { Box, Flex, Heading, Text, Button, Image, Grid } from '@chakra-ui/react'
import Link from 'next/link'

const LandingPage: React.FC = () => {
	return (
		<>
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
						w={36}
						h={36}
						src='/nodus-orange.png'
						alt='cubing competition'
						mb={10}
					/>

					<Heading as='h1' size='4xl' fontWeight='bold' mb={2}>
						Nodus
					</Heading>
					<Heading as='p' size='md' fontWeight={'semibold'} mb={4}>
						Live WCA Competition Software
					</Heading>
					<Text fontSize='2xl' mb={12}>
						Get real-time updates and notifications during cubing competitions
						sent straight to your phone via text message.
					</Text>
					<Flex justify='center' alignItems='center' flexWrap='wrap' mb={12}>
						<Link href='/competitions'>
							<Button size='lg' colorScheme='blue' variant='solid' mr={6}>
								For Competitors
							</Button>
						</Link>
						<Link href='/setup'>
							<Button size='lg' colorScheme='blue' variant='outline'>
								For Organizers
							</Button>
						</Link>
					</Flex>
				</Flex>
			</Box>
		</>
	)
}

export default LandingPage
