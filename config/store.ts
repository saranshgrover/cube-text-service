import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { Person } from '@wca/helpers'

export interface StoreState {
	competitors: Person[] | null
	setCompetitors: (competitors: Person[]) => void
}

const useStore = create<StoreState>()((set) => ({
	competitors: null,
	setCompetitors: (competitors) => set(() => ({ competitors })),
}))

export default useStore
