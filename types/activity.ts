import { Activity as WCAActivity } from '@wca/helpers'

interface NodusActivity extends WCAActivity {
	status: 'pending' | 'ongoing' | 'completed'
	childActivities: NodusActivity[]
	parent?: NodusActivity
}

export type { NodusActivity }
