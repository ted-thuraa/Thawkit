export const THEME_VARIABLES = {
  // Colors
  pageBg: "--theme-page-bg",
  textHeading: "--theme-heading-color",
  textBody: "--theme-body-color",
  primary: "--theme-primary-color",
  btnForeground: "--theme-button-text",

  // --- Button ---
  buttonRadius: "--theme-button-radius",

  // --- Card ---
  backgroundCard: "--theme-card-bg",
  textCardHeading: "--theme-card-heading-color",
  textCardBody: "--theme-card-body-color",
  cardBorder: "--theme-card-border-width", // Was 'card-Border' (assuming width)
  cardBorderColor: "--theme-card-border-color", // Was 'card-border' / 'card-BorderColor'
  cardRoundness: "--theme-card-radius", // Was 'card-radius'
  cardShadow: "--theme-card-shadow",
  cardTransparency: "--theme-card-transparency", // Was 'card-Transparency'

  // --- Font ---
  fontHeadings: "--theme-heading-font", // Was 'font-heading'
  fontBody: "--theme-body-font",
  // --- Font weight ---
  fontHeadingsWeight: "--font-weight-headings", // Was 'font-heading'
  fontBodyWeight: "--font-weight-body",
} as const;

// Base theme classes that components will use
export const THEME_CLASSES = {
  page: "bg-page",
  text: "text-page",
  heading: "heading-page",
  button: "page-button",
  buttonOutline: "page-button-outline",
  card: "page-card",
  link: "page-links",
} as const;

