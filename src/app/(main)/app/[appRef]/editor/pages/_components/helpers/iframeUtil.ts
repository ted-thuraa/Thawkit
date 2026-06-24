// File: src/lib/helpers/iframeUtil.ts
import { THEME_VARIABLES } from "@/lib/constants/theme";
import { fontsMap, defaultFontKey } from "@/lib/fonts/index";
import { defaultTheme, PageTheme } from "@/stores/pageEditorStore/types";

// Helper: simply return the CSS variable string
const getFontVar = (fontKey: string) => {
  // Safe lookup: if the key is invalid or "undefined", fall back to default
  const font =
    fontsMap[fontKey as keyof typeof fontsMap] || fontsMap[defaultFontKey];
  // returns e.g. "var(--font-inter)"
  return `var(${font.variable})`;
};

export const getThemeVariables = (theme: PageTheme) => {
  const activeTheme = theme?.colors?.palette ? theme : defaultTheme;
  return {
    [THEME_VARIABLES.primary]: activeTheme.colors.palette.primary,
    [THEME_VARIABLES.textHeading]: activeTheme.colors.text.heading,
    [THEME_VARIABLES.textBody]: activeTheme.colors.text.body,
    [THEME_VARIABLES.pageBg]: activeTheme.colors.background.page,
    [THEME_VARIABLES.backgroundCard]: activeTheme.colors.background.card,
    [THEME_VARIABLES.btnForeground]: activeTheme.colors.palette.btnForeground,

    // TYPOGRAPHY:
    // Logic: Look up the variable name based on the key stored in Zustand
    [THEME_VARIABLES.fontHeadings]: getFontVar(
      activeTheme.typography.headings.fontFamily
    ),
    [THEME_VARIABLES.fontBody]: getFontVar(
      activeTheme.typography.body.fontFamily
    ),
    [THEME_VARIABLES.fontHeadingsWeight]:
      activeTheme.typography.headings.weight,
    [THEME_VARIABLES.fontBodyWeight]: activeTheme.typography.body.weight,

    // Design
    [THEME_VARIABLES.cardRoundness]: activeTheme.design.card.roundness,
    [THEME_VARIABLES.cardShadow]: activeTheme.design.card.shadow,
    [THEME_VARIABLES.cardBorder]: activeTheme.design.card.border,
    [THEME_VARIABLES.cardBorderColor]: activeTheme.design.card.border_color,
    [THEME_VARIABLES.cardTransparency]: activeTheme.design.card.transparency,
  };
};
