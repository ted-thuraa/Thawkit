import { v4 as uuidv4 } from "uuid";
import { nanoid } from "nanoid";

export const DefaultscoreTiers = [
  {
    id: uuidv4(),
    projectId: "",
    name: "weakest",
    scoreColour: "#92e161",
    scoreFrom: 0,
    scoreTo: 33,
  },
  {
    id: uuidv4(),
    projectId: "",
    name: "balanced",
    scoreColour: "#40b43a",
    scoreFrom: 34,
    scoreTo: 66,
  },
  {
    id: uuidv4(),
    projectId: "",
    name: "strongest",
    scoreColour: "#23810b",
    scoreFrom: 67,
    scoreTo: 100,
  },
];

export const quizPageTemplate: any[] = [
  {
    id: nanoid(),
    styles: {},
    className: "",
    name: "Quiz 1",
    type: "quizCanvas",
    sectionType: "quiz",
    preview: "",
    isHidden: false,
    settings: {
      //section_layout: "columns",
      section_full_bleed: false,
      backgroundType: "color",
      backgroundSource: undefined,
      showQuizProgressBar: true,
    },
    content: [
      {
        id: nanoid(),
        styles: {},
        className: "",
        name: "Questions",
        type: "questions",
        isHidden: false,
        settings: {
          content_alignment: "",
          question_option_btn_color: "",
          showQuizProgressBar: true,
        },
        content: [
          {
            id: nanoid(),
            styles: {},
            className: "",
            name: "Answers",
            type: "question_options",
            isHidden: false,
            settings: {
              //section_layout: "",
              btn_style: "default",
              content_alignment: "",
              question_option_btn_color: "",
            },
            content: [],
          },
        ],
      },
      {
        id: nanoid(),
        styles: {},
        className: "",
        name: "",
        type: "leadForm",
        isHidden: false,
        settings: {
          quizContext: "Quiz_Page",
          quizId: "",
        },
        content: [
          {
            id: nanoid(),
            styles: {},
            className: "text-center font-semibold leading-none tracking-tight",
            name: "",
            type: "text",
            isHidden: false,
            settings: {},
            content: {
              innerText: "<h3>Where should we send the results</h3>",
            },
          },
          {
            id: nanoid(),
            styles: {},
            className: "font-semibold leading-none tracking-tight",
            name: "",
            type: "button_item",
            isHidden: false,
            settings: {},
            content: {
              innerText: "Send results",
            },
          },
        ],
      },
    ],
  },
];

export const defaultLeadForm = {
  id: "lead-gen-f1",
  formName: "Where should we send your result",
  cta: "Send Results",
  fields: [
    {
      name: "firstName",
      type: "text",
      order: 1,
      enabled: true,
      required: true,
      ui: {
        label: "First Name",
        placeholder: "John",
        width: "half",
      },
      validation: {
        min: 2,
        max: 100,
        customMessage: "First name must be between 2 and 100 characters.",
      },
    },
    {
      name: "lastName",
      type: "text",
      order: 2,
      enabled: true,
      required: true,
      ui: {
        label: "Last Name",
        placeholder: "Doe",
        width: "half",
      },
      validation: {
        min: 2,
        max: 100,
        customMessage: "Last name must be between 2 and 100 characters.",
      },
    },
    {
      name: "email",
      type: "email",
      order: 3,
      enabled: true,
      required: true,
      ui: {
        label: "Email Address",
        placeholder: "john.doe@example.com",
        width: "full",
        //leftIcon: Mail,
      },
      validation: {},
    },

    {
      name: "subscribe",
      type: "checkbox",
      order: 9,
      enabled: true,
      required: false,
      defaultValue: true,
      ui: {
        label: "Subscribe to our newsletter for updates.",
        width: "full",
      },
      validation: {},
    },
    {
      name: "honeypot", // This name is intentionally generic
      type: "hidden",
      order: 99,
      enabled: true,
      required: false,
      isHoneypot: true,
      ui: {
        label: "Please leave this field blank",
      },
      validation: {
        max: 0, // Must be an empty string
      },
    },
  ],
  config: {
    optin_type: "Implied",
    leadform_entry: "before",
    privacy_statement: "I have read and agree to the privacy policy",
    privacy_wording: "receive updates via email",
    privacy_policy_url: "",
  },
};

export const defaultPageSettings = {
  backgroundType: "color",
  backgroundSource: "#FFFFFF",
};

export const defaultQuizPageSettings = {
  backgroundType: "color",
  backgroundSource: "#FFFFFF",
  generate_leads: true,
  quizRedirectLogic: {
    strategy: "DEFAULT",
    config: {
      default: {
        resultPageId: undefined,
      },
      scoreTier: {
        fallbackPageId: undefined,
        mappings: [],
      },
      outcome: {
        scoringDirection: "HIGHEST",
        fallbackPageId: undefined,
        mappings: [],
      },
    },
  },
};

export const DefaultFunnelPageInserts = [
  {
    id: nanoid(),
    funnelId: "",
    title: "Main page",
    pathName: "/",
    order: 0,
    type: "Landing_Page" as const,
    status: "Draft" as const,
    defaultPage: true,
    meta_title: "",
    meta_description: "",
    previewImage: "",
    scripts: {
      headScript: "",
      bodyScript: "",
    },
    settings: JSON.stringify([defaultPageSettings]),
    content: JSON.stringify([]),
  },
  {
    id: nanoid(),
    funnelId: "",
    title: "Quiz page",
    pathName: "quiz",
    order: 0,
    type: "Quiz_Page" as const,
    status: "Draft" as const,
    defaultPage: true,
    meta_title: "",
    meta_description: "",
    previewImage: "",
    scripts: {
      headScript: "",
      bodyScript: "",
    },
    settings: JSON.stringify([defaultQuizPageSettings]),
    content: JSON.stringify(quizPageTemplate),
  },
  {
    id: nanoid(),
    funnelId: "",
    title: "Outcome page",
    pathName: "result",
    order: 1,
    type: "Result_Page" as const,
    status: "Draft" as const,
    defaultPage: true,
    meta_title: "",
    meta_description: "",
    previewImage: "",
    scripts: {
      headScript: "",
      bodyScript: "",
    },
    settings: JSON.stringify([defaultPageSettings]),
    content: JSON.stringify([]),
  },
];
