import React from 'react'
import {
	Box,
	Button,
	Flex,
	Grid,
	GridItem,
	Heading,
	Text,
	Stack,
	Image,
	VStack,
	Container,
} from '@chakra-ui/react'
import Link from 'next/link'
import { useSession, signIn } from 'next-auth/react'
import Head from '@/components/head'

const plans = [
	{
		name: 'Text Notifications',
		price: '$9.99',
		description:
			'Let competitors & guests sign up for text updates to notify them when they compete.',
	},
	{
		name: 'Manage Groups',
		price: '$19.99',
		description: 'Manage sending notifications by updating current groups',
	},
	{
		name: 'Live Projector Screen',
		price: '$29.99',
		description: 'Live Screen Showing Ongoing & Past Groups',
	},
]

const Pricing = () => {
	return (
		<>
			<Head title='Setup - Drop Off Table' />
			<Flex direction={'column'} justify='center' align='center' p='8'>
				<Image
					w={36}
					h={36}
					src={'/dropofftable.png'}
					alt='Drop Off Table icon'
					mb={10}
				/>
				<Heading as='h1' size='xl' mb='8'>
					Set Up Your WCA Competition
				</Heading>
				<Grid
					margin='0 auto'
					maxW={'4xl'}
					gridTemplateColumns={{ base: '', md: 'repeat(3, 1fr)' }}
					gridAutoRows={'1fr'}
					gridTemplateRows={{ base: '1fr', md: '' }}
					gap={6}
					// borderWidth='1px'
					borderColor='gray.200'
					borderRadius='lg'
					overflow='hidden'>
					{plans.map((plan, index) => (
						<GridItem key={index}>
							<Box
								h='100%'
								p='6'
								borderWidth='1px'
								borderColor='gray.400'
								borderRadius='lg'>
								<VStack alignItems='center'>
									<Heading as='h2' size='lg' mb='2'>
										{plan.name}
									</Heading>
									<Text fontSize='lg' mb='6'>
										{plan.description}
									</Text>
									<Stack spacing='2'></Stack>
								</VStack>
							</Box>
						</GridItem>
					))}
				</Grid>{' '}
				<Link href='mailto:contact@saranshgrover.com'>
					<Button my='6' colorScheme='orange'>
						Contact to Get Started
					</Button>
				</Link>
				<Button
					onClick={() =>
						signIn('wca', {
							callbackUrl: '/',
						})
					}
					variant={'link'}>
					Already setup? Log In
				</Button>
			</Flex>
		</>
	)
}

export default Pricing
