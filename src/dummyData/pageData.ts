import {
  funnelPayloadSchema,
  FunnelCalculations,
  PagePayloadSchema,
  CalcResults,
} from "@/types/PageCMS/pageSchema";

export const LandingpagePayload: PagePayloadSchema = {
  id: "page_09124458129n0p7r5t1w",
  slug: "/stepper",
  title: "Home Page",
  order: 0,
  pageType: "landing_page",

  created_at: "2025-06-01T08:00:00.000Z",
  updated_at: "2025-09-15T14:32:00.000Z",
  published_at: "2025-06-15T09:00:00.000Z",

  seo: {
    title: "Turn your product into your biggest growth engine",
    description: "",
    og_image: {
      url: "",
      alt: "",
      width: 1200,
      height: 630,
    },
    canonical_url: "",
    keywords: [],
    robots: "index, follow",
    schema_org_type: "WebPage",
  },

  config: {
    background_color: "#ffffff",
    max_content_width: "1280px",
    font_heading: "Playfair Display",
    font_body: "Inter",
  },

  sections: [
    {
      id: "sec_header_01",
      order: 0,
      type: "nav",
      is_visible: true,
      template_id: "HEADER__STICKY_TOP__v2",
      config: {
        background_color: "#ffffff",
        full_bleed: true,
      },
      content: {
        logo: {
          brand_name: "Mentorea",
          icon_id: "hexagon",
          icon_bg_color: "#2563eb",
        },
        nav_links: [
          { label: "Home", href: "#" },
          { label: "Product", href: "#" },
          { label: "Solution", href: "#" },
          { label: "Pricing", href: "#" },
          { label: "About us", href: "#" },
          { label: "Contact", href: "#" },
        ],
        primary_cta: {
          label: "Sign up",
          href: "/signup",
          variant: "primary",
        },
        secondary_cta: {
          label: "Log in",
          href: "/login",
          variant: "ghost",
        },
      },
    },

    {
      id: "sec_hero_01",
      order: 1,
      type: "hero",
      is_visible: true,
      template_id: "HERO__SPLIT_LEFT__v1",
      config: {
        background_color: "#ffffff",
        padding_top: "lg",
        padding_bottom: "xl",
      },
      content: {
        heading: "Turn your product into your biggest growth engine",
        subtext:
          "Join our live webinar to discover how high-performing SaaS teams are improving activation, retention, and revenue – without adding more complexity.",
        primary_cta: {
          label: "Get Started",
          href: "/signup",
          variant: "primary",
          icon_id: "arrow_right",
        },
        secondary_cta: {
          label: "Free trial",
          href: "/trial",
          variant: "outline",
        },
        image: {
          url: "https://cdn.mentorea.io/assets/plantation.jpg",
          alt: "Man working on laptop",
          width: 1200,
          height: 1200,
          focal_point: "center",
        },
      },
    },
  ],
};

export const Quiz1PagePayload: PagePayloadSchema = {
  id: "page_01j9xk376896723n0p7r5t1w",
  slug: "/stepper/q/page_01j9xk376896723n0p7r5t1w",
  title: "Question - What is your role?",
  order: 1,
  pageType: "normal_page",
  created_at: "2025-06-01T08:00:00.000Z",
  updated_at: "2025-09-15T14:32:00.000Z",
  published_at: "2025-06-15T09:00:00.000Z",
  sections: [
    {
      id: "sec_quiz_01",
      order: 0,
      type: "quiz",
      template_id: "QUIZ__SINGLE_STEP__LIGHT__v1_0",
      is_visible: true,
      content: {
        questionType: "single_choice",
        categoryIds: ["About_you"],
        quizHeading: "What is your role",
        quizSubtext: "",
        quizOptions: [
          {
            id: "founder_or_ceo",
            title: "Founder/Ceo",
            description: "",
            icon: "📈",
            score: 1,
          },
          {
            id: "Product_manager",
            title: "Product manager",
            description: "",
            icon: "₿",
            score: 1,
          },
          {
            id: "Growth_Marketing",
            title: "Growth /Marketing",
            description: "",
            icon: "🏠",
            score: 1,
          },
          {
            id: "Customer_success",
            title: "Customer success",
            description: "",
            icon: "🏦",
            score: 1,
          },
          {
            id: "quiz1_other",
            title: "Other",
            description: "",
            icon: "🏦",
            score: 1,
          },
        ],
        goForward_cta: { label: "Proceed", href: "#" },
        goBack_cta: { label: "Back", href: "#" },
      },
    },
  ],
};

