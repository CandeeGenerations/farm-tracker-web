/* eslint @typescript-eslint/no-var-requires: 0 */
const colors = require('tailwindcss/colors')
const forms = require('@tailwindcss/forms')
const typography = require('@tailwindcss/typography')
const aspectRatio = require('@tailwindcss/aspect-ratio')

module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#A3C564',
        },
        primary: {
          lightest: colors.green['50'],
          light: colors.green['300'],
          DEFAULT: colors.green['500'],
          medium: colors.green['700'],
          dark: colors.green['900'],
        },
        success: {
          lightest: '#bceac1',
          light: '#90dd99',
          DEFAULT: '#22BB33',
          medium: '#1b9528',
          dark: '#14701e',
        },
        danger: {
          lightest: '#eabcbd',
          light: '#dd9091',
          DEFAULT: '#bb2124',
          medium: '#951a1c',
          dark: '#701315',
        },
        warning: {
          lightest: '#fae6c9',
          light: '#f7d6a6',
          DEFAULT: '#f0ad4e',
          medium: '#c08a3e',
          dark: '#90672e',
        },
        muted: {
          lightest: colors.slate['50'],
          'light-medium': colors.slate['100'],
          light: colors.slate['300'],
          DEFAULT: colors.slate['500'],
          medium: colors.slate['700'],
          dark: colors.slate['900'],
        },
      },
      borderRadius: {
        none: '0',
        sm: '0.125rem',
        DEFAULT: '3px',
        md: '0.375rem',
        lg: '0.5rem',
        full: '9999px',
      },
    },
  },
  plugins: [forms, typography, aspectRatio],
}
