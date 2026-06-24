import { fieldTypeEnum } from "@/drizzle/schemas/enums";
import { fontOptions } from "@/lib/fonts";
import { LeadFormSchemaType } from "@/lib/pageEditor/editorLeadFormSchema";
import { FormField, OrderTypesEnum, QuestionOption } from "@/lib/types/project";
import { InferEnum } from "drizzle-orm";

export type DeviceType = "Desktop" | "Mobile" | "Tablet";
export type EditorMode = "edit" | "preview" | "live";
export type MediaType = "image" | "video";
export type PageType = "Landing_Page" | "Quiz_Page" | "Result_Page";

export interface PageTheme {
  colors: {
    palette: {
      primary: string;
      secondary: string;
      accent: string;
      btnForeground: string;
    };
    text: {
      heading: string;
      body: string;
      card: string;
      card_heading_foreground: string;
      card_body_foreground: string;
    };
    background: {
      card: string;
      page: string;
    };
  };
  typography: {
    headings: {
      fontFamily: string;
      weight: "normal" | "medium" | "bold";
    };
    body: {
      fontFamily: string;
      weight: "normal" | "medium";
    };
  };
  design: {
    card: {
      roundness: string;
      shadow: string;
      border: string;
      border_color: string;
      transparency: string;
    };
  };
}

export const defaultTheme: PageTheme = {
  colors: {
    palette: {
      primary: "#3B82F6",
      secondary: "#1E40AF",
      accent: "#10B981",
      btnForeground: "#FFFFFF",
    },
    text: {
      heading: "#000000",
      body: "#000000",
      card: "#000000",
      card_heading_foreground: "#000000",
      card_body_foreground: "#000000",
    },
    background: {
      card: "#FFFFFF",
      page: "#FFFFFF",
    },
  },
  typography: {
    headings: {
      // FIX: Use the Key, not the variable
      fontFamily: "inter",
      weight: "bold",
    },
    body: {
      // FIX: Use the Key
      fontFamily: "inter",
      weight: "normal",
    },
  },
  design: {
    card: {
      roundness: "1.5rem",
      shadow: "none",
      border: "1px",
      border_color: "#000000",
      transparency: "1",
    },
  },
};

export type OrderTypes =
  | "asc"
  | "asc_categories"
  | "branching_logic"
  | "random";
export interface ProjectData {
  id: String;
  ref: String;
  title: String;
  domain: String;
  draftMode: Boolean;
  questionOrder: OrderTypes;
  settings:
    | {
        generate_leads?: boolean;
        quizRedirectLogic?: QuizRedirectLogic;
      }
    | undefined;
  leadOptinForm: LeadFormSchemaType | undefined;
}

export interface PageSettings {
  backgroundType: string;
  backgroundSource: string;
  generate_leads?: boolean;
  quizRedirectLogic?: QuizRedirectLogic;
}

export interface FunnelPage {
  id: string;
  title: string;
  type: PageType;
  status: string | null;
  defaultPage: boolean;
  order: number;
  pathName: string;
  metaTitle: string | null;
  metaDescription: string | null;
  previewImage: string | null;
  scripts: {
    headScript: string;
    bodyScript: string;
  };
  theme: PageTheme;
  settings: PageSettings;
  content?: ElementNode[];
}

export type OverallOutcomeScoreChartType =
  | "pie"
  | "gauge"
  | "radar"
  | "bar"
  | "radial";
export type IndividualScoreOutcomeChartType =
  | "text_block"
  | "gauge"
  | "image"
  | "video";
export type SectionLayout = "block" | "columns" | "rows" | "2_columns";
export type ItemsHorizontalAlignment = "flex-start" | "center" | "flex-end";
export type ItemsVerticalAlignment = "flex-start" | "center" | "flex-end";
export type ButtonActions =
  | "go_to_questions"
  | "open_lead_form"
  | "go_to_section"
  | "open_link";

export type btns =
  | "link"
  | "outline"
  | "default"
  | "destructive"
  | "secondary"
  | "ghost";
// [NEW] Define the types for visibility logic
export type VisibilityLogicType =
  | "ALWAYS_VISIBLE"
  | "HIGHEST_SCORE_CATEGORY"
  | "LOWEST_SCORE_CATEGORY";

