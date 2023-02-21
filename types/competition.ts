// import { Timestamp } from 'firebase/firestore'
import { Person } from '@wca/helpers'

export interface Competition {
	name: string
	id: string
	delegates: Person[]
	competitionId: string
	numberOfDays: number
	startDate: string
	endDate: string
	location: string
}

export interface APICompetition {
	name: string
	id: string
	delegates: Person[]
	organizers: Person[]
	start_date: string
	city: string
	url: string
	end_date: string
}
