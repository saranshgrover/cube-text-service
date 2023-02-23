import React, { ReactElement } from 'react'
import Header from './Header'
import { Flex, Box } from '@chakra-ui/react'

export default function Layout({
	children,
}: React.PropsWithChildren<{}>): ReactElement {
	return (
		<Flex direction='column' w='100vw' minH='100vh'>
			<Header />
			<Box mb={12} mx={[10, 20]}>
				{children}
			</Box>
		</Flex>
	)
}
