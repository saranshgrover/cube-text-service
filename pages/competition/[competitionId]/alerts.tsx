import {
	FormControl,
	FormLabel,
	Input,
	Button,
	VStack,
	Flex,
	Center,
	Heading,
	Text,
	Divider,
	useColorModeValue,
	Spinner,
	FormHelperText,
	FormErrorMessage,
} from '@chakra-ui/react'
import { clientApp } from '@/firebase/db'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'
import AnimatedCheck from '@/components/AnimatedCheck'
import { Select } from 'chakra-react-select'
import { useDocumentData } from 'react-firebase-hooks/firestore'
import { doc, getFirestore } from 'firebase/firestore'
import { Competition } from '@wca/helpers'

interface FormInfo {
	name: string
	phoneNumber: string
	selectedEvents: { label: string; value: string }[]
}

export default function CompetitionSignUpForm() {
	const [status, setStatus] = useState('initial')
	const [query, setQuery] = useState<any>()
	const [options, setOptions] = useState<{ value: string; label: string }[]>()
	const router = useRouter()
	const [value, loading] = useDocumentData<Competition>(query)
	const color = useColorModeValue('blackAlpha.100', 'whiteAlpha.300')
	const { competitionId } = router.query
	useEffect(() => {
		if (router.isReady) {
			setQuery(
				doc(
					getFirestore(clientApp),
					'competitions',
					router.query.competitionId as string
				)
			)
		}
	}, [router.isReady, router.query])

	const [info, setInfo] = useState<FormInfo | undefined>()
	const handleCancel = () => {
		setInfo(undefined)
		setStatus('initial')
	}
	const handleSubmitInitial = async (formInfo: FormInfo) => {
		setInfo(formInfo)
		const res = await fetch('/api/verifyPhoneNumber', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				phoneNumber: formInfo.phoneNumber,
			}),
		})
		const data = await res.json()
		if (data.error) {
			console.log(data.error)
			return
		}
		setStatus(data.status)
	}
	const handleSubmitVerify = async (code: string) => {
		if (!info) {
			return
		}
		setStatus('code-sent')
		const res = await fetch('/api/verifyPhoneCheckCode', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				code: code,
				competitionId: competitionId,
				...info,
			}),
		})
		const data = await res.json()
		console.log(data)
		if (data.error) {
			console.log(data.error)
			setStatus('pending')
			return
		}
		setStatus(data.status)
	}
	useEffect(() => {
		if (value) {
			const newOptions = value.persons.map((person) => ({
				label: person.name,
				// @ts-ignore
				value: person.id,
			}))
			setOptions(newOptions)
		}
	}, [value])
	if (loading || !router.isReady || !options)
		return (
			<Center h='40vh'>
				<Spinner />
			</Center>
		)
	return (
		<Center>
			<VStack w='xl' p={4} bgColor={color} spacing='4' borderRadius={'xl'}>
				<Heading as='h1' fontSize={'2xl'} mb='2'>
					{value?.name}
				</Heading>
				<Divider mb='4' />
				<Heading as='h2' fontSize={'xl'} mb='4'>
					{`Sign Up for Text Updates`}
				</Heading>
				<Text textAlign={'center'} fontSize='lg' mb='8'>
					Stay up-to-date with the latest information about the competition by
					signing up for text updates!
				</Text>
				{status === 'initial' && (
					<InfoForm options={options} handleSubmit={handleSubmitInitial} />
				)}
				{status === 'pending' && (
					<VerifyForm
						handleSubmit={handleSubmitVerify}
						handleCancel={handleCancel}
					/>
				)}
				{status === 'code-sent' && (
					<>
						<Spinner
							speed='0.65s'
							emptyColor='gray.200'
							color='yellow.500'
							boxSize='50px'
						/>
					</>
				)}
				{status === 'approved' && (
					<>
						<AnimatedCheck />
						<Text textAlign={'center'} fontSize='lg' mb='8'>
							You have successfully signed up for text updates!
						</Text>
					</>
				)}
			</VStack>
		</Center>
	)
}

