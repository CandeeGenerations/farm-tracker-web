import forms from '@tailwindcss/forms'
import typography from '@tailwindcss/typography'
import aspectRatio from '@tailwindcss/aspect-ratio'

export default {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    // Path to the Tremor module
    './node_modules/@tremor/**/*.{js,ts,jsx,tsx}',
  ],
  plugins: [forms, typography, aspectRatio],
}
