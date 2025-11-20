/** @type {import('tailwindcss').Config} */
const withOpacityValue = (variable) => {
	return ({ opacityValue }) => {
		if (opacityValue !== undefined) {
			return `rgba(var(${variable}), ${opacityValue})`;
		}

		return `rgb(var(${variable}))`;
	};
};

module.exports = {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				background: withOpacityValue('--color-background'),
				surface: withOpacityValue('--color-surface'),
				'surface-elevated': withOpacityValue('--color-surface-elevated'),
				border: withOpacityValue('--color-border'),
				'border-strong': withOpacityValue('--color-border-strong'),
				text: withOpacityValue('--color-text'),
				'text-muted': withOpacityValue('--color-text-muted'),
				'text-soft': withOpacityValue('--color-text-soft'),
				accent: withOpacityValue('--color-accent'),
				'accent-soft': withOpacityValue('--color-accent-soft'),
				white: '#FFFFFF',
				black: '#131313',
				green: '#00A35C',
				'light-green': '#D1E8BD',
				'light-grey': '#F4F3EF',
				grey: '#F3F3F1',
				'dark-grey': '#5B5B5B'
			},
			fontFamily: {
				sans: ['"Suisse Intl"', 'system-ui', 'sans-serif']
			},
			fontWeight: {
				regular: '400',
				medium: '500'
			},
			fontSize: {
				h1: ['3.75rem', { lineHeight: '4rem', letterSpacing: '-0.03em' }],
				h2: ['1.625rem', { lineHeight: '2rem', letterSpacing: '-0.01em' }],
				h3: ['1.375rem', { lineHeight: '2rem', letterSpacing: '-0.01em' }],
				h4: ['1.25rem', { lineHeight: '1.625rem', letterSpacing: '-0.01em' }],
				body: ['1rem', { lineHeight: '1.5rem', letterSpacing: '-0.01em' }],
				'body-lg': ['1.125rem', { lineHeight: '1.625rem', letterSpacing: '-0.01em' }],
				'body-xl': ['1.125rem', { lineHeight: '1.625rem', letterSpacing: '-0.01em' }],
				'body-sm': ['0.75rem', { lineHeight: '1.125rem', letterSpacing: '-0.01em' }],
				caption: ['0.75rem', { lineHeight: '1.1', letterSpacing: '0.08em' }]
			},
			spacing: {
				18: '4.5rem',
				22: '5.5rem',
				26: '6.5rem',
				30: '7.5rem'
			},
			borderRadius: {
				pill: '999px'
			}
		}
	},
	plugins: [require('@tailwindcss/typography')]
};

