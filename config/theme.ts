import { extendTheme } from '@chakra-ui/react'
import typography from './typography'
import { mode } from '@chakra-ui/theme-tools'
const theme = extendTheme({
	...typography,
	styles: {
		global: (props: any) => ({
			body: {
				overflowX: 'hidden',
				backgroundColor: mode('#b8c6db', '#16161d')(props),
				backgroundImage: mode(
					'linear-gradient(315deg, #b8c6db 0%, #f5f7fa 74%);',
					'linear-gradient(315deg, ##16161d 0%, #09203f 50%);'
				)(props),
			},
			a: {
				textDecoration: 'underline',
				textDecorationColor: 'blue.500',
			},
			li: {
				fontSize: '18px',
			},
			h4: {
				fontWeight: 'bold',
			},
		}),
	},
	config: {
		useSystemColorMode: false,
		initialColorMode: 'dark',
	},
})

export default theme
