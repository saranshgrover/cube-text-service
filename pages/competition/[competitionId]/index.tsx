import { useRouter } from 'next/router'
import { Heading } from '@chakra-ui/react'

export default function Competition() {
	const router = useRouter()
	const { competitionId } = router.query
	return (
		<Heading as='h1' size='2xl'>
			{competitionId}
		</Heading>
	)
}
