import {
  Inter,
  Roboto,
  Poppins,
  Lato,
  Playfair_Display,
} from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-roboto",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-lato",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-playfair",
  display: "swap",
});

// 2. Export a Type-Safe Map
export type FontKey = "inter" | "roboto" | "poppins" | "lato" | "playfair";

export interface FontConfig {
  key: FontKey;
  name: string;
  variable: string;
  className: string;
  // Added: Pass the Next.js style object so we can extract the resolved family string
  style: React.CSSProperties;
}

export const fontsMap: Record<FontKey, FontConfig> = {
  inter: {
    key: "inter",
    name: "Inter",
    variable: inter.variable,
    className: inter.className,
    style: inter.style,
  },
  roboto: {
    key: "roboto",
    name: "Roboto",
    variable: roboto.variable,
    className: roboto.className,
    style: roboto.style,
  },
  poppins: {
    key: "poppins",
    name: "Poppins",
    variable: poppins.variable,
    className: poppins.className,
    style: poppins.style,
  },
  lato: {
    key: "lato",
    name: "Lato",
    variable: lato.variable,
    className: lato.className,
    style: lato.style,
  },
  playfair: {
    key: "playfair",
    name: "Playfair Display",
    variable: playfair.variable,
    className: playfair.className,
    style: playfair.style,
  },
};

// Helper to get all font CLASSES to inject into the div wrapper (triggers Next.js loaders)
export const getAllFontClasses = () => {
  return Object.values(fontsMap)
    .map((f) => f.className)
    .join(" ");
};

export const defaultFontKey: FontKey = "inter";
