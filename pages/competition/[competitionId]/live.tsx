import CompetitionManager from '@/components/CompetitionManager'
import { Center } from '@chakra-ui/layout'
import { Spinner } from '@chakra-ui/spinner'
import { useRouter } from 'next/router'
import React from 'react'

type Props = {}

export default function Live(props: Props) {
	const router = useRouter()
	const { competitionId } = router.query
	if (!router.isReady || !competitionId)
		return (
			<Center>
				<Spinner />
			</Center>
		)
	return <CompetitionManager competitionId={competitionId as string} />
}
