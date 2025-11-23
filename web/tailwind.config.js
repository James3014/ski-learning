/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#13a4ec',
        'background-light': '#f6f7f8',
        'background-dark': '#101c22',
      },
      fontFamily: {
        display: ['Space Grotesk', 'Noto Sans TC', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