export const Quiz2PagePayload: PagePayloadSchema = {
  id: "page_02k0yl487907834o1q8s6u2x",
  slug: "/stepper/q/page_02k0yl487907834o1q8s6u2x",
  title: "Question - What is your investment horizon?",
  order: 2,
  pageType: "normal_page",
  created_at: "2025-06-01T08:00:00.000Z",
  updated_at: "2025-09-15T14:32:00.000Z",
  published_at: "2025-06-15T09:00:00.000Z",
  sections: [
    {
      id: "sec_quiz_02",
      order: 0,
      type: "quiz",
      template_id: "QUIZ__SINGLE_STEP__LIGHT__v1_0",
      is_visible: true,
      content: {
        questionType: "single_choice",
        categoryIds: ["About_you"],
        quizHeading: "What stage is your SaaS business at?",
        quizSubtext: "",
        quizOptions: [
          {
            id: "Prelaunch",
            title: "Pre-launch",
            description: "",
            icon: "⚡",
            score: 1,
          },
          {
            id: "Early_traction",
            title: "Early traction",
            description: "",
            icon: "📅",
            score: 2,
          },
          {
            id: "Scaling",
            title: "Scaling",
            description: "",
            icon: "🌱",
            score: 3,
          },
          {
            id: "Established",
            title: "Established",
            description: "",
            icon: "🌱",
            score: 4,
          },
        ],
        goForward_cta: { label: "See My Results", href: "#" },
        goBack_cta: { label: "Back", href: "#" },
      },
    },
  ],
};

export const Quiz3PagePayload: PagePayloadSchema = {
  id: "page_03l1zm598018945p2r9t7v3y",
  slug: "/stepper/q/page_03l1zm598018945p2r9t7v3y",
  title: "Question - What is your biggest product challenge now?",
  order: 3,

  pageType: "normal_page",
  created_at: "2025-06-01T08:00:00.000Z",
  updated_at: "2025-09-15T14:32:00.000Z",
  published_at: "2025-06-15T09:00:00.000Z",
  sections: [
    {
      id: "sec_quiz_03",
      order: 0,
      type: "quiz",
      template_id: "QUIZ__SINGLE_STEP__LIGHT__v1_0",
      is_visible: true,
      content: {
        questionType: "single_choice",
        categoryIds: ["Your_current_challenges"],
        quizHeading: "What is your biggest product challenge now?",
        quizSubtext: "",
        quizOptions: [
          {
            id: "User_activation",
            title: "User activation",
            description: "",
            icon: "✅",
            score: 1,
          },
          {
            id: "Retention_churn",
            title: "Retention / churn",
            description: "",
            icon: "🙋",
            score: 1,
          },
          {
            id: "Feature_adoption",
            title: "Feature adoption",
            description: "",
            icon: "🙋",
            score: 1,
          },
          {
            id: "Monetisation",
            title: "Monetisation",
            description: "",
            icon: "🙋",
            score: 1,
          },
          {
            id: "quiz3_other",
            title: "Other",
            description: "",
            icon: "🙋",
            score: 1,
          },
        ],
        goForward_cta: { label: "See My Results", href: "#" },
        goBack_cta: { label: "Back", href: "#" },
      },
    },
  ],
};

export const Quiz4PagePayload: PagePayloadSchema = {
  id: "page_04m2an609129056q3s0u8w4z",
  slug: "/stepper/q/page_04m2an609129056q3s0u8w4z",
  title: "Question - Crypto Accreditation Check",
  order: 4,

  pageType: "normal_page",
  created_at: "2025-06-01T08:00:00.000Z",
  updated_at: "2025-09-15T14:32:00.000Z",
  published_at: "2025-06-15T09:00:00.000Z",
  sections: [
    {
      id: "sec_quiz_04",
      order: 0,
      type: "quiz",
      template_id: "QUIZ__SINGLE_STEP__LIGHT__v1_0",
      is_visible: true,
      content: {
        questionType: "single_choice",
        categoryIds: ["Your_current_challenges"],
        quizHeading:
          "How would you describe your current onboarding experience",
        quizSubtext: "",
        quizOptions: [
          {
            id: "Very_effective",
            title: "Very effective",
            description: "",
            icon: "✅",
            score: 3,
          },
          {
            id: "Somewhateffective",
            title: "Somewhat effective",
            description: "",
            icon: "🙋",
            score: 2,
          },
          {
            id: "Needs_improvement",
            title: "Needs improvement",
            description: "",
            icon: "🙋",
            score: 1,
          },
          {
            id: "Not_sure",
            title: "Not sure",
            description: "",
            icon: "🙋",
            score: 0,
          },
        ],
        goForward_cta: { label: "See My Results", href: "#" },
        goBack_cta: { label: "Back", href: "#" },
      },
    },
  ],
};

