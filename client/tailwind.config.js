/* eslint @typescript-eslint/no-var-requires: 0 */
const defaultTheme = require('tailwindcss/defaultTheme')
const colors = require('tailwindcss/colors')
const forms = require('@tailwindcss/forms')
const typography = require('@tailwindcss/typography')
const aspectRatio = require('@tailwindcss/aspect-ratio')
const headlessui = require('@headlessui/tailwindcss')

module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',

    // Path to the Tremor module
    './node_modules/@tremor/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // light mode
        tremor: {
          brand: {
            faint: '#eff6ff', // blue-50
            muted: '#bfdbfe', // blue-200
            subtle: '#60a5fa', // blue-400
            DEFAULT: '#3b82f6', // blue-500
            emphasis: '#1d4ed8', // blue-700
            inverted: '#ffffff', // white
          },
          background: {
            muted: '#f9fafb', // gray-50
            subtle: '#f3f4f6', // gray-100
            DEFAULT: '#ffffff', // white
            emphasis: '#374151', // gray-700
          },
          border: {
            DEFAULT: '#e5e7eb', // gray-200
          },
          ring: {
            DEFAULT: '#e5e7eb', // gray-200
          },
          content: {
            subtle: '#9ca3af', // gray-400
            DEFAULT: '#6b7280', // gray-500
            emphasis: '#374151', // gray-700
            strong: '#111827', // gray-900
            inverted: '#ffffff', // white
          },
        },
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
        'tremor-small': '0.125rem',
        'tremor-default': '3px',
        'tremor-full': '9999px',
      },
      boxShadow: {
        ...defaultTheme.boxShadow,
        // light
        'tremor-input': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'tremor-card': defaultTheme.boxShadow.DEFAULT,
        // 'tremor-card': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'tremor-dropdown': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      },
      fontSize: {
        ...defaultTheme.fontSize,
        'tremor-label': ['0.75rem'],
        'tremor-default': ['0.875rem', {lineHeight: '1.25rem'}],
        'tremor-title': ['1.125rem', {lineHeight: '1.75rem'}],
        'tremor-metric': ['1.875rem', {lineHeight: '2.25rem'}],
      },
    },
  },
  safelist: [
    {
      pattern:
        /^(bg-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
      variants: ['hover', 'ui-selected'],
    },
    {
      pattern:
        /^(text-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
      variants: ['hover', 'ui-selected'],
    },
    {
      pattern:
        /^(border-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
      variants: ['hover', 'ui-selected'],
    },
    {
      pattern:
        /^(ring-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
    },
    {
      pattern:
        /^(stroke-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
    },
    {
      pattern:
        /^(fill-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
    },
  ],
  plugins: [forms, typography, aspectRatio, headlessui],
}