export type ElementType =
  | "navigation"
  | "section"
  | "container"
  | "div_block"
  | "columns"
  | "rows"
  | "row_item"
  | "grid"
  | "smart_layout"
  | "category_scores"
  | "category_scores_long"
  | "catItem"
  | "catItemTitle"
  | "catItemDescription"
  | "layout_item"
  | "layout_Item_Title"
  | "layout_Item_Content"
  | "testimonial_Layout"
  | "testimonial_item"
  | "testimonial_Title"
  | "testimonial_Content"
  | "testimonial_Occupation"
  | "links"
  | "buttons"
  | "button_item"
  | "image"
  | "video"
  | "text"
  | "header"
  | "progress_bar"
  | "questions"
  | "question_options"
  | "ad_banner"
  | "faq"
  | "faq_item"
  | "faq_Item_Title"
  | "faq_Item_Content"
  | "footer"
  | "LandingPage_Quiz"
  | "quizCanvas"
  | "quizProgressHeader"
  | "form"
  | "input"
  | "chart"
  | "OutcomeScoreCharts"
  | "OverallScorePieChart"
  | "DetailedCategoryScores"
  | "CountDownTimer"
  | "CategoryScoreSnapShot"
  | "IndividualScore"
  // | "IndividualScoreSection"
  | "IndividualScoreHeader"
  | "IndividualScoreChart"
  | "IndividualScoreFeedback"
  | "IndividualScoreFeedbackTitle"
  | "IndividualScoreFeedbackDescription"
  | "productCatalogue";

export interface SectionVisibilityLogic {
  type: VisibilityLogicType;
  categoryId?: string | null; // The specific category to match against
}

export interface SectionSettings {
  section_layout?: SectionLayout;
  content_alignment?: string;
  layout_columns?: number;
  section_full_bleed?: boolean;
  items_numbered?: boolean;
  itemsTextAlignment?: string;
  itemsHorizontalAlignment?: ItemsHorizontalAlignment;
  itemsVerticalAlignment?: ItemsVerticalAlignment;

  testimonalType?: "normal_testimonial" | "tweet_testimonial";

  showPrivacyStatement?: boolean;
  showItemPrice?: boolean;
  privacyStatement?: string;

  overlayColor?: string; // Optional: hex or rgba
  overlayEffect?: "none" | "faded" | "frosted";

  showIcons?: boolean;
  iconName?: string;
  cardImage?: string;
  imageResizable?: boolean;

  quizContext?: PageType;
  quizId?: string;
  showQuizProgressBar?: boolean;

  chart_type?: OverallOutcomeScoreChartType | IndividualScoreOutcomeChartType;
  chartMediaType?: MediaType;
  showChartMedia?: boolean;
  showCategoryScores?: boolean;
  showChartLabels?: boolean;
  outcomeType?: "compositionChart" | "singleMetriChart";
  showScoreTiersLabels?: boolean;
  individualScoreLogic?: "highest_score_cat" | "lowest_score_cat";

  mediaResizeMaxWidth?: number;
  mediaResizeMaxHeight?: number;

  layout?: "grid" | "flex";
  smartLayout_cardBackgroundColor?: string;

  isHighlighted?: boolean;
  btn_action?: ButtonActions;
  btn_style?: btns;
  link_type?: "text" | "icon";

  formType?: "normal" | "email_only";
  formLayout?: "column" | "row";

  contentCanBeDynamic?: boolean;
  contentIsDynamic?: boolean;
  content_Dynamic_Based_On?: "overall_score" | "category_score" | null;
  categoryId?: string;
  smart_layout_type?: string;
  column_reverse_order?: boolean;
  column_items_alignment?: "start" | "center" | "end";
  grid_columns?: number;
  question_option_btn_color?: string;

  visibilityLogic?: SectionVisibilityLogic[];
  mediaCategory?: MediaType;
  backgroundValue?: string;
  backgroundType?: "color" | MediaType;
  backgroundSource?:
    | "upload"
    | "url"
    | "gifs_giphy"
    | "ai"
    | "youtube"
    | "vimeo"
    | "loom";
}

