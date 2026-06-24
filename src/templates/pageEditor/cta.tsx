import { ElementNode, SectionTemplates } from "@/stores/pageEditorStore/types";
import { v4 } from "uuid";
import { nanoid } from "nanoid";

const genId = (): string => nanoid(8);

export const CallToActionTemplates: SectionTemplates[] = [
  {
    id: v4(),
    name: "CTA_1_CenteredHeadline",
    preview: "",
    properties: {},
    templateContent: {
      id: v4(),
      styles: {
        minHeight: "85vh",
      },
      className: "py-24 px-6 md:px-8",
      name: "CTA_1_CenteredHeadline",
      type: "section",
      sectionType: "cta",
      preview: "",
      isHidden: false,
      settings: {
        section_full_bleed: false,
        backgroundType: "color",
        backgroundSource: undefined,
        itemsVerticalAlignment: "center",
      },
      content: [
        {
          id: v4(),
          styles: {
            paddingTop: "32px",
            paddingBottom: "32px",
            marginRight: "auto",
            marginLeft: "auto",
            maxWidth: "1280px",
          },
          className: "w-full flex flex-col items-center",
          name: "",
          type: "container",
          isHidden: false,
          settings: {
            content_alignment: "",
          },
          content: [
            {
              id: v4(),
              styles: {
                maxWidth: "768px",
              },
              className: "",
              name: "",
              type: "rows",
              isHidden: false,
              content: [
                {
                  id: v4(),
                  styles: {
                    gap: "20px",
                  },
                  className:
                    "mx-auto flex flex-col items-center sm:items-stretch",
                  name: "",
                  type: "div_block",
                  isHidden: false,
                  content: [
                    {
                      id: v4(),
                      styles: {
                        textAlign: "center",
                      },
                      className:
                        "font-bold text-[60px] leading-[1.1] sm:text-[36px] tracking-[-0.05em] md:text-[48px]",
                      name: "",
                      type: "text",
                      isHidden: false,
                      content: {
                        innerText: "<h1>Main Headline Goes Here</h1>",
                      },
                    },
                    {
                      id: v4(),
                      styles: {
                        textAlign: "center",
                      },
                      className: "text-[20px]",
                      name: "",
                      type: "text",
                      isHidden: false,
                      content: {
                        innerText:
                          "<p>Supporting description or contextual statement for this section.</p>",
                      },
                    },
                    {
                      id: v4(),
                      styles: {},
                      className: "mt-10",
                      name: "",
                      type: "buttons",
                      layoutType: "",
                      isHidden: false,
                      settings: {
                        itemsHorizontalAlignment: "center",
                        showPrivacyStatement: true,
                        privacyStatement:
                          "By clicking you agree to the Terms of use and service",
                      },
                      content: [
                        {
                          id: v4(),
                          styles: {},
                          className:
                            "inline-flex justify-center items-center text-center outline-none m-[1px] h-[36px] px-[16px] rounded-[8px] shadow-sm",
                          name: "",
                          type: "button_item",
                          isHidden: false,
                          settings: {
                            btn_action: "go_to_questions",
                            btn_style: "default",
                          },
                          content: {
                            href: "/questions",
                            innerText: "Primary Action",
                          },
                        },
                        {
                          id: v4(),
                          styles: {},
                          className:
                            "inline-flex justify-center items-center text-center m-[1px] h-[36px] px-[16px] rounded-[8px] shadow-sm",
                          name: "",
                          type: "button_item",
                          isHidden: false,
                          settings: {
                            btn_action: "go_to_questions",
                            btn_style: "outline",
                          },
                          content: {
                            href: "",
                            innerText: "Secondary Action",
                          },
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  },
  {
    id: genId(),
    name: "",
    preview: "",
    properties: {},
    templateContent: {
      id: `section-${nanoid(8)}`,
      styles: {
        // minHeight: "85vh",
      },
      className: "py-10 md:py-16 ",
      name: "Cta 1",
      type: "section",
      sectionType: "cta",
      preview: "",
      isHidden: false,
      settings: {
        //section_layout: "columns",
        section_full_bleed: false,
        backgroundType: "color",
        backgroundSource: undefined,
      },
      content: [
        {
          id: `container-${nanoid(8)}`,
          styles: {},
          className:
            "max-w-6xl mx-auto border border-[#0b3d36] rounded-[40px] p-10 md:p-16 lg:p-20 flex flex-col ",
          name: "",
          type: "container",
          isHidden: false,
          settings: {
            column_reverse_order: true,
          },
          content: [
            {
              id: `columns-${nanoid(8)}`,
              styles: {},
              className: "",
              name: "",
              type: "columns",
              isHidden: false,
              settings: {
                column_reverse_order: false,
              },
              content: [
                {
                  id: `div-${nanoid(8)}`,
                  styles: {},
                  className: "flex-1 max-w-xl",
                  name: "",
                  type: "div_block",
                  isHidden: false,
                  settings: {},
                  content: [
                    {
                      id: v4(),
                      styles: {},
                      className:
                        "text-4xl md:text-5xl font-medium mb-6 leading-[1.1] tracking-tight",
                      name: "",
                      type: "text",
                      isHidden: false,
                      content: {
                        innerText: `<h2 className="text-3xl md:text-4xl font-medium leading-[1.1] tracking-tight">Build professional websites easy, fast, and affordable</h2>`,
                      },
                    },
                    {
                      id: v4(),
                      styles: {},
                      className:
                        "text-sm md:text-base leading-relaxed max-w-md",
                      name: "",
                      type: "text",
                      isHidden: false,
                      content: {
                        innerText: `<p className="text-sm md:text-base leading-relaxed max-w-md">Subscribe to our newsletter and be the first to receive
                  insights, updates, and expert tips on optimizing your
                  financial management.</p>`,
                      },
                    },
                  ],
                },
                {
                  id: `div-${nanoid(8)}`,
                  styles: {},
                  className:
                    "w-full lg:w-auto flex flex-col gap-4 min-w-[320px] md:min-w-[440px]",
                  name: "",
                  type: "div_block",
                  isHidden: false,
                  settings: {},
                  content: [
                    {
                      id: v4(),
                      styles: {},
                      className: "text-sm mb-1 ml-1",
                      name: "",
                      type: "text",
                      isHidden: false,
                      content: {
                        innerText: `<p className="text-sm">Stay up to date.</p>`,
                      },
                    },
                    {
                      id: v4(),
                      styles: {},
                      className: "",
                      name: "",
                      type: "form",
                      isHidden: false,
                      settings: {
                        formType: "email_only",
                        formLayout: "row",
                      },
                      content: [
                        {
                          id: v4(),
                          styles: {},
                          className:
                            "w-full border-none  rounded-full py-4 px-6 outline-none transition-all",
                          name: "",
                          type: "input",
                          isHidden: false,
                          content: [],
                        },
                        {
                          id: v4(),
                          styles: {},
                          className:
                            "w-full sm:w-auto  font-semibold py-4 px-8 rounded-full  whitespace-nowrap",
                          name: "",
                          type: "button_item",
                          isHidden: false,
                          settings: {},
                          content: {
                            href: "",
                            innerText: "Subscribe",
                          },
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  },
  {
    id: v4(),
    name: "CTA_3_CountdownOffer",
    preview: "",
    properties: {},
    templateContent: {
      id: v4(),
      styles: {},
      className: "",
      name: "CTA_3_CountdownOffer",
      type: "section",
      sectionType: "cta",
      preview: "",
      isHidden: false,
      settings: {
        section_full_bleed: false,
        backgroundType: "color",
        backgroundSource: undefined,
      },
      content: [
        {
          id: v4(),
          styles: {
            paddingTop: "32px",
            paddingBottom: "32px",
            marginRight: "auto",
            marginLeft: "auto",
            maxWidth: "1280px",
          },
          className: "w-full flex flex-col",
          name: "",
          type: "container",
          isHidden: false,
          settings: {
            content_alignment: "",
          },
          content: [
            {
              id: v4(),
              styles: {},
              className: "",
              name: "",
              type: "columns",
              isHidden: false,
              settings: {
                column_reverse_order: false,
              },
              content: [
                {
                  id: v4(),
                  styles: {
                    gap: "20px",
                  },
                  className: "flex flex-col",
                  name: "",
                  type: "div_block",
                  isHidden: false,
                  content: [
                    {
                      id: v4(),
                      styles: {},
                      className:
                        "font-bold text-[36px] leading-[1.1] sm:text-[36px] tracking-[-0.05em] md:text-[48px]",
                      name: "",
                      type: "text",
                      isHidden: false,
                      content: {
                        innerText: "<h1>Prominent Countdown Title</h1>",
                      },
                    },
                    {
                      id: v4(),
                      styles: {},
                      className: "text-[20px]",
                      name: "",
                      type: "text",
                      isHidden: false,
                      content: {
                        innerText:
                          "<p>Informative statement related to the countdown event or offer.</p>",
                      },
                    },
                  ],
                },
                {
                  id: v4(),
                  styles: {
                    gap: "",
                  },
                  className: "",
                  name: "",
                  type: "div_block",
                  isHidden: false,
                  content: [
                    {
                      id: v4(),
                      styles: {
                        maxWidth: "100%",
                        width: "600px",
                        height: "100%",
                        borderRadius: "24px",
                      },
                      className: "",
                      name: "",
                      type: "CountDownTimer",
                      isHidden: false,
                      settings: {},
                      content: {
                        innerText: "Countdown Placeholder Text",
                        targetDate: "2025-12-31T23:59:59",
                      },
                    },
                    {
                      id: v4(),
                      styles: {},
                      className: "",
                      name: "",
                      type: "buttons",
                      layoutType: "",
                      isHidden: false,
                      settings: {
                        itemsHorizontalAlignment: "center",
                      },
                      content: [
                        {
                          id: v4(),
                          styles: {},
                          className:
                            "inline-flex justify-center items-center text-center outline-none m-[1px] h-[36px] px-[16px] rounded-[8px] shadow-sm",
                          name: "",
                          type: "button_item",
                          isHidden: false,
                          settings: {
                            btn_action: "go_to_questions",
                            btn_style: "default",
                          },
                          content: {
                            href: "/questions",
                            innerText: "Primary Action",
                          },
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  },
];