export const MiniResultPagePayload: PagePayloadSchema = {
  id: "page_04m2an60912905546534fddfgu8w4z",
  slug: "/stepper/q/page_04m2an60912905546534fddfgu8w4z",
  title: "Mini result",
  order: 5,
  pageType: "normal_page",
  created_at: "2025-06-01T08:00:00.000Z",
  updated_at: "2025-09-15T14:32:00.000Z",
  published_at: "2025-06-15T09:00:00.000Z",
  sections: [
    {
      id: "sec_mini_result_01",
      order: 0,
      type: "mini_result",
      template_id: "MINIRESULT__SINGLE_STEP__LIGHT__v1_0",
      is_visible: true,
      content: {
        eyebrow: "Your progress so far",
        brackets: [
          {
            id: "bracket_high",
            priority: 20,
            predicate: {
              operator: "AND",
              conditions: [{ type: "score_above", threshold: 65 }],
            },
            icon: "🚀",
            heading: "You're already ahead of the curve",
            subtext:
              "Your responses show a strong foundation across the areas that matter most. The questions ahead will help us fine-tune your personalised action plan.",
          },
          {
            id: "bracket_mid",
            priority: 10,
            predicate: {
              operator: "AND",
              conditions: [{ type: "score_above", threshold: 40 }],
            },
            icon: "📈",
            heading: "Good momentum — let's build on it",
            subtext:
              "You're making solid progress. A few targeted adjustments in the right areas could unlock your next stage of growth. Keep going.",
          },
          {
            // Fallback — no predicate; always matches when no conditional bracket does.
            id: "bracket_fallback",
            icon: "🎯",
            heading: "Every great product starts somewhere",
            subtext:
              "Your honest answers show real clarity about your current challenges. The insights ahead will help you map out the right path forward.",
          },
        ],
        goForward_cta: { label: "Continue", href: "#" },
        goBack_cta: { label: "Back", href: "#" },
      },
    },
  ],
};

export const Quiz5PagePayload: PagePayloadSchema = {
  id: "page_05n3bo710230167r4t1v9x5a",
  slug: "/stepper/q/page_05n3bo710230167r4t1v9x5a",
  title: "Question - Crypto Accreditation Check",
  order: 6,

  pageType: "normal_page",
  created_at: "2025-06-01T08:00:00.000Z",
  updated_at: "2025-09-15T14:32:00.000Z",
  published_at: "2025-06-15T09:00:00.000Z",
  sections: [
    {
      id: "sec_quiz_05",
      order: 0,
      type: "quiz",
      template_id: "QUIZ__SINGLE_STEP__LIGHT__v1_0",
      is_visible: true,
      content: {
        questionType: "single_choice",
        categoryIds: ["Your_goals"],
        quizHeading: "What are you hoping to get from this webinar?",
        quizSubtext: "",
        quizOptions: [
          {
            id: "Practical_strategies",
            title: "Practical_strategies",
            description: "",
            icon: "✅",
            score: 1,
          },
          {
            id: "New_ideas_inspiration",
            title: "New ideas / inspiration",
            description: "",
            icon: "🙋",
            score: 1,
          },
          {
            id: "Benchmarking_against_others",
            title: "Benchmarking against others",
            description: "",
            icon: "🙋",
            score: 1,
          },
          {
            id: "Specific_solutions_to_a_challenge",
            title: "Specific solutions to a challenge",
            description: "",
            icon: "🙋",
            score: 1,
          },
        ],
        goForward_cta: { label: "See My Results", href: "#" },
        goBack_cta: { label: "Back", href: "#" },
      },
    },
  ],
};

export const Quiz6PagePayload: PagePayloadSchema = {
  id: "page_06o4cp821341278s5u2w0y6b",
  slug: "/stepper/q/page_06o4cp821341278s5u2w0y6b",
  title: "Question - Crypto Accreditation Check",
  order: 7,

  pageType: "normal_page",
  created_at: "2025-06-01T08:00:00.000Z",
  updated_at: "2025-09-15T14:32:00.000Z",
  published_at: "2025-06-15T09:00:00.000Z",
  sections: [
    {
      id: "sec_quiz_06",
      order: 0,
      type: "quiz",
      template_id: "QUIZ__SINGLE_STEP__LIGHT__v1_0",
      is_visible: true,
      content: {
        questionType: "long_text",
        categoryIds: ["Your_goals"],
        quizHeading: "What would make this webinar a success for you?",
        quizSubtext: "",
        quizOptions: [],
        goForward_cta: { label: "See My Results", href: "#" },
        goBack_cta: { label: "Back", href: "#" },
      },
    },
  ],
};

export const Quiz7PagePayload: PagePayloadSchema = {
  id: "page_07p5dq932452389t6v3x1z7c",
  slug: "/stepper/q/page_07p5dq932452389t6v3x1z7c",
  title: "Question - Crypto Accreditation Check",
  order: 8,

  pageType: "normal_page",
  created_at: "2025-06-01T08:00:00.000Z",
  updated_at: "2025-09-15T14:32:00.000Z",
  published_at: "2025-06-15T09:00:00.000Z",
  sections: [
    {
      id: "sec_quiz_07",
      order: 0,
      type: "quiz",
      template_id: "QUIZ__SINGLE_STEP__LIGHT__v1_0",
      is_visible: true,
      content: {
        questionType: "long_text",
        categoryIds: [],
        quizHeading: "What tools or platforms are you currently using?",
        quizSubtext: "",
        quizOptions: [],
        goForward_cta: { label: "See My Results", href: "#" },
        goBack_cta: { label: "Back", href: "#" },
      },
    },
  ],
};

