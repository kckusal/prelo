import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#6d28d9",
          secondary: "#1f2937",
          accent: "#4c1d95",
          neutral: "#d1d5db",
          "base-100": "#ffffff",
          info: "#1d4ed8",
          success: "#166534",
          warning: "#fcd34d",
          error: "#e11d48",
        },
      },
    ],
  },
} satisfies Config;