function InfoForm({
	handleSubmit,
	options,
}: {
	handleSubmit: (formInfo: FormInfo) => void
	options: { label: string; value: string }[]
}) {
	const [name, setName] = useState('')
	const [phoneNumber, setPhoneNumber] = useState<string | undefined>('')
	const [selectedEvents, setSelectedEvents] = useState<
		{ label: string; value: string }[]
	>([])
	const [errors, setErrors] = useState<{
		name?: string
		phoneNumber?: string
		selectedEvents?: string
	}>({})

	const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) =>
		setName(event?.target.value)
	const handleSelectedEventsChange = (selectedOptions: any) =>
		setSelectedEvents(selectedOptions)

	function verifyChecks() {
		let errors: any = {}
		if (!name) errors.name = 'Name not present'
		if (!phoneNumber) errors.phoneNumber = 'Phone number not present'
		if (selectedEvents.length === 0)
			errors.selectedEvents = 'Please select at least one person'
		setErrors(errors)
		if (Object.keys(errors).length === 0) {
			return true
		} else {
			return false
		}
	}

	function onSubmit(event: any) {
		event.preventDefault()
		if (verifyChecks() && phoneNumber) {
			handleSubmit({
				name: name,
				phoneNumber: phoneNumber,
				selectedEvents: selectedEvents,
			})
		}
	}

	return (
		<Flex w='80%' as='form' direction={'column'} gap={7} onSubmit={onSubmit}>
			<FormControl id='name' isRequired isInvalid={Boolean(errors.name)}>
				<FormLabel>Name</FormLabel>
				<Input
					isRequired
					type='text'
					value={name}
					onChange={handleNameChange}
					placeholder='Enter your name'
				/>
				<FormErrorMessage>{errors.name}</FormErrorMessage>
			</FormControl>
			<FormControl
				isRequired
				id='phoneNumber'
				isInvalid={Boolean(errors.phoneNumber)}>
				<FormLabel>Phone Number</FormLabel>
				<PhoneInput
					defaultCountry='US'
					placeholder='Enter phone number'
					value={phoneNumber}
					onChange={setPhoneNumber}
				/>
				<FormErrorMessage>{errors.phoneNumber}</FormErrorMessage>
			</FormControl>
			<FormControl
				isRequired
				id='selectedEvents'
				isInvalid={Boolean(errors.selectedEvents)}>
				<FormLabel>Select Users</FormLabel>

				<Select
					id='person-select'
					colorScheme='black'
					options={options}
					value={selectedEvents}
					onChange={(v) => {
						// here i dont want the user to choose more then 3 topics
						if (v == null || v.length < 6) {
							setSelectedEvents(v.map((a) => a))
						}
					}}
					isMulti
				/>
				<FormHelperText>
					Pick up to 5 competitors to get updates for
				</FormHelperText>
				<FormErrorMessage>{errors.selectedEvents}</FormErrorMessage>
			</FormControl>
			<Button onClick={onSubmit} colorScheme='blue' mt='4'>
				Sign Up
			</Button>
		</Flex>
	)
}

function VerifyForm({
	handleSubmit,
	handleCancel,
}: {
	handleSubmit: (code: string) => void
	handleCancel: () => void
}) {
	const [code, setCode] = useState('')

	const onSubmit = (event: any) => {
		event.preventDefault()
		handleSubmit(code)
	}
	return (
		<Flex as='form' direction={'column'} gap={3} onSubmit={onSubmit}>
			<FormControl id='code'>
				<FormLabel>Verification Code</FormLabel>
				<Input
					isRequired
					type='text'
					value={code}
					onChange={(event) => setCode(event?.target.value)}
					placeholder='Enter verification code'
				/>
			</FormControl>
			<Button onClick={onSubmit} colorScheme='blue' mt='4'>
				Verify
			</Button>
			<Button onClick={handleCancel}>Go Back</Button>
		</Flex>
	)
}
