/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    
    extend: {
      colors:{
        'light-green': '#92FF9F',
        'light-gray':'#909093'
      },
      fontFamily: {
        'red-hat': ['"Red Hat Display"'],
      }
    },
  },
  plugins: [],
}

