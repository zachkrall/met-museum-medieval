/** @type {import('tailwindcss').Config} */
const config = require('tailwindcss/defaultConfig')

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ["Inter", ...config.theme.fontFamily.sans],
        'display': ['"MedievalSharp"', 'sans-serif']
      }
    },
  },
  plugins: [],
}