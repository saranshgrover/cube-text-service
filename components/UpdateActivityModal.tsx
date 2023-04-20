import { NodusActivity } from '@/types/activity'
import React, { useEffect } from 'react'

import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
	Button,
	FormControl,
	FormLabel,
	RadioGroup,
	Stack,
	Radio,
	FormHelperText,
	Checkbox,
	useToast,
} from '@chakra-ui/react'

type Props = {
	selectedActivity: NodusActivity | undefined
	onClose: () => void
	competitionId: string
	venueId: number
	roomId: number
	parentActivity: NodusActivity | undefined
}

export default function UpdateActivityModal({
	selectedActivity,
	onClose,
	competitionId,
	venueId,
	roomId,
	parentActivity,
}: Props) {
	async function updateGroup() {
		if (selectedActivity && selectedActivity.status !== status) {
			setLoading(true)
			try {
				const { parent, ...activity } = selectedActivity
				const data = {
					competitionId,
					venueId,
					roomId,
					parentActivity: parentActivity ? parentActivity : null,
					activity: { ...activity, status },
					notify: updateUsers && status !== 'pending' ? 'yes' : 'no',
				}
				const update = await fetch(`/api/updateGroup`, {
					method: 'POST',
					body: JSON.stringify(data),
				})
				setLoading(false)
				const res = await update.json()
				if (res.error) {
					setLoading(false)
					toast({ title: res.error, status: 'error' })
					onClose()
				} else if (res.status === 'done') {
					toast({ title: 'Updated', status: 'success' })
					onClose()
				}
			} catch (e) {
				setLoading(false)
				toast({ title: `Error: ${e}`, status: 'error' })
				onClose()
			}
		}
	}
	const toast = useToast()
	const [status, setStatus] = React.useState(selectedActivity?.status)
	const [updateUsers, setUpdateUsers] = React.useState(true)
	const [loading, setLoading] = React.useState(false)
	useEffect(() => {
		setStatus(selectedActivity?.status)
	}, [selectedActivity])
	return (
		<Modal
			size={'xl'}
			isOpen={selectedActivity !== undefined}
			onClose={() => onClose}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>{`Update ${selectedActivity?.name}`}</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<FormControl mb='1em'>
						<FormLabel fontSize={'lg'}>Status</FormLabel>
						<RadioGroup
							// @ts-ignore
							onChange={setStatus}
							value={status}>
							<Stack direction={'row'}>
								<Radio value='pending'>Pending</Radio>
								<Radio colorScheme={'green'} value='ongoing'>
									Ongoing
								</Radio>
								<Radio colorScheme={'red'} value='completed'>
									Completed
								</Radio>
							</Stack>
						</RadioGroup>
						<FormHelperText>Update the status of the group</FormHelperText>
					</FormControl>
					{status !== selectedActivity?.status && status !== 'pending' && (
						<FormControl>
							<Checkbox
								size='lg'
								colorScheme='green'
								defaultChecked={false}
								// isChecked={updateUsers}
								onChange={(e) => setUpdateUsers(e.target.checked)}>
								{`Send notifications to all competitiors/staff about the ${
									status === 'completed' ? 'closing' : 'opening'
								} of this group`}
							</Checkbox>
						</FormControl>
					)}
				</ModalBody>

				<ModalFooter>
					<Button variant='ghost' mr={3} onClick={onClose}>
						Cancel
					</Button>
					<Button
						isLoading={loading}
						isDisabled={status === selectedActivity?.status}
						onClick={() => updateGroup()}
						colorScheme={'blue'}>
						Update
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	)
}