export const Quiz8PagePayload: PagePayloadSchema = {
  id: "page_08q6er043563490u7w4y2a8d",
  slug: "/stepper/q/page_08q6er043563490u7w4y2a8d",
  title: "Question - Crypto Accreditation Check",
  order: 9,

  pageType: "normal_page",
  created_at: "2025-06-01T08:00:00.000Z",
  updated_at: "2025-09-15T14:32:00.000Z",
  published_at: "2025-06-15T09:00:00.000Z",
  sections: [
    {
      id: "sec_quiz_08",
      order: 0,
      type: "quiz",
      template_id: "QUIZ__SINGLE_STEP__LIGHT__v1_0",
      is_visible: true,
      content: {
        questionType: "single_choice",
        categoryIds: ["Personalisation"],
        quizHeading:
          "Would you like to receive additional resources after the event?",
        quizSubtext: "",
        quizOptions: [
          {
            id: "yes_please",
            title: "Yes please",
            description: "",
            icon: "✅",
            score: 2,
          },
          {
            id: "No_thanks",
            title: "No thanks",
            description: "",
            icon: "✅",
            score: 0,
          },
        ],
        goForward_cta: { label: "See My Results", href: "#" },
        goBack_cta: { label: "Back", href: "#" },
      },
    },
  ],
};

// ─── Number-input pages (feed the calculation engine) ─────────────────────────
// Three consecutive `number`-type questions whose answers are consumed by the
// calculations block in funnelPayload as answer_ref nodes.
// Section IDs (sec_num_mau, sec_num_arpu, sec_num_churn_rate) are referenced
// directly in the calculations.variables expressions — keep them stable.

export const QuizNumMAUPagePayload: PagePayloadSchema = {
  id: "page_10r7fs154674501v8x5a3c9e",
  slug: "/stepper/q/page_10r7fs154674501v8x5a3c9e",
  title: "Question - Monthly Active Users",
  order: 10,
  pageType: "normal_page",
  created_at: "2025-06-01T08:00:00.000Z",
  updated_at: "2025-09-15T14:32:00.000Z",
  published_at: "2025-06-15T09:00:00.000Z",
  sections: [
    {
      id: "sec_num_mau",
      order: 0,
      type: "quiz",
      template_id: "QUIZ__SINGLE_STEP__LIGHT__v1_0",
      is_visible: true,
      content: {
        questionType: "number",
        categoryIds: [],
        quizHeading:
          "How many monthly active users does your product currently have?",
        quizSubtext: "Enter your best estimate — even a rough number works.",
        quizOptions: [],
        placeholder: "e.g. 500",
        goForward_cta: { label: "Next", href: "#" },
        goBack_cta: { label: "Back", href: "#" },
      },
    },
  ],
};

export const QuizNumARPUPagePayload: PagePayloadSchema = {
  id: "page_11s8gt265785612w9y6b4d0f",
  slug: "/stepper/q/page_11s8gt265785612w9y6b4d0f",
  title: "Question - Average Revenue Per User",
  order: 11,
  pageType: "normal_page",
  created_at: "2025-06-01T08:00:00.000Z",
  updated_at: "2025-09-15T14:32:00.000Z",
  published_at: "2025-06-15T09:00:00.000Z",
  sections: [
    {
      id: "sec_num_arpu",
      order: 0,
      type: "quiz",
      template_id: "QUIZ__SINGLE_STEP__LIGHT__v1_0",
      is_visible: true,
      content: {
        questionType: "number",
        categoryIds: [],
        quizHeading:
          "What is your average monthly revenue per paying user (USD)?",
        quizSubtext:
          "Total MRR ÷ number of paying customers gives this figure.",
        quizOptions: [],
        placeholder: "e.g. 49",
        goForward_cta: { label: "Next", href: "#" },
        goBack_cta: { label: "Back", href: "#" },
      },
    },
  ],
};

export const QuizNumChurnPagePayload: PagePayloadSchema = {
  id: "page_12t9hu376896723x0z7c5e1g",
  slug: "/stepper/q/page_12t9hu376896723x0z7c5e1g",
  title: "Question - Annual Churn Rate",
  order: 12,
  pageType: "normal_page",
  created_at: "2025-06-01T08:00:00.000Z",
  updated_at: "2025-09-15T14:32:00.000Z",
  published_at: "2025-06-15T09:00:00.000Z",
  sections: [
    {
      id: "sec_num_churn_rate",
      order: 0,
      type: "quiz",
      template_id: "QUIZ__SINGLE_STEP__LIGHT__v1_0",
      is_visible: true,
      content: {
        questionType: "number",
        categoryIds: [],
        quizHeading: "What is your estimated annual customer churn rate (%)?",
        quizSubtext:
          "The percentage of customers who cancel in a given year. Industry average is 5–8%.",
        quizOptions: [],
        placeholder: "e.g. 8",
        goForward_cta: { label: "See My Results", href: "#" },
        goBack_cta: { label: "Back", href: "#" },
      },
    },
  ],
};

