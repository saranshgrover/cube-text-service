export const ORIGIN_URL =
	process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3000'

export const WCA_URL =
	process.env.NODE_ENV !== 'production'
		? 'https://www.worldcubeassociation.org'
		: 'https://staging.worldcubeassociation.org'