export const BASE_STYLES = `
    button {
        /* 1. Resets all properties to their initial values (like a plain <span>) */
        // all: unset; 
        /* 2. 'unset' removes the pointer cursor, so we usually add it back */
        cursor: pointer; 
        /* 3. 'unset' changes display to inline, so you might want this back */
        // display: inline-block;
        // font-family: inherit;
        // font-size: inherit;
    }
    
    /* 5. CRITICAL: 'unset' removes accessibility focus rings. 
       You must add a custom one back for keyboard users. */
    button:focus-visible {
        // outline: 2px solid blue; /* Or your app's brand color */
        // outline-offset: 2px;
    }
    .${THEME_CLASSES.page} {
      background-color: var(${THEME_VARIABLES.pageBg});
      color: var(${THEME_VARIABLES.textBody});
      font-family: var(--font-base), sans-serif; 
      /* Smooth transition for font switching */
      transition: font-family 0.3s ease;
    }
    .${THEME_CLASSES.page} :where(h1) {
      font-family: var(${THEME_VARIABLES.fontHeadings});
      color: var(${THEME_VARIABLES.textBody});
      // line-height: normal;
    }
    .${THEME_CLASSES.page} :where(h2) {
      font-family: var(${THEME_VARIABLES.fontHeadings});
      color: var(${THEME_VARIABLES.textBody});
      // line-height: normal;
      /* font-size: var(--font-size-3xl); */
      /* font-weight: 600; */
      /* letter-spacing: -0.02em; */
    }

    .${THEME_CLASSES.page} :where(h3) {
      font-family: var(${THEME_VARIABLES.fontHeadings});
      color: var(${THEME_VARIABLES.textBody});
      // line-height: normal;
    }

    .${THEME_CLASSES.page} :where(h4) {
      font-family: var(${THEME_VARIABLES.fontHeadings});
      color: var(${THEME_VARIABLES.textBody});
      // line-height: normal;
    }

    /* Paragraph Styles */
    .${THEME_CLASSES.page} :where(p) {
      font-family: var(${THEME_VARIABLES.fontBody});
      color: color-mix(in srgb, var(${THEME_VARIABLES.textBody}) 80%, transparent);
      // line-height: normal;
      margin: 0 0 var(--spacing-lg) 0;
    }

    .${THEME_CLASSES.page} :where(p:last-child) {
      margin-bottom: 0;
    }

    /* First paragraph after headings - reduced spacing */
    .${THEME_CLASSES.page} :where(h1 + p),
    .${THEME_CLASSES.page} :where(h2 + p),
    .${THEME_CLASSES.page} :where(h3 + p),
    .${THEME_CLASSES.page} :where(h4 + p) {
      margin-top: 0;
    }
      




    .chart-text-inside {
      color: var(${THEME_VARIABLES.textBody});
    }
    .${THEME_CLASSES.button} {
      background-color: var(${THEME_VARIABLES.primary});
      color: var(${THEME_VARIABLES.btnForeground}) ;
    }
    .${THEME_CLASSES.button} {
      background-color: var(${THEME_VARIABLES.primary});
      color: var(${THEME_VARIABLES.btnForeground}) ;
    }
    .${THEME_CLASSES.button} :where(h1),
    .${THEME_CLASSES.button} :where(h2),
    .${THEME_CLASSES.button} :where(h3),
    .${THEME_CLASSES.button} :where(h4) {
      color: var(${THEME_VARIABLES.btnForeground}) ;
    }
    .${THEME_CLASSES.button} > span {
      color: var(${THEME_VARIABLES.btnForeground}) ;
    }
  
    .${THEME_CLASSES.buttonOutline} {
      border: 2px solid var(${THEME_VARIABLES.primary}) ;
      color: var(${THEME_VARIABLES.primary}) ;
      background-color: transparent ;
    }
    .${THEME_CLASSES.buttonOutline} :where(h1),
    .${THEME_CLASSES.buttonOutline} :where(h2),
    .${THEME_CLASSES.buttonOutline} :where(h3),
    .${THEME_CLASSES.buttonOutline} :where(h4) {
      color: var(${THEME_VARIABLES.primary}) ;
    }

    .${THEME_CLASSES.link} {
      color:  var(${THEME_VARIABLES.primary});
    }

  

  

.${THEME_CLASSES.card} {
    background-color: var(${THEME_VARIABLES.backgroundCard});
    border-radius: var(${THEME_VARIABLES.cardRoundness});
    border-width: var(${THEME_VARIABLES.cardBorder});
    //border-color: color-mix(in srgb, var(${THEME_VARIABLES.cardBorderColor}) 10%, transparent);
    border-color: var(--theme-border-color);
    box-shadow: var(${THEME_VARIABLES.cardShadow});
    opacity: var(${THEME_VARIABLES.cardTransparency});
    }

  
  .${THEME_CLASSES.card} :where(h1),
  .${THEME_CLASSES.card} :where(h2),
  .${THEME_CLASSES.card} :where(h3),
  .${THEME_CLASSES.card} :where(h4) { 
    // color: var(${THEME_VARIABLES.textCardHeading});
    color: var(--theme-heading-color);
    font-family: var(${THEME_VARIABLES.fontBody});
  }
  .${THEME_CLASSES.card} .figure-content span { 
    color: var(${THEME_VARIABLES.textCardBody});
  }
  
  .${THEME_CLASSES.card} :where(p) {
    //color: color-mix(in srgb, var(${THEME_VARIABLES.textCardHeading}) 60%, transparent);
    color: var(--theme-body-color);
    font-family: var(${THEME_VARIABLES.fontBody});
    
  }
  .${THEME_CLASSES.card} .icon-content svg { 
    color: color-mix(in srgb, var(${THEME_VARIABLES.textCardHeading}) 75%, transparent);
    
  }



/* Enhanced Readability Features */


.ProseMirror p.is-empty::before {
  content: attr(data-placeholder);
  color: #adb5bd;
  pointer-events: none;
  opacity: 1;
  visibility: visible;
}

/* novel custom lists */
/* 1. Reset styles for the custom lists to remove default bullets */
.circle-check-list,
.tick-list {
  list-style-type: none;
  padding-left: 0;
  margin-top: 1rem;
  margin-bottom: 1rem;
}

/* 2. Common styles for items in custom lists */
.circle-check-list li,
.tick-list li {
  position: relative;
  padding-left: 2rem; /* Space for the icon */
  margin-bottom: 0.5rem;
  line-height: 1.5;
}

/* 3. The Pseudo-element that acts as the icon */
.circle-check-list li::before,
.tick-list li::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0.15em; /* Adjust to align with text baseline */
  width: 1.25em;
  height: 1.25em;
  background-color: var(${THEME_VARIABLES.primary}, #000); /* Fallback to black */

  /* Modern CSS Masking for icons */
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  -webkit-mask-position: center;
  mask-position: center;
  -webkit-mask-size: contain;
  mask-size: contain;
}

/* 4. Icon Definition: Circle Check */
.circle-check-list li::before {
  /* Encoded SVG for a circled check */
  -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='10'/%3E%3Cpath d='m9 12 2 2 4-4'/%3E%3C/svg%3E");
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='10'/%3E%3Cpath d='m9 12 2 2 4-4'/%3E%3C/svg%3E");
}

/* 5. Icon Definition: Simple Tick */
.tick-list li::before {
  /* Encoded SVG for a simple tick */
  -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='20 6 9 17 4 12'/%3E%3C/svg%3E");
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='20 6 9 17 4 12'/%3E%3C/svg%3E");
}

`;
