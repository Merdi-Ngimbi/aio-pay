import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        aio: {
          bordeaux: "var(--aio-bordeaux)",
          "bordeaux-dark": "var(--aio-bordeaux-dark)",
          "bordeaux-light": "var(--aio-bordeaux-light)",
          orange: "var(--aio-orange)",
          "orange-dark": "var(--aio-orange-dark)",
          "orange-light": "var(--aio-orange-light)",
          cream: "var(--aio-cream)",
          gray: "var(--aio-gray)",
          "gray-light": "var(--aio-gray-light)",
        },
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      boxShadow: {
        soft: "0 10px 15px -3px rgb(0 0 0 / 0.08), 0 4px 6px -4px rgb(0 0 0 / 0.05)",
        "soft-lg": "0 20px 25px -5px rgb(0 0 0 / 0.08), 0 8px 10px -6px rgb(0 0 0 / 0.05)",
      },
    },
  },
  plugins: [],
};
export default config;
