import { clientApp } from '@/firebase/db'
import { FormHelperText, FormLabel } from '@chakra-ui/form-control'
import { Input } from '@chakra-ui/input'
import { Box, Center, Flex } from '@chakra-ui/layout'
import { Button, useToast, Heading } from '@chakra-ui/react'
import { Spinner } from '@chakra-ui/spinner'
import { doc, getFirestore } from '@firebase/firestore'
import { Competition, Person } from '@wca/helpers'
import { Select } from 'chakra-react-select'
import { useRouter } from 'next/router'
import React, { useEffect, useMemo, useState } from 'react'
import {
	useCollection,
	useCollectionDataOnce,
	useDocumentData,
} from 'react-firebase-hooks/firestore'
import VenueManager from './VenueManager'
import useStore, { StoreState } from '@/config/store'
import { clientDb } from '../firebase/db'
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore'

type Props = {
	competitionId: string
	live?: boolean
}

export default function CompetitionManager({ competitionId, live }: Props) {
	const [snapshot, snapshotLoading, snapshotError] = useCollection(
		collection(clientDb, 'competitions', competitionId, 'persons')
	)
	const store = useStore()
	useEffect(() => {
		if (snapshot && !snapshotLoading && !snapshotError) {
			const competitors: Person[] = []
			snapshot.forEach((doc) => {
				competitors.push(doc.data() as Person)
			})
			store.setCompetitors(competitors)
		}
	}, [snapshot, snapshotLoading, snapshotError])

	const toast = useToast()
	async function handleUpdate() {
		setSyncLoading(true)
		const res = await fetch('/api/updateWcif', {
			method: 'POST',
			body: JSON.stringify({
				competitionId: competitionId,
			}),
		})
		setSyncLoading(false)
		if (res.ok) {
			toast({
				title: 'Done',
				variant: 'solid',
				colorScheme: 'green',
			})
			// router.reload()
		} else {
			toast({
				title: 'Error',
				status: 'error',
			})
		}
	}
	const router = useRouter()
	const [value, loading, error] = useDocumentData(
		doc(getFirestore(clientApp), 'competitions', competitionId)
	)
	const [selectedVenue, setSelectedVenue] = React.useState<{
		label: string
		value: number
	}>()
	useEffect(() => {
		if (value && !selectedVenue) {
			const venue = value.schedule.venues[0]
			setSelectedVenue({ label: venue.name, value: venue.id })
		}
	}, [value, selectedVenue])
	const competition: Competition = useMemo(() => value as Competition, [value])
	const [syncLoading, setSyncLoading] = useState(false)
	if (loading)
		return (
			<Center>
				<Spinner />
			</Center>
		)
	if (error) {
		router.push('/404')
	}
	return (
		<Box h='100%' w='100%'>
			{!live && (
				<Flex w='100%' align='center' gap={2}>
					<Box w='80%'>
						<FormLabel>Venue</FormLabel>
						<Select
							variant='filled'
							value={selectedVenue}
							onChange={(v) => v && setSelectedVenue(v)}
							// @ts-ignore
							options={competition.schedule.venues.map((venue) => ({
								label: venue.name,
								value: venue.id,
							}))}
						/>
					</Box>
					<Button
						loadingText='Loading '
						isLoading={syncLoading}
						isDisabled={syncLoading}
						onClick={() => handleUpdate()}>
						Sync
					</Button>
				</Flex>
			)}
			{live && (
				<Center>
					<Heading>{competition.name}</Heading>
				</Center>
			)}
			{selectedVenue && competition && (
				<VenueManager
					venue={
						competition.schedule.venues.find(
							(v) => v.id === selectedVenue.value
						)!
					}
					competition={competition}
					live={live ?? false}
				/>
			)}
		</Box>
	)
}