export interface MetaDynamicData {
  score_tier_id: string;
  tierName?: string;
  content: {
    innerText?: string;
    title?: string | undefined;
    description?: string | undefined;
    src?: string;
    score_title?: string;
    score_info_box_title?: string;
    score_info_box_description?: string;
  };
}
export interface ElementNode {
  id: string;
  parentId?: string; // Add this to track parent-child relationships
  styles: React.CSSProperties;
  className: string;
  name?: string;
  sectionType?: string;
  preview?: string;
  type: ElementType;
  layoutType?: string;
  isHidden?: boolean;
  settings?: SectionSettings;
  content:
    | ElementNode[]
    | {
        href?: string;
        innerText?: string;
        src?: string;
        icon?: string;
        image?: string;
        catLabel?: string;
        title?: string;
        description?: string;
        price?: number;
        height?: number;
        width?: number;
        score_title?: string;
        score_info_box_title?: string;
        score_info_box_description?: string;
        targetDate?: string;
        metaDynamic?: MetaDynamicData[];
      };
  [k: string]: any;
}

export interface QuizRedirectLogic {
  strategy: "DEFAULT" | "SCORE_TIER" | "OUTCOME";
  config: {
    default: {
      resultPageId: string | undefined;
    };
    scoreTier: {
      fallbackPageId: string | undefined;
      mappings: {
        tierId: string;
        resultPageId: string | undefined;
      }[];
    };
    outcome: {
      scoringDirection: "HIGHEST" | "LOWEST";
      fallbackPageId: string | undefined;
      mappings: {
        categoryId: string;
        resultPageId: string | undefined;
      }[];
    };
  };
}

export interface Logicbranch {
  id: string;
  statement: "if" | "Always";
  op: "is" | "is not" | null;
  option_id: string | null;
  outcome_type: "field" | "page";
  outcome_id: string | null;
}

export interface scoring {
  id: string;
  field_Id?: string | null;
  category_id?: string | null;
  option_id?: string | null;
  category_title: string | null;
  score?: number;
}

export interface QuestionField {
  id: string;
  title: string;
  description: string;
  order: number;
  type: FieldType;
  formFieldType: FormField["formFieldType"];
  displayPage: FormField["displayPage"];
  attachment: string;
  validations: string;
  context: PageType;
  options: QuestionOption[];
  categoryIds: string[];
  logicBranch: Logicbranch[];
  scoring: scoring[];
  settings?: {
    anstype?: ansTypes;
    optionsLayout?: "grid" | "column";
    required?: boolean;
    show_instruction?: boolean;

    maybe_answer?: boolean;
    other_option?: boolean;
    multiple_line_text_input?: boolean;
    max_char?: number;
    show_media?: boolean;
    media_type?: MediaType;
    media_url?: string;
    media_position?: "left" | "right";

    answer_image_fit?: string;
    allow_multiple_selection?: boolean;
    multiple_selection_min_count?: number;
    multiple_selection_max_count?: number;
    rangeMin?: number;
    rangeMax?: number;
    startingValue?: number;
    showLabels?: boolean;
    rangeLabels?: {
      left: string;
      center: string;
      right: string;
    };
    default?: number;
    label_count?: number;
    randomize_answers?: boolean;
    vertical_alignment?: boolean;
  } | null;
}

export type FieldType =
  | "TEXT"
  | "YES_NO"
  | "MULTIPLE_CHOICE"
  | "RANGE"
  | "CONTACT_FORM"
  | "INFO_SCREEN"
  | "IMAGE_BUTTON"
  | undefined;

export type ansTypes =
  | "text"
  | "image_checkbox"
  | "button"
  | "checkbox"
  | "radio_button"
  | "basic"
  | "divided_scale"
  | "radio_button_scale"
  | "slider"
  | undefined;

export interface Quiztype {
  name: string;
  type: FieldType;

  ans_type: ansTypes;
  preview: string;
  //icon: LucideIcon;
}

