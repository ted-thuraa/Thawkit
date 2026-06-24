import { v4 } from "uuid";

export const pricingCards = [
  {
    title: "Starter",
    description: "Perfect for trying out Agencywhiz",
    price: "Free",
    popular: false,
    duration: "month",
    highlight: "Key features",
    features: ["3 Sub accounts", "2 Team members", "Unlimited pipelines"],
    priceId: "",
    lmnsqzy_variant_id: "",
  },
  {
    title: "Plus",
    description: "Start small",
    price: "$199",
    popular: true,
    duration: "month",
    highlight: "Key features",
    features: ["Rebilling", "24/7 Support team"],
    priceId: "",
    lmnsqzy_variant_id: "",
  },
  {
    title: "Pro",
    description: "For serious agency owners",
    price: "$49",
    popular: false,
    duration: "month",
    highlight: "Everything in Starter, plus",
    features: ["Unlimited Sub accounts", "Unlimited Team members"],
    priceId: "",
    lmnsqzy_variant_id: "",
  },
];

export const addOnProducts = [
  { title: "Priority Support", id: "prod_PNjJAE2EpP16pn" },
];

export type EditorBtns =
  | "text"
  | "heading"
  | "paragraph"
  | "list"
  | "link"
  | "button"
  | "container"
  | "section"
  | "hero_section"
  | "div"
  | "span"
  | "grid"
  | "contactForm"
  | "paymentForm"
  | "routeName"
  | "2Col"
  | "2Rows"
  | "video"
  | "image"
  | "icon"
  | "__body"
  | "image"
  | "PieChartDonutWithText"
  | null
  | "3Col";

export type HtmlTags =
  | "main"
  | "section"
  | "div"
  | "span"
  | "a"
  | "button"
  | "H1"
  | "H2"
  | "H3"
  | "H4"
  | "p"
  | "img"
  | "video"
  | "form"
  | "PieChartDonutWithText"
  | null;

export const defaultStyles: React.CSSProperties = {
  backgroundPosition: "center",
  objectFit: "cover",
  backgroundRepeat: "no-repeat",
  textAlign: "left",
  opacity: "100%",
};
export const createProjectCards = [
  {
    title: "Use a",
    highlightedText: "Template",
    description: "Pick from our database of templates",
    type: "create-template",
  },
  {
    title: "Use",
    highlightedText: "Creative Ai",
    description: "Let ai handle everthing for you",
    type: "create-Ai",
    highlight: true,
  },
  {
    title: "Start from",
    highlightedText: "Scratch",
    description: "Start from scratch",
    type: "create-scratch",
  },
];
