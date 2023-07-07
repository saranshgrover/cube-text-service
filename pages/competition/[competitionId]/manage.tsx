import CompetitionManager from '@/components/CompetitionManager'
import db from '@/firebase/client'
import { Center } from '@chakra-ui/layout'
import { Spinner } from '@chakra-ui/spinner'
import { collection } from 'firebase/firestore'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import React from 'react'
import { useCollectionDataOnce } from 'react-firebase-hooks/firestore'

type Props = {}

export default function Manage(props: Props) {
	const router = useRouter()
	const { data, status } = useSession()
	const { competitionId } = router.query

	if (status === 'unauthenticated') {
		signIn('wca', {
			callbackUrl: router.asPath,
		})
	}
	if (!router.isReady || !competitionId || status !== 'authenticated')
		return (
			<Center>
				<Spinner />
			</Center>
		)
	return <CompetitionManager competitionId={competitionId as string} />
}
