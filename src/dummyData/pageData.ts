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
      template_id: "HEADER__STICKY_TOP__LIGHT__v1_0",
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
      template_id: "HERO__SPLIT_LEFT__LIGHT__v1_0",
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

    {
      id: "sec_stats_01",
      order: 2,
      type: "stats",
      is_visible: true,
      template_id: "STATS__GRID_4COL__LIGHT__v1_0",
      config: {
        background_color: "#ffffff",
        padding_top: "md",
        padding_bottom: "xl",
      },
      content: {
        heading:
          "We are passionate about empowering individuals and businesses to take control of their finances and achieve their financial goals.",
        subtext:
          "We are dedicated to revolutionizing the way individuals and businesses manage their finances. Our team is committed to providing intuitive and innovative solutions that empower our users to achieve financial success.",
        stats: [
          {
            value: "95%",
            label: "Customer satisfaction rate, reflecting our dedication",
          },
          {
            value: "10+",
            label: "Innovation and insight to users' financial journeys",
          },
          {
            value: "$10m",
            label: "Platform has ensuring secure and efficient financial",
          },
          {
            value: "50m",
            label: "Users worldwide, providing them with financial solutions",
          },
        ],
      },
    },

    {
      id: "sec_features_01",
      order: 3,
      type: "features",
      is_visible: true,
      template_id: "FEATURES__CARD_GRID__LIGHT__v1_0",
      config: {
        background_color: "#ffffff",
        padding_top: "md",
        padding_bottom: "xl",
      },
      content: {
        heading: "Discover what sets us apart",
        subtext:
          "Explore the unique features and advantages that distinguish us from the competition, delivering exceptional value and innovation",
        features: [
          {
            icon_id: "layout_grid",
            title: "User-Friendly Experience",
            description:
              "Designed for simplicity, so you can focus on work, not the tool.",
          },
          {
            icon_id: "link",
            title: "Flexible & Customizable",
            description:
              "Adapts to your workflow with Kanban, List, and Calendar views.",
          },
          {
            icon_id: "users",
            title: "Seamless Collaboration",
            description:
              "Keep your team aligned with shared tasks, real-time updates, and integrations.",
          },
          {
            icon_id: "lock",
            title: "Secure & Reliable",
            description:
              "Data encryption and cloud storage ensure your information is always protected.",
          },
          {
            icon_id: "smartphone",
            title: "Acquisitions Advisory",
            description:
              "Our Acquisitions Advisory service provides expert guidance throughout the entire acquisition process, from initial strategy.",
          },
          {
            icon_id: "shield",
            title: "Risk Mitigation",
            description:
              "Protect your financial assets and investments with our risk mitigation solutions. We identify potential risks, and safeguard your financial future.",
          },
          {
            icon_id: "trending_up",
            title: "Financial Forecasting",
            description:
              "Plan for a secure financial future with Akaunt's financial planning service. Our expert advisors offer personalized financial plans to your goals.",
          },
          {
            icon_id: "file_text",
            title: "Tax Planning",
            description:
              "Our platform helps you track deductible expenses, generate tax reports, and stay compliant with the latest tax regulations.",
          },
          {
            icon_id: "bar_chart",
            title: "Investment Strategies",
            description:
              "We analyze your financial goals, risk tolerance, and market conditions to develop a personalized investment plan.",
          },
        ],
      },
    },

    {
      id: "sec_faq_01",
      order: 4,
      type: "faq",
      is_visible: true,
      template_id: "FAQ__SPLIT_LEFT__LIGHT__v1_0",
      config: {
        background_color: "#ffffff",
        padding_top: "xl",
        padding_bottom: "xl",
      },
      content: {
        heading: "Any questions?\nWe got you.",
        subtext:
          "Yet bed any for assistance indulgence unpleasing. Not thoughts all exercise blessing. Indulgence way everything joy alteration boisterous the attachment.",
        more_faqs_cta: {
          label: "More FAQs",
          href: "/faq",
          variant: "link",
          icon_id: "arrow_right",
        },
        default_open_id: "item-1",
        faqs: [
          {
            id: "item-1",
            question: "Is my data safe with your platform?",
            answer:
              "Yes, we prioritize data security. We use industry-standard encryption for data at rest and in transit, and we are fully compliant with GDPR and SOC2 standards to ensure your information remains protected.",
          },
          {
            id: "item-2",
            question: "What kind of customer support do you offer?",
            answer:
              "We offer 24/7 customer support via email and live chat for all plans. Enterprise customers also get access to a dedicated account manager and priority phone support.",
          },
          {
            id: "item-3",
            question: "How does the pricing for your SaaS solution work?",
            answer:
              "Our pricing is tiered based on feature usage and seat count. We offer a free tier for startups, a Pro tier for growing teams, and custom Enterprise pricing. You can view our pricing page for more details.",
          },
          {
            id: "item-4",
            question: "Can I cancel my subscription at any time?",
            answer:
              "Absolutely. You can cancel your subscription directly from your account dashboard at any time. Your access will remain active until the end of your current billing cycle.",
          },
          {
            id: "item-5",
            question: "Can I upgrade or downgrade my subscription plan?",
            answer:
              "Yes, you can adjust your plan at any time. Upgrades take effect immediately with prorated billing, while downgrades are applied at the start of the next billing cycle.",
          },
        ],
      },
    },

    {
      id: "sec_faq_02",
      order: 5,
      type: "faq",
      is_visible: true,
      template_id: "FAQ__CENTERED__LIGHT__v1_0",
      config: {
        background_color: "#ffffff",
        padding_top: "xl",
        padding_bottom: "xl",
      },
      content: {
        badge: {
          label: "FAQ",
          icon_id: "help_circle",
          variant: "success",
        },
        heading: "Some of the things you\nmay want to know",
        subtext: "We answered questions so you don't have to ask them.",
        faqs: [
          {
            id: "item-1",
            question: "Is my data safe with your platform?",
            answer:
              "Yes, we prioritize data security. We use industry-standard encryption for data at rest and in transit, and we are fully compliant with GDPR and SOC2 standards to ensure your information remains protected.",
          },
          {
            id: "item-2",
            question: "What kind of customer support do you offer?",
            answer:
              "We offer 24/7 customer support via email and live chat for all plans. Enterprise customers also get access to a dedicated account manager and priority phone support.",
          },
          {
            id: "item-3",
            question: "How does the pricing for your SaaS solution work?",
            answer:
              "Our pricing is tiered based on feature usage and seat count. We offer a free tier for startups, a Pro tier for growing teams, and custom Enterprise pricing. You can view our pricing page for more details.",
          },
          {
            id: "item-4",
            question: "Can I cancel my subscription at any time?",
            answer:
              "Absolutely. You can cancel your subscription directly from your account dashboard at any time. Your access will remain active until the end of your current billing cycle.",
          },
          {
            id: "item-5",
            question: "Can I upgrade or downgrade my subscription plan?",
            answer:
              "Yes, you can adjust your plan at any time. Upgrades take effect immediately with prorated billing, while downgrades are applied at the start of the next billing cycle.",
          },
        ],
      },
    },

    {
      id: "sec_newsletter_01",
      order: 6,
      type: "cta",
      is_visible: true,
      template_id: "CTA__SPLIT_RIGHT__DARK__v1_0",
      config: {
        background_color: "#ffffff",
        padding_top: "xl",
        padding_bottom: "xl",
      },
      content: {
        heading: "Subscribe our newsletter",
        subtext:
          "Subscribe to our newsletter and be the first to receive insights, updates, and expert tips on optimizing your financial management.",
        form_eyebrow: "Stay up to date",
        input_placeholder: "Enter your email",
        submit_label: "Subscribe",
        privacy_notice: "By subscribing you agree to our",
        privacy_policy_cta: {
          label: "Privacy Policy",
          href: "/privacy",
          variant: "link",
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
      id: "sec_quiz_04",
      order: 0,
      type: "mini_result",
      template_id: "MINIRESULT__SINGLE_STEP__LIGHT__v1_0",
      is_visible: true,
      content: {
        brackets: [],
        // heading:
        //   "You are passionate about empowering individuals and businesses to take control of their finances and achieve their financial goals.",
        // subtext:
        //   "Find out more how you can dedicated to revolutionizing the way individuals and businesses manage their finances. ",
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
        categoryIds: [""],
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
    {
      id: "sec_result_01",
      order: 0,
      type: "result",
      template_id: "RESULT__SCORE_BREAKDOWN__LIGHT__v1_0",
      is_visible: true,
      content: {
        heading: "Your personalised plan is ready",
        // Demonstrates {{calc.*}} token interpolation alongside static copy.
        // The engine inserts the Intl-formatted values at result-page render time.
        subtext:
          "Your business shows an estimated MRR of {{calc.mrr_estimate}}, projecting to {{calc.arr_estimate}} annually after accounting for churn.",
        scoreLabel: "Investment Readiness Score",
        welcome_message: "{{first_name}}, here are your results 🎯",
        retakeCta: { label: "Retake Quiz" },
      },
    },
  ],
};

export const funnelPayload: funnelPayloadSchema = {
  id: "funnel_1", // UUID
  slug: "", // URL path, e.g., "/about"
  title: "", // Internal CMS label, not rendered
  status: "draft",
  //   config: ,
  // ── Sample funnel theme ───────────────────────────────────────────────────
  // Demonstrates the theming system end-to-end: a warm off-white page, a
  // dark-teal/pale-green accent pairing that ties back into the existing
  // newsletter card (templates/sections/cta.tsx uses these same hexes), and
  // the spec's default Manrope/Source Sans 3 typographic pairing. Funnels
  // with no `theme` field fall back to THEME_DEFAULTS (Tailwind's original
  // blue/gray palette) with zero visual regression — this block is purely
  // illustrative for QA-ing the theme pipeline end to end.
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
      {
        id: "first_name",
        type: "first_name",
        label: "First Name",
        placeholder: "e.g. Jane",
        required: false,
      },
      {
        id: "last_name",
        type: "last_name",
        label: "Last Name",
        placeholder: "e.g. Smith",
        required: false,
      },
      {
        id: "phone",
        type: "phone",
        label: "Phone Number",
        placeholder: "+1 (555) 000-0000",
        required: false,
      },
      {
        id: "industry",
        type: "industry",
        label: "Industry",
        placeholder: "Select your industry",
        required: false,
        options: [
          { value: "tech", label: "Technology" },
          { value: "finance", label: "Finance & Banking" },
          { value: "healthcare", label: "Healthcare" },
          { value: "real_estate", label: "Real Estate" },
          { value: "education", label: "Education" },
          { value: "retail", label: "Retail & E-Commerce" },
          { value: "other", label: "Other" },
        ],
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
