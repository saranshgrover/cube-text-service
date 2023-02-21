import { newUser } from '@/firebase/newUser'
import NextAuth, { AuthOptions } from 'next-auth'
export const authOptions: AuthOptions = {
	providers: [
		{
			id: 'wca',
			name: 'WCA',
			type: 'oauth',
			checks: [],
			clientId: process.env.NEXTAUTH_CLIENTID,
			clientSecret: process.env.NEXTAUTH_CLIENTSECRET,
			authorization: {
				url: 'https://www.worldcubeassociation.org/oauth/authorize',
				params: { scope: 'public email manage_competitions' },
			},
			client: {
				response_types: ['code'],
				client_id: process.env.NEXTAUTH_CLIENTID,
				client_secret: process.env.NEXTAUTH_CLIENTSECRET,
			},
			token: {
				url: 'https://www.worldcubeassociation.org/oauth/token',
				async request(context) {
					const provider = context.provider
					const query = `https://www.worldcubeassociation.org/oauth/token?client_id=${provider.clientId}&client_secret=${provider.clientSecret}&redirect_uri=${provider.callbackUrl}&code=${context.params.code}&grant_type=authorization_code`
					const res = await fetch(query, { method: 'POST' })
					const json = await res.json()
					return { tokens: json }
				},
			},
			userinfo: 'https://www.worldcubeassociation.org/api/v0/me',
			profile(profile) {
				return {
					...profile.me,
					image: profile.me.avatar,
				}
			},
		},
	],
	events: {
		createUser: async ({ user }) => {
			await newUser(user)
		},
	},
	callbacks: {
		async jwt({ token, account, profile }) {
			if (account) {
				token.accessToken = account?.access_token
				token.refreshToken = account?.refresh_token
				// @ts-ignore
				token.id = profile?.id
			}
			return token
		},
	},
}

export default NextAuth(authOptions)