export const Quiztypes: Quiztype[] = [
  {
    name: "Open text quiz",
    type: "TEXT",
    ans_type: "text",
    preview: "/assets/editor/textanswerpng.png",
  },
  {
    name: "Single Choice quiz",
    type: "YES_NO",
    ans_type: "button",
    preview: "/assets/editor/buttonchoicepng.png",
  },

  {
    name: "Multiple choice button quiz",
    type: "MULTIPLE_CHOICE",
    ans_type: "button",
    preview: "/assets/editor/multiplechoicepng.png",
  },
  // {
  //   name: "Multiple choice Checkbox",
  //   type: "MULTIPLE_CHOICE",
  //   ans_type: "checkbox",
  //   preview: "",
  //
  // },
  // {
  //   name: "Multiple choice Radio button",
  //   type: "MULTIPLE_CHOICE",
  //   ans_type: "radio_button",
  //   preview: "",
  //
  // },

  {
    name: "Sliding scale quiz",
    type: "RANGE",
    ans_type: "slider",
    preview: "/assets/editor/slideranswerpng.png",
  },

  {
    name: "Image Button quiz",
    type: "IMAGE_BUTTON",
    ans_type: "image_checkbox",
    preview: "/assets/editor/imageanswerpng.png",
  },
  // {
  //   name: "Contact Form",
  //   type: "CONTACT_FORM",
  //   ans_type: undefined,
  //   preview: "/assets/editor/contactformpng.png",
  //
  // },
  {
    name: "Info Screen",
    type: "INFO_SCREEN",
    ans_type: "basic",
    preview: "/assets/editor/infoboxpng.png",
  },
];

export const InfoTabTypes: Quiztype[] = [
  {
    name: "Info Screen",
    type: "INFO_SCREEN",
    ans_type: "basic",
    preview: "/assets/editor/infoboxpng.png",
  },
];

export type IdIndex = Map<string, number[]>; // path as array of indexes from root

/**
 * Defines the partial updates that can be applied to an ElementNode.
 */
export type PartialUpdate = {
  // either partial top-level fields (merged), or nested patches
  set?: Partial<Omit<ElementNode, "content" | "id">>;
  updateProperty?: Partial<
    Omit<ElementNode, "content" | "id" | "property" | "value">
  >;
  addItem?: Partial<Omit<ElementNode, "content" | "id" | "property" | "data">>;
  addItemAtIndex?: Partial<
    Omit<ElementNode, "content" | "id" | "afterIndex" | "data">
  >;
  removeItem?: Partial<
    Omit<ElementNode, "content" | "id" | "property" | "elementId">
  >;
  patchStyles?: Record<string, any>; // shallow merge into styles
  patchSettings?: Record<string, any>; // shallow merge into settings
  replaceContent?: ElementNode[] | null; // if present, replace content
};

export type SectionTemplates = {
  id: string;
  name: string;
  type?: "overallScore" | "categoryScore" | "individualScore";
  preview: string;
  properties: {
    hasQuiz?: boolean;
    quizType?: FieldType;
  };
  templateContent: ElementNode;
};

export type GeneratedCategoryScore = {
  categoryId: string;
  categoryTitle: string;
  scoreTierId: string;
  score_percentage: string;
  scoreTierColor: string;
  scoreTierName: string;
};

export type GeneratedOverallScore = {
  scoreTierId: string;
  scoreTierColor: string;
  score_percentage: string;
};

export type GeneratedSampleData = {
  scoreTierId: string;
  data: {
    overallScore: GeneratedOverallScore;
    categoryScores: GeneratedCategoryScore[];
  };
};

export interface ProductCatalogType {
  id: string;
  title: string;
  description: string;
  category: string;
  brand: string;
  price: string; // Formatted price string
  image: string | null; // URL
  link: string;
  isStaffPick: boolean;
}

export const dummyProductCatalogue: ProductCatalogType[] = [
  {
    id: "1",
    brand: "Zenith",
    category: "Tech",
    title: "AeroPhone Ultra",
    description: "",
    price: "$999",
    image: "/assets/imageplaceholder.svg", // Placeholder for Phone
    link: "",
    isStaffPick: true,
  },
  {
    id: "2",
    brand: "Veloce",
    category: "Vehicles",
    title: "GT Turbo S",
    description: "",
    price: "$270,000",
    image: "/assets/imageplaceholder.svg", // Placeholder for Car
    link: "",
    isStaffPick: true,
  },
  {
    id: "3",
    brand: "Chronos",
    category: "Watches",
    title: "Lunar Master",
    description: "",
    price: "$7,800",
    image: "/assets/imageplaceholder.svg", // Placeholder for Watch
    link: "",
    isStaffPick: true,
  },
];
