/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        'space-black': '#05070B',
        'deep-navy': '#0E1525',
        'solar-amber': '#FF9A2E',
        'copper-glow': '#D9772B',
        'text-primary': '#FFFFFF',
        'text-secondary': '#AEB8C7',
      }
    },
  },
  plugins: [],
}
