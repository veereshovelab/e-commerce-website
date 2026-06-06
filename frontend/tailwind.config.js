module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1F2937",
        secondary: "#3B82F6",
        accent: "#EF4444",
        light: "#F9FAFB",
        dark: "#111827"
      },
      fontFamily: {
        sans: ["system-ui", "sans-serif"]
      }
    }
  },
  plugins: [],
}
