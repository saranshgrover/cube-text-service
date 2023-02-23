import React, { ReactElement, useEffect } from 'react'
import {
	useColorMode,
	Box,
	Text,
	useColorModeValue,
	IconButton,
	Stack,
	Image,
	Button,
	Flex,
	Avatar,
	Menu,
	MenuItem as ChakraMenuItem,
	MenuDivider,
	MenuList,
	MenuButton,
} from '@chakra-ui/react'
import Link from 'next/link'
import { SunIcon, MoonIcon, ChevronDownIcon } from '@chakra-ui/icons'
import { getSession, signOut, useSession } from 'next-auth/react'

interface MenuItemProps {
	title: string
	href: string
	icon?: ReactElement
}

function MenuItem({ title, href }: MenuItemProps) {
	return (
		<Text
			mt={{ base: 4, md: 0 }}
			textDecoration='underline'
			textDecorationColor={'teal'}
			fontSize='lg'
			mr={6}
			display='block'
			cursor='pointer'>
			<Link href={href}>{title}</Link>
		</Text>
	)
}

export default function Header(): ReactElement {
	const [show, setShow] = React.useState(false)
	const handleToggle = () => setShow(!show)
	const { toggleColorMode } = useColorMode()
	const val = useColorModeValue('black', 'white')
	const toggleTheme = useColorModeValue(
		{ title: 'Dark', Icon: MoonIcon },
		{ title: 'Light', Icon: SunIcon }
	)
	const { data, status } = useSession()
	return (
		<Stack
			h='10vh'
			as='nav'
			align='center'
			justify='space-between'
			wrap='wrap'
			padding='1rem'
			pb='5rem'
			w='100vw'
			justify-content='center'
			direction={['column', 'row']}>
			<Box left='0' w={{ base: '20%', md: '10%' }}>
				<Link href='/'>
					<Image
						h={12}
						w={12}
						src={'/dropofftable.png'}
						alt='Drop Off Table icon'
					/>
				</Link>
			</Box>

			<Box
				as='ol'
				display={{ base: show ? 'block' : 'none', md: 'flex' }}
				width={{ sm: 'full', md: 'auto' }}
				alignItems='center'
				flexGrow={1}>
				<MenuItem href='/competitions' title='Competitions' />
				{/* <MenuItem href='/alertstatus' title='Alerts' /> */}
				<Flex
					align={'center'}
					gap={'2em'}
					right={{ base: 'auto', md: '0' }}
					position={{ base: undefined, md: 'absolute' }}>
					{status === 'authenticated' && (
						<Flex alignItems={'center'}>
							<Menu>
								<MenuButton>
									<Button
										size='md'
										leftIcon={
											<Avatar
												size={'sm'}
												_hover={{}}
												// @ts-ignore
												src={data.user?.image?.url}
											/>
										}
										rightIcon={<ChevronDownIcon />}>
										{data.user?.name}
									</Button>
								</MenuButton>
								<MenuList>
									<ChakraMenuItem>
										<Link href='/competitions/me'>Your Competitions</Link>
									</ChakraMenuItem>
									<ChakraMenuItem>Settings</ChakraMenuItem>
									<MenuDivider />
									<ChakraMenuItem onClick={() => signOut()}>
										Logout
									</ChakraMenuItem>
								</MenuList>
							</Menu>
						</Flex>
					)}
					<IconButton
						display={{ base: show ? 'block' : 'none', md: 'block' }}
						mr='1em'
						size='lg'
						aria-label={`Toggle ${toggleTheme.title}`}
						icon={<toggleTheme.Icon />}
						variant='ghost'
						onClick={toggleColorMode}
					/>
				</Flex>
			</Box>

			<Box
				cursor='pointer'
				display={{ base: 'block', md: 'none' }}
				right={5}
				top={5}
				position='absolute'
				onClick={handleToggle}
				mr='1rem'>
				<svg
					fill={val}
					width='1.5em'
					viewBox='0 0 20 20'
					xmlns='http://www.w3.org/2000/svg'>
					<title>Menu</title>
					<path d='M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z' />
				</svg>
			</Box>
		</Stack>
	)
}