export const ResultPagePayload: PagePayloadSchema = {
  id: "page_result_01",
  slug: "/stepper/r/page_result_01",
  title: "Your Investment Profile Results",
  order: 99,
  pageType: "result_page",
  created_at: "2025-06-01T08:00:00.000Z",
  updated_at: "2025-09-15T14:32:00.000Z",
  sections: [
    // ── Always-visible: main score breakdown ─────────────────────────────────
    // No `visibility` field → treated as "always-visible" by the renderer.
    // Zero regression for sections authored before the Audiences feature.
    {
      id: "sec_result_01",
      order: 0,
      type: "result",
      template_id: "RESULT__SCORE_BREAKDOWN__LIGHT__v1_0",
      is_visible: true,
      config: {
        background_color: "#ffffff",
        padding_top: "lg",
        padding_bottom: "xl",
      },
      content: {
        heading: "Hi {{first_name}}, Your personalised plan is ready",
        // Demonstrates {{calc.*}} token interpolation alongside static copy.
        // The engine inserts the Intl-formatted values at result-page render time.
        subtext:
          "Your business shows an estimated MRR of {{calc.mrr_estimate}}, projecting to {{calc.arr_estimate}} annually after accounting for churn.",
        scoreLabel: "Investment Readiness Score",
        welcome_message: "{{first_name}}, here are your results 🎯",
        retakeCta: { label: "Retake Quiz" },
      },
    },

    // ── Score-tier Dynamic Content demo ───────────────────────────────────────
    // isDynamic: true, source: overall → the eyebrow/heading/subtext actually
    // rendered are picked from `variantsByTier[overallTier.id]`, resolved once
    // per render via resolveDynamicContent() (see stores/funnelStore/helpers.ts).
    // The top-level heading/subtext/eyebrow below remain the fallback — what
    // renders if isDynamic were false, or if a tier is ever missing a variant.
    {
      id: "sec_result_content",
      order: 1,
      type: "detailed_category_results",
      template_id: "CONTENT_LEFT_ALLIGNED_v1",
      is_visible: true,
      visibility: {
        mode: "always-visible",
      },
      content: {
        eyebrow: "agentic shopping",
        heading: "Get real insights from real prompts",
        subtext:
          "Access the only source of real AI responses. See actual recommendations and citations of what AI is showing to users.",
        dynamicContent: {
          isDynamic: true,
          source: { type: "overall" },
          variantsByTier: {
            tier_weakest: {
              eyebrow: "room to grow",
              heading: "Your results show real opportunity ahead",
              subtext:
                "Your answers point to a few clear gaps. The resources below are picked to help you close them fastest.",
            },
            tier_balanced: {
              eyebrow: "solid footing",
              heading: "You're closer than you think",
              subtext:
                "You've got a good foundation in place. A few focused changes could meaningfully move the needle.",
            },
            tier_strongest: {
              eyebrow: "agentic shopping",
              heading: "Get real insights from real prompts",
              subtext:
                "Access the only source of real AI responses. See actual recommendations and citations of what AI is showing to users.",
            },
          },
        },
      },
    },

    // ── Audience-based: detailed breakdown for high-performers ──────────────
    // Rendered only when the respondent matches the "high_performers" audience
    // (overall score ≥ 67, i.e. Tier 3). Founders and PMs who are scaling fast
    // see an in-depth category analysis; others see the lighter overview above.
    {
      id: "sec_result_detailed_categories",
      order: 2,
      type: "detailed_category_results",
      template_id: "DETAILEDCATEGORYRESULTS__CARD_GRID__LIGHT__v1_0",
      is_visible: true,
      visibility: {
        mode: "audience-based",
        audienceIds: ["aud_high_performers", "aud_scaling_founders"],
      },
      content: {
        heading: "A closer look at your strengths",
        subtext:
          "Here's how you performed across each pillar of product-led growth.",
        categoryContent: {},
        fallbackTemplate:
          "Your score in {{category.current.title}} came in at {{category.current.percentage}}%, " +
          "placing you in the {{category.current.tier}} tier. " +
          "This is an area where focused attention can unlock meaningful gains — " +
          "review the resources in your personalised plan for next steps.",
      },
    },

    // ── Audience-based: early-stage CTA ─────────────────────────────────────
    // Shown only to respondents in the "early_stage" audience (Pre-launch or
    // Early traction stage, score below 50). Guides them toward the webinar
    // rather than a self-serve upgrade flow that would be premature.
    {
      id: "sec_result_cta_early",
      order: 3,
      type: "cta",
      template_id: "CTA__SPLIT_RIGHT__DARK__v1_0",
      is_visible: true,
      visibility: {
        mode: "audience-based",
        audienceIds: ["aud_early_stage"],
      },
      content: {
        heading: "Ready to accelerate?",
        subtext:
          "Join our live webinar and learn the exact frameworks used by SaaS teams to go from traction to scale — without the guesswork.",
        form_eyebrow: "Save your spot",
        input_placeholder: "Enter your email",
        submit_label: "Register for free",
        privacy_notice: "By registering you agree to our",
        privacy_policy_cta: {
          label: "Privacy Policy",
          href: "/privacy",
          variant: "link",
        },
      },
    },

    // ── Visibility mode "none" demo ──────────────────────────────────────────
    // This section is authored but intentionally suppressed for all respondents.
    // Demonstrates the "none" mode: the section exists in the schema for future
    // activation but never renders during the current campaign.
    {
      id: "sec_result_hidden_upsell",
      order: 4,
      type: "cta",
      template_id: "CTA__SPLIT_RIGHT__DARK__v1_0",
      is_visible: true,
      visibility: { mode: "none" },
      content: {
        heading: "Upgrade to Pro",
        subtext: "Unlock advanced analytics and unlimited funnel steps.",
        submit_label: "Start free trial",
      },
    },
  ],
};

