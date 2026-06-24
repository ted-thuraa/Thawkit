//const { THEME_VARIABLES } = require("./src/lib/constants/theme.ts");
const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // "pages/**/*.{js,ts,jsx,tsx,mdx}",
    // "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    // "./src/app/(main)/app/[appRef]/editor/pages/**/*.{ts,tsx}",
    // "./src/templates/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  theme: {
    extend: {
      // colors: {
      //   background: "hsl(var(--background))",
      //   foreground: "hsl(var(--foreground))",
      //   card: {
      //     DEFAULT: "hsl(var(--card))",
      //     foreground: "hsl(var(--card-foreground))",
      //   },
      //   popover: {
      //     DEFAULT: "hsl(var(--popover))",
      //     foreground: "hsl(var(--popover-foreground))",
      //   },
      //   primary: {
      //     DEFAULT: "hsl(var(--primary))",
      //     foreground: "hsl(var(--primary-foreground))",
      //   },
      //   secondary: {
      //     DEFAULT: "hsl(var(--secondary))",
      //     foreground: "hsl(var(--secondary-foreground))",
      //   },
      //   muted: {
      //     DEFAULT: "hsl(var(--muted))",
      //     foreground: "hsl(var(--muted-foreground))",
      //   },
      //   accent: {
      //     DEFAULT: "hsl(var(--accent))",
      //     foreground: "hsl(var(--accent-foreground))",
      //   },
      //   destructive: {
      //     DEFAULT: "hsl(var(--destructive))",
      //     foreground: "hsl(var(--destructive-foreground))",
      //   },
      //   border: "hsl(var(--border))",
      //   input: "hsl(var(--input))",
      //   ring: "hsl(var(--ring))",
      //   chart: {
      //     1: "hsl(var(--chart-1))",
      //     2: "hsl(var(--chart-2))",
      //     3: "hsl(var(--chart-3))",
      //     4: "hsl(var(--chart-4))",
      //     5: "hsl(var(--chart-5))",
      //   },
      //   btn: `var(${THEME_VARIABLES.primary})`,
      //   textheading: `var(${THEME_VARIABLES.textHeading})`,
      //   textbody: `var(${THEME_VARIABLES.textBody})`,
      //   page: `var(${THEME_VARIABLES.pageBg})`,
      //   cardBg: `var(${THEME_VARIABLES.backgroundCard})`,
      // },
      // borderRadius: {
      //   lg: "var(--radius)",
      //   md: "calc(var(--radius) - 2px)",
      //   sm: "calc(var(--radius) - 4px)",
      // },
      // fontFamily: {
      //   heading: `var(${THEME_VARIABLES.fontHeadings})`,
      //   body: `var(${THEME_VARIABLES.fontBody})`,
      // },
    },
  },
};
