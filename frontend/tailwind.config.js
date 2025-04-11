/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        primary: '#DC7F9B', //Ruddy Blue
        secondary: '#2F2F2F', //Peacb'
        accent: '#F7A1C4', //light-primary
        light: '#94BFA7'
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        montserrat: ['Montserrat', 'sans-serif'],
        lora: ['Lora', 'serif'],
        pacifico: ['Pacifico', 'cursive'],
      }
    },
  },
  plugins: [],
}