export const funnelPayload: funnelPayloadSchema = {
  id: "funnel_1", // UUID
  slug: "", // URL path, e.g., "/about"
  title: "", // Internal CMS label, not rendered
  status: "draft",
  theme: {
    colors: {
      page_background: { type: "color", value: "#FAFAF8" },
      card_background: { type: "color", value: "#FFFFFF" },
      text: {
        heading: "#0B3D36",
        body: "#5B6B68",
        link: "#0B3D36",
      },
    },
    palette: {
      primary_accent: "#0B3D36",
      secondary_accent: "#C5F0A4",
    },
    typography: {
      headings: { family: "Manrope", weight: "600" },
      body: { family: "Source Sans 3", weight: "400" },
    },
  },
  questionCategories: [
    {
      id: "About_you",
      title: "About you",
      description: "",
      icon: "📊",
    },
    {
      id: "Your_current_challenges",
      title: "Your current challenges",
      description: "",
      icon: "⏳",
    },
    {
      id: "Your_goals",
      title: "Your goals",
      description: "",
      icon: "⚖️",
    },
    {
      id: "Personalisation",
      title: "Personalisation",
      description: "",
      icon: "⚖️",
    },
  ],
  // ── Score tiers ────────────────────────────────────────────────────────────
  // `id` is a stable, author-assigned slug — NOT a randomly generated value.
  // Dynamic Content variant maps (ContentSection.dynamicContent.variantsByTier)
  // and AudienceCondition's category_score/tier_id metric both key directly
  // off this id; a non-deterministic id (e.g. uuid() re-minted on every module
  // load) would silently orphan every variant/predicate authored against it.
  scoreTiers: [
    {
      id: "tier_weakest",
      label: "weakest",
      color: "#92e161",
      score_from: 0,
      score_to: 33,
    },
    {
      id: "tier_balanced",
      label: "balanced",
      color: "#40b43a",
      score_from: 34,
      score_to: 66,
    },
    {
      id: "tier_strongest",
      label: "strongest",
      color: "#23810b",
      score_from: 67,
      score_to: 100,
    },
  ],

  // ── Audience definitions ─────────────────────────────────────────────────
  // Mock data for the Audiences feature. Each audience's predicate is
  // evaluated once in resolveToResult() against the respondent's full
  // post-submission context (answers + leadData + scoreResult). The resolved
  // Set<audienceId> is stored in Zustand and consumed by SectionTypeRenderer.
  //
  // Audience IDs are referenced in ResultPagePayload sections via
  // `visibility.audienceIds`. Adding a new audience here and referencing it
  // in a section's visibility config is the complete authoring loop.
  audiences: [
    // ── High performers ───────────────────────────────────────────────────
    // Respondents whose overall score falls in Tier 3 (≥ 67%). They see the
    // detailed per-category breakdown section on the result page.
    {
      id: "aud_high_performers",
      name: "High Performers — Tier 3",
      description:
        "Respondents who scored 67% or above overall, placing them in the top tier.",
      retroactive: true,
      predicate: {
        operator: "AND",
        conditions: [
          {
            type: "category_score",
            categoryId: "overall",
            metric: "percentage",
            operator: "gte",
            value: 67,
          },
        ],
      },
      created_at: "2025-10-01T00:00:00.000Z",
    },

    // ── Scaling founders ──────────────────────────────────────────────────
    // Respondents who selected "Founder/CEO" as their role AND are at the
    // Scaling or Established stage. Also sees the detailed breakdown section.
    // Demonstrates AND logic combining a quiz answer condition with a second
    // quiz answer condition.
    {
      id: "aud_scaling_founders",
      name: "Scaling & Established Founders",
      description:
        'Founder or CEO respondents who are at the "Scaling" or "Established" stage.',
      retroactive: true,
      predicate: {
        operator: "AND",
        conditions: [
          {
            type: "option_selected",
            sectionId: "sec_quiz_01", // "What is your role?"
            optionIds: ["founder_or_ceo"],
          },
          {
            // Nested OR group: Scaling OR Established stage
            operator: "OR",
            conditions: [
              {
                type: "option_selected",
                sectionId: "sec_quiz_02", // "What stage is your SaaS business at?"
                optionIds: ["Scaling"],
              },
              {
                type: "option_selected",
                sectionId: "sec_quiz_02",
                optionIds: ["Established"],
              },
            ],
          },
        ],
      },
      created_at: "2025-10-01T00:00:00.000Z",
    },

    // ── Early stage ───────────────────────────────────────────────────────
    // Respondents at Pre-launch or Early traction stage whose overall score
    // is below 50%. They see the webinar registration CTA instead of the
    // detailed breakdown, since self-serve resources would be premature.
    // Demonstrates AND logic combining a quiz answer with a score condition.
    {
      id: "aud_early_stage",
      name: "Early Stage — Below 50%",
      description:
        "Pre-launch or Early traction respondents who scored below 50% overall.",
      retroactive: false,
      predicate: {
        operator: "AND",
        conditions: [
          {
            // Nested OR: Pre-launch OR Early traction
            operator: "OR",
            conditions: [
              {
                type: "option_selected",
                sectionId: "sec_quiz_02",
                optionIds: ["Prelaunch"],
              },
              {
                type: "option_selected",
                sectionId: "sec_quiz_02",
                optionIds: ["Early_traction"],
              },
            ],
          },
          {
            type: "category_score",
            categoryId: "overall",
            metric: "percentage",
            operator: "lt",
            value: 50,
          },
        ],
      },
      created_at: "2025-10-01T00:00:00.000Z",
    },

    // ── Personalisation opt-in ────────────────────────────────────────────
    // Respondents who answered "Yes please" to receiving additional resources.
    // Demonstrates a lead_field_equals condition combined with quiz answer.
    // (In a real flow this would gate a nurture email section or PDF offer.)
    {
      id: "aud_resources_optin",
      name: "Resources Opt-In",
      description:
        "Respondents who opted in to receive additional resources after the event.",
      retroactive: true,
      predicate: {
        operator: "AND",
        conditions: [
          {
            type: "option_selected",
            sectionId: "sec_quiz_08", // "Would you like to receive additional resources?"
            optionIds: ["yes_please"],
          },
        ],
      },
      created_at: "2025-10-01T00:00:00.000Z",
    },

    // ── High-score lead form respondents ─────────────────────────────────
    // Demonstrates lead_field_equals: respondents from the technology industry
    // who scored highly. In production this would gate a sales-led CTA.
    {
      id: "aud_tech_high_score",
      name: "Tech Industry — High Score",
      description:
        "Technology industry respondents who scored 67% or above overall.",
      retroactive: true,
      predicate: {
        operator: "AND",
        conditions: [
          {
            type: "lead_field_equals",
            fieldId: "industry",
            operator: "eq",
            value: "tech",
          },
          {
            type: "category_score",
            categoryId: "overall",
            metric: "percentage",
            operator: "gte",
            value: 67,
          },
        ],
      },
      created_at: "2025-10-02T00:00:00.000Z",
    },

    // ── Lowest category: "About you" ─────────────────────────────────────
    // Demonstrates category_rank: respondents whose weakest category is
    // "About you". In production this would gate a targeted improvement guide.
    {
      id: "aud_weakest_about_you",
      name: 'Weakest Category: "About You"',
      description: 'Respondents whose lowest-scoring category is "About you".',
      retroactive: false,
      predicate: {
        operator: "AND",
        conditions: [
          {
            type: "category_rank",
            rank: "lowest",
            categoryId: "About_you",
          },
        ],
      },
      created_at: "2025-10-02T00:00:00.000Z",
    },
  ],
  lead_form: {
    enable_lead_signup: true,
    lead_signup_required: false,
    heading: "Almost there!",
    subtext: "Share a few details to unlock your personalised investment plan.",
    submit_label: "Get My Results",
    skip_label: "Skip for now",
    privacy_notice: "Your information is secure and will never be shared.",
    fields: [
      {
        id: "email",
        type: "email",
        label: "Email Address",
        placeholder: "you@example.com",
        required: true,
      },
    ],
  },
  // ── Calculation engine mock data ────────────────────────────────────────────
  // Variables are declared in dependency order (leaves first).
  // `calc_ref` nodes reference the `id` of a previously-declared variable.
  // Section IDs referenced in `answer_ref` nodes must match quiz section IDs.
  // `visible_on_result: false` hides internal tier-classifier variables from
  // the CalcResultsPanel while still making them available as {{calc.*}} tokens.
  calculations: {
    variables: [
      // ── Leaf variables (direct answer reads) ────────────────────────────────
      {
        id: "monthly_active_users",
        label: "Monthly Active Users",
        expression: {
          type: "answer_ref",
          sectionId: "sec_num_mau",
          transform: "value",
        },
        display: { format: "integer", locale: "en-US" },
        error_fallback: "N/A",
      },
      {
        id: "avg_revenue_per_user",
        label: "Avg. Revenue / User",
        expression: {
          type: "answer_ref",
          sectionId: "sec_num_arpu",
          transform: "value",
        },
        display: {
          format: "currency",
          locale: "en-US",
          currency_code: "USD",
          decimal_places: 2,
        },
        error_fallback: "N/A",
      },
      {
        id: "churn_rate_input",
        label: "Annual Churn Rate",
        expression: {
          type: "answer_ref",
          sectionId: "sec_num_churn_rate",
          transform: "value",
        },
        display: {
          format: "percentage",
          locale: "en-US",
          decimal_places: 1,
          multiplier: 0.01, // stored as whole number (8), displayed as 8.0%
        },
        error_fallback: "N/A",
      },

      // ── Derived variables (calc_ref chains) ────────────────────────────────
      {
        id: "mrr_estimate",
        label: "Estimated MRR",
        description: "Monthly Active Users × Average Revenue Per User",
        display_formula: "MAU × ARPU",
        expression: {
          type: "binary_op",
          operator: "*",
          left: { type: "calc_ref", calcId: "monthly_active_users" },
          right: { type: "calc_ref", calcId: "avg_revenue_per_user" },
        },
        display: {
          format: "currency",
          locale: "en-US",
          currency_code: "USD",
          decimal_places: 0,
          suffix: "/mo",
        },
        error_fallback: "Unavailable",
      },
      {
        id: "arr_estimate",
        label: "Projected ARR",
        description: "MRR × 12",
        display_formula: "MRR × 12",
        expression: {
          type: "binary_op",
          operator: "*",
          left: { type: "calc_ref", calcId: "mrr_estimate" },
          right: { type: "literal", value: 12 },
        },
        display: {
          format: "currency",
          locale: "en-US",
          currency_code: "USD",
          decimal_places: 0,
          suffix: "/yr",
        },
        error_fallback: "Unavailable",
      },
      {
        id: "churn_adjusted_arr",
        label: "Churn-Adjusted ARR",
        description:
          "ARR × (1 − churn% ÷ 100) — net revenue after annual churn",
        display_formula: "ARR × (1 − churn% / 100)",
        expression: {
          type: "binary_op",
          operator: "*",
          left: { type: "calc_ref", calcId: "arr_estimate" },
          right: {
            type: "binary_op",
            operator: "-",
            left: { type: "literal", value: 1 },
            right: {
              type: "binary_op",
              operator: "/",
              left: {
                type: "answer_ref",
                sectionId: "sec_num_churn_rate",
                transform: "value",
              },
              right: { type: "literal", value: 100 },
            },
          },
        },
        display: {
          format: "currency",
          locale: "en-US",
          currency_code: "USD",
          decimal_places: 0,
          suffix: "/yr",
        },
        error_fallback: "Unavailable",
      },

      // ── Tier classifier (hidden from panel, usable as {{calc.*}} token) ────
      {
        id: "revenue_growth_tier",
        label: "Revenue Growth Tier",
        description:
          "1 = Early Stage (<$10k MRR), 2 = Growth ($10k–$50k), 3 = Scale (>$50k)",
        expression: {
          type: "conditional",
          condition: {
            operator: ">=",
            left: { type: "calc_ref", calcId: "mrr_estimate" },
            right: { type: "literal", value: 50000 },
          },
          consequent: { type: "literal", value: 3 },
          alternate: {
            type: "conditional",
            condition: {
              operator: ">=",
              left: { type: "calc_ref", calcId: "mrr_estimate" },
              right: { type: "literal", value: 10000 },
            },
            consequent: { type: "literal", value: 2 },
            alternate: { type: "literal", value: 1 },
          },
        },
        display: {
          format: "integer",
          visible_on_result: false, // tier number alone is not meaningful in the panel
        },
        error_fallback: "1",
      },
    ],
  } satisfies FunnelCalculations,

  pages: [
    { ...LandingpagePayload },
    { ...Quiz1PagePayload },
    { ...Quiz2PagePayload },
    { ...Quiz3PagePayload },
    { ...Quiz4PagePayload },
    { ...MiniResultPagePayload },
    { ...Quiz5PagePayload },
    { ...Quiz6PagePayload },
    { ...Quiz7PagePayload },
    { ...Quiz8PagePayload },
    // Number-input pages consumed by the calculation engine
    { ...QuizNumMAUPagePayload },
    { ...QuizNumARPUPagePayload },
    { ...QuizNumChurnPagePayload },
    { ...ResultPagePayload },
  ],
  created_at: "2025-06-01T08:00:00.000Z",
  updated_at: "2025-09-15T14:32:00.000Z",
  published_at: "2025-06-15T09:00:00.000Z",
};
