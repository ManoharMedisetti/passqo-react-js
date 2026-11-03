/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        flamingo: {
          DEFAULT: "#FF4E7A",
          50: "#fff0f5",
          100: "#ffe0eb",
          500: "#FF4E7A",
          600: "#D4537E",
        },
        teal: {
          DEFAULT: "#00C896",
          50: "#f0faf7",
          100: "#d0f4eb",
          500: "#00C896",
          600: "#00a889",
        },
        amber: {
          DEFAULT: "#FFB020",
          500: "#FFB020",
          600: "#e09400",
        },
        passqo: {
          dark: "#1B1B23",
          darker: "#16213E",
          warm: "#F5F0EB",
          sand: "#EDE8E2",
          stone: "#D4CEC7",
          deep: "#99324E",
        },
        primary: {
          DEFAULT: "#FF4E7A",
          0: "#000000", 10: "#400013", 30: "#900036", 40: "#B00C46",
          50: "#D8305F", 80: "#FFB2BD", 90: "#FFD9DD", 99: "#FFFBFF",
        },
        secondary: {
          DEFAULT: "#00C896",
          10: "#002116", 30: "#00513B", 40: "#006C4F", 50: "#008F6B",
          60: "#00A879", 80: "#3ADFAB", 90: "#60FCC6", 99: "#EAFFF7",
        },
        tertiary: {
          DEFAULT: "#FFB020",
          10: "#291800", 30: "#624000", 40: "#7A4500", 50: "#B86B0A",
          60: "#C48400", 80: "#FFBA4B", 90: "#FFDDB1", 99: "#FFF5E8",
        },
        neutral: {
          DEFAULT: "#1B1B23",
          0: "#000000", 20: "#303038", 40: "#5A5962", 60: "#8E8D96",
          70: "#B7B5BD", 80: "#D1CFD7", 90: "#E4E1EC", 99: "#FBF8FF",
        },
      },
      fontFamily: {
        sans: ["var(--font-manrope)", "system-ui", "sans-serif"],
        display: ["'Cabinet Grotesk'", "var(--font-manrope)", "sans-serif"],
        label: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        chip: "4px",
        "2xl": "16px",
        card: "20px",
        "3xl": "24px",
      },
      boxShadow: {
        xs: "0 1px 2px 0 rgb(0 0 0 / 0.06)",
        sm: "0 2px 8px 0 rgb(0 0 0 / 0.08)",
        md: "0 4px 16px 0 rgb(0 0 0 / 0.10)",
        lg: "0 8px 32px 0 rgb(0 0 0 / 0.12)",
        xl: "0 16px 48px 0 rgb(0 0 0 / 0.14)",
      },
      keyframes: {
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        shimmer: "shimmer 2s infinite",
      },
    },
  },
  plugins: [],
};

