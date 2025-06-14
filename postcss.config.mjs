const config = {
  plugins: ["@tailwindcss/postcss"],
  autoprefixer: {},
  tailwindcss: {
    content: [
      "./src/**/*.{js,ts,jsx,tsx,mdx}",
      "./app/**/*.{js,ts,jsx,tsx,mdx}",
      "./components/**/*.{js,ts,jsx,tsx,mdx}",
      "./global.css"
    ],
  },
};

export default config;
