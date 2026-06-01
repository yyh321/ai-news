import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563EB',
        'source-jiqizhixin': '#2563EB',
        'source-qbitai': '#10B981',
        'source-default': '#8B5CF6',
        'source-search': '#F59E0B',
      },
    },
  },
  plugins: [],
}
export default config
