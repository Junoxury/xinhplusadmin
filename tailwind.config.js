/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
  	container: {
  		center: true,
  		padding: "2rem",
  		screens: {
  			"2xl": "1400px",
  		},
  	},
  	extend: {
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		keyframes: {
  			"accordion-down": {
  				from: { height: "0" },
  				to: { height: "var(--radix-accordion-content-height)" },
  			},
  			"accordion-up": {
  				from: { height: "var(--radix-accordion-content-height)" },
  				to: { height: "0" },
  			},
  		},
  		animation: {
  			"accordion-down": "accordion-down 0.2s ease-out",
  			"accordion-up": "accordion-up 0.2s ease-out",
  		},
  		typography: {
  			DEFAULT: {
  				css: {
  					maxWidth: 'none',
  					color: '#18181b',
  					backgroundColor: 'white',
  					p: {
  						color: '#18181b',
  						marginTop: '1em',
  						marginBottom: '1em',
  					},
  					'h1,h2,h3,h4,h5,h6': {
  						color: '#18181b',
  						fontWeight: '600',
  					},
  					h1: {
  						fontSize: '1.875em',
  					},
  					h2: {
  						fontSize: '1.5em',
  					},
  					h3: {
  						fontSize: '1.25em',
  					},
  					ul: {
  						color: '#18181b',
  						listStyleType: 'disc',
  						marginTop: '1em',
  						marginBottom: '1em',
  						paddingLeft: '1.625em',
  					},
  					ol: {
  						color: '#18181b',
  						listStyleType: 'decimal',
  						marginTop: '1em',
  						marginBottom: '1em',
  						paddingLeft: '1.625em',
  					},
  					li: {
  						color: '#18181b',
  						marginTop: '0.5em',
  						marginBottom: '0.5em',
  					},
  					blockquote: {
  						color: '#18181b',
  						borderLeftColor: 'hsl(var(--primary))',
  						borderLeftWidth: '4px',
  						marginTop: '1.6em',
  						marginBottom: '1.6em',
  						paddingLeft: '1em',
  					},
  					code: {
  						color: '#18181b',
  						backgroundColor: 'hsl(var(--muted))',
  						padding: '0.2em 0.4em',
  						borderRadius: '0.25rem',
  						fontSize: '0.875em',
  					},
  					pre: {
  						backgroundColor: 'hsl(var(--muted))',
  						padding: '1em',
  						borderRadius: '0.375rem',
  						overflow: 'auto',
  					},
  					hr: {
  						borderColor: 'hsl(var(--border))',
  						marginTop: '2em',
  						marginBottom: '2em',
  					},
  					table: {
  						width: '100%',
  						marginTop: '2em',
  						marginBottom: '2em',
  						borderCollapse: 'collapse',
  						border: '1px solid #e5e7eb',
  					},
  					'thead': {
  						backgroundColor: '#f3f4f6',
  						borderBottom: '2px solid #e5e7eb',
  					},
  					'thead th': {
  						color: '#18181b',
  						padding: '0.75em',
  						fontWeight: '600',
  						borderRight: '1px solid #e5e7eb',
  					},
  					'thead th:last-child': {
  						borderRight: 'none',
  					},
  					'tbody td': {
  						color: '#18181b',
  						padding: '0.75em',
  						borderTop: '1px solid #e5e7eb',
  						borderRight: '1px solid #e5e7eb',
  					},
  					'tbody td:last-child': {
  						borderRight: 'none',
  					},
  					'tbody tr:hover': {
  						backgroundColor: '#f8fafc',
  					},
  					img: {
  						marginTop: '2em',
  						marginBottom: '2em',
  						borderRadius: '0.375rem',
  					},
  				},
  			},
  		},
  	}
  },
  plugins: [
    require('@tailwindcss/typography'),
    require("tailwindcss-animate")
  ],
}

