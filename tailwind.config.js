/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        wall: "url('https://wallpaper-mania.com/wp-content/uploads/2018/09/High_resolution_wallpaper_background_ID_77702090620.jpg')",
      },
      fontSize: {
        title: "clamp(5rem, -0.7436rem + 7.1795vw, 1.5rem)",
      },
      boxShadow: {
        notes:
          "5px 5px 10px rgba(0,0,0,0.5), inset 3px 10px 30px rgba(0,0,0,0.2)",
      },
    },
  },
  plugins: [],
};
