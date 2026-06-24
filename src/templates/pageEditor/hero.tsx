import { SectionTemplates } from "@/stores/pageEditorStore/types";
import { nanoid } from "nanoid";

const genId = (): string => nanoid(8);

export const HeroTemplates: SectionTemplates[] = [
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
      className: "",
      name: "hero 1",
      type: "section",
      sectionType: "hero",
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
          id: `column-${nanoid(8)}`,
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
              className: "max-w-xl",
              name: "",
              type: "div_block",
              isHidden: false,
              settings: {},
              content: [
                {
                  id: `text-${nanoid(8)}`,
                  styles: {},
                  className: "",
                  name: "",
                  type: "text",
                  isHidden: false,
                  content: {
                    innerText: `<h1 className="text-5xl lg:text-[3.5rem] leading-[1.1] font-medium  mb-6">Build professional websites easy, fast, and affordable</h1>`,
                  },
                },
                {
                  id: `text-${nanoid(8)}`,
                  styles: {},
                  className: "",
                  name: "",
                  type: "text",
                  isHidden: false,
                  content: {
                    innerText: `<p className="text-base lg:text-lg leading-relaxed max-w-lg">Visually build and design beautiful, responsive web projects without compromising your vision.</p>`,
                  },
                },
                {
                  id: `btns-${nanoid(8)}`,
                  styles: {},
                  className: "mt-10 flex items-center gap-4",
                  name: "",
                  type: "buttons",
                  layoutType: "",
                  isHidden: false,
                  settings: {
                    itemsHorizontalAlignment: "flex-start",
                    showPrivacyStatement: true,
                    privacyStatement:
                      "By clicking you agree to the Terms of use and service",
                  },
                  content: [
                    {
                      id: `btn-${nanoid(8)}`,
                      styles: {},
                      className:
                        " flex items-center gap-2 font-medium px-7 py-3.5 rounded-lg shadow-lg transition-all hover:shadow-xl",
                      name: "",
                      type: "button_item",
                      isHidden: false,
                      settings: {
                        btn_action: "go_to_questions",
                        btn_style: "default",
                      },
                      content: {
                        href: "/questions",
                        innerText: " GET YOUR FREE ANALYSIS",
                      },
                    },
                    {
                      id: `btn-${nanoid(8)}`,
                      styles: {},
                      className:
                        "inline-flex justify-center items-center text-center font-medium  px-7 py-3.5 rounded-lg  shadow-sm",
                      name: "",
                      type: "button_item",
                      isHidden: false,
                      settings: {
                        btn_action: "go_to_questions",
                        btn_style: "outline",
                      },
                      content: {
                        href: "",
                        innerText: "Learn More",
                      },
                    },
                  ],
                },
              ],
            },
            {
              id: `div-${nanoid(8)}`,
              styles: {},
              className: "relative h-[500px] w-full",
              name: "",
              type: "div_block",
              isHidden: false,
              settings: {},
              content: [
                {
                  id: `img-${nanoid(8)}`,
                  styles: {
                    maxWidth: "100%",
                    objectFit: "cover",
                    borderRadius: "2.5rem",
                    maxHeight: "100%",
                  },
                  className:
                    "absolute z-0 inset-0 w-full h-full object-cover object-center",
                  name: "",
                  type: "image",
                  isHidden: false,
                  settings: {
                    backgroundSource: undefined,
                    mediaResizeMaxWidth: 600,
                    mediaResizeMaxHeight: 600,
                  },
                  content: {
                    src: "/assets/imageplaceholder.svg",
                    innerText: "",
                    width: 1200,
                    height: 1200,
                  },
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
        minHeight: "85vh",
      },
      className: "py-24 px-6  md:px-8 ",
      name: "hero 2",
      type: "section",
      sectionType: "hero",
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
          id: genId(),
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
            //section_layout: "",
            content_alignment: "",
          },
          content: [
            {
              id: genId(),
              styles: {
                maxWidth: "768px",
              },
              className: "",
              name: "",
              type: "rows",
              isHidden: false,
              content: [
                {
                  id: genId(),
                  styles: {
                    gap: "20px",
                  },
                  className: "flex flex-col items-center sm:items-stretch ",
                  name: "",
                  type: "div_block",
                  isHidden: false,
                  content: [
                    {
                      id: genId(),
                      styles: {
                        textAlign: "center",
                      },
                      className:
                        "font-bold text-center text-[60px] leading-[1.1] sm:text-[36px] tracking-[-0.05em]  md:text-[48px] ",
                      name: "",
                      type: "text",
                      isHidden: false,
                      content: {
                        innerText: `<h1 className="text-center font-bold text-[36px] leading-[1.1] sm:text-[48px] tracking-[-0.05em]  md:text-[60px]">Build professional websites easy, fast, and affordable</h1>`,
                      },
                    },
                    {
                      id: genId(),
                      styles: {
                        textAlign: "center",
                      },
                      className: " text-[20px] ",
                      name: "",
                      type: "text",
                      isHidden: false,
                      content: {
                        innerText: `<p className="text-base lg:text-lg leading-relaxed text-center">Visually build and design beautiful, responsive web projects without compromising your vision.</p>`,
                      },
                    },
                  ],
                },
                {
                  id: genId(),
                  styles: {},
                  className: "w-full mt-6",
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
                      id: genId(),
                      styles: {},
                      className:
                        " inline-flex justify-center items-center text-center outline-none m-[1px] h-[36px] px-[16px] rounded-[8px] shadow-sm",
                      name: "",
                      type: "button_item",
                      isHidden: false,
                      settings: {
                        btn_action: "go_to_questions",
                        btn_style: "default",
                      },
                      content: {
                        href: "/questions",
                        innerText: " GET YOUR FREE ANALYSIS",
                      },
                    },
                    {
                      id: genId(),
                      styles: {},
                      className:
                        "inline-flex justify-center items-center text-center  m-[1px] h-[36px] px-[16px] rounded-[8px]  shadow-sm",
                      name: "",
                      type: "button_item",
                      isHidden: false,
                      settings: {
                        btn_action: "go_to_questions",
                        btn_style: "outline",
                      },
                      content: {
                        href: "",
                        innerText: "Learn More",
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
  },
  {
    id: genId(),
    name: "",
    preview: "",
    properties: {},
    templateContent: {
      id: `section-${nanoid(8)}`,
      styles: {
        minHeight: "85vh",
      },
      className: "py-24 px-6  md:px-8 ",
      name: "hero 3",
      type: "section",
      sectionType: "hero",
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
          id: genId(),
          styles: {
            marginRight: "auto",
            marginLeft: "auto",
            maxWidth: "1280px",
          },
          className: "w-full flex flex-col items-center",
          name: "",
          type: "container",
          isHidden: false,
          settings: {
            //section_layout: "",
            content_alignment: "",
          },
          content: [
            {
              id: genId(),
              styles: {
                maxWidth: "",
              },
              className: "",
              name: "",
              type: "rows",
              isHidden: false,
              content: [
                {
                  id: genId(),
                  styles: {},
                  className: "items-center justify-center",
                  name: "",
                  type: "rows",
                  isHidden: false,
                  content: [
                    {
                      id: genId(),
                      styles: {
                        gap: "20px",
                        maxWidth: "768px",
                      },
                      className:
                        "flex flex-col items-center justify-center sm:items-stretch ",
                      name: "",
                      type: "div_block",
                      isHidden: false,
                      content: [
                        {
                          id: genId(),
                          styles: {
                            textAlign: "center",
                          },
                          className:
                            "font-bold text-center text-[60px] leading-[1.1] sm:text-[36px] tracking-[-0.05em]  md:text-[48px] ",
                          name: "",
                          type: "text",
                          isHidden: false,
                          content: {
                            innerText: `<h1 className="text-center font-bold text-[36px] leading-[1.1] sm:text-[48px] tracking-[-0.05em]  md:text-[60px]">Build professional websites easy, fast, and affordable</h1>`,
                          },
                        },
                        {
                          id: genId(),
                          styles: { textAlign: "center" },
                          className: "text-[20px]  ",
                          name: "",
                          type: "text",
                          isHidden: false,
                          content: {
                            innerText: `<p className="text-base lg:text-lg leading-relaxed text-center">Visually build and design beautiful, responsive web projects without compromising your vision.</p>`,
                          },
                        },
                      ],
                    },
                    {
                      id: genId(),
                      styles: {},
                      className: "w-full",
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
                          id: genId(),
                          styles: {},
                          className:
                            " inline-flex justify-center items-center text-center outline-none m-[1px] h-[36px] px-[16px] rounded-[8px] shadow-sm",
                          name: "",
                          type: "button_item",
                          isHidden: false,
                          settings: {
                            btn_action: "go_to_questions",
                            btn_style: "default",
                          },
                          content: {
                            href: "/questions",
                            innerText: " GET YOUR FREE ANALYSIS",
                          },
                        },
                        {
                          id: genId(),
                          styles: {},
                          className:
                            "inline-flex justify-center items-center text-center  m-[1px] h-[36px] px-[16px] rounded-[8px]  shadow-sm",
                          name: "",
                          type: "button_item",
                          isHidden: false,
                          settings: {
                            btn_action: "go_to_questions",
                            btn_style: "outline",
                          },
                          content: {
                            href: "",
                            innerText: "Learn More",
                          },
                        },
                      ],
                    },
                  ],
                },
                {
                  id: genId(),
                  styles: {
                    marginTop: "72px",
                  },
                  className: "",
                  name: "",
                  type: "div_block",
                  isHidden: false,
                  content: [
                    {
                      id: genId(),
                      styles: {
                        width: "1278px",
                        height: "540px",
                        maxWidth: "100%",
                        objectFit: "cover",
                        borderRadius: "24px",
                      },
                      className: "w-[1278px] h-[540px]",
                      name: "",
                      type: "image",
                      isHidden: false,
                      settings: {
                        backgroundSource: undefined,
                        mediaResizeMaxWidth: 1278,
                        mediaResizeMaxHeight: 640,
                      },
                      content: {
                        src: "",
                        innerText: " GET YOUR FREE ANALYSIS",
                        width: 1278,
                        height: 640,
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
  },
  {
    id: genId(),
    name: "",
    preview: "",
    properties: {},
    templateContent: {
      id: `section-${nanoid(8)}`,
      styles: {
        minHeight: "85vh",
      },
      className: "py-24 px-6  md:px-8 ",
      name: "hero 4",
      type: "section",
      sectionType: "hero",
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
          id: genId(),
          styles: {
            paddingTop: "0px",
            paddingBottom: "0px",
            // paddingLeft: "32px",
            // paddingRight: "32px",
            marginTop: "0px",
            marginBottom: "0px",
            marginRight: "auto",
            marginLeft: "auto",
            maxWidth: "1280px",
          },
          className: "w-full h-full  py-8 md:py-[24px]",
          name: "",
          type: "container",
          isHidden: false,
          settings: {
            //section_layout: "",
            content_alignment: "",
          },
          content: [
            {
              id: genId(),
              styles: {},
              className: "",
              name: "",
              type: "rows",
              isHidden: false,
              content: [
                {
                  id: genId(),
                  styles: {},
                  className: "",
                  name: "",
                  type: "columns",
                  isHidden: false,
                  content: [
                    {
                      id: genId(),
                      styles: {
                        maxWidth: "560px",
                      },
                      className:
                        "w-full flex flex-col items-center justify-center sm:items-stretch gap-[20px]",
                      name: "",
                      type: "div_block",
                      isHidden: false,
                      content: [
                        {
                          id: genId(),
                          styles: {},
                          className: " ",
                          name: "",
                          type: "text",
                          isHidden: false,
                          content: {
                            innerText: `<h1 className="font-bold text-[36px] leading-[1.1] sm:text-[48px] tracking-[-0.05em]  md:text-[60px]">Build professional websites easy, fast, and affordable</h1>`,
                          },
                        },
                      ],
                    },
                    {
                      id: genId(),
                      styles: {
                        gap: "20px",
                      },
                      className:
                        "flex flex-col items-start flex-1 sm:items-stretch",
                      name: "",
                      type: "div_block",
                      isHidden: false,
                      content: [
                        {
                          id: genId(),
                          styles: {},
                          className: "text-[20px]  ",
                          name: "",
                          type: "text",
                          isHidden: false,
                          content: {
                            innerText: `<p className="text-base lg:text-lg leading-relaxed ">Visually build and design beautiful, responsive web projects without compromising your vision.</p>`,
                          },
                        },
                        {
                          id: genId(),
                          styles: {},
                          className: "w-full mt-6",
                          name: "",
                          type: "buttons",
                          layoutType: "",
                          isHidden: false,
                          settings: {
                            itemsTextAlignment: "",
                            showPrivacyStatement: true,
                            privacyStatement:
                              "By clicking you agree to the Terms of use and service",
                          },
                          content: [
                            {
                              id: genId(),
                              styles: {},
                              className:
                                " inline-flex justify-center items-center text-center outline-none m-[1px] h-[36px] px-[16px] rounded-[8px] shadow-sm",
                              name: "",
                              type: "button_item",
                              isHidden: false,
                              settings: {
                                btn_action: "go_to_questions",
                                btn_style: "default",
                              },
                              content: {
                                href: "/questions",
                                innerText: " GET YOUR FREE ANALYSIS",
                              },
                            },
                            {
                              id: genId(),
                              styles: {},
                              className:
                                "inline-flex justify-center items-center text-center  m-[1px] h-[36px] px-[16px] rounded-[8px]  shadow-sm",
                              name: "",
                              type: "button_item",
                              isHidden: false,
                              settings: {
                                btn_action: "go_to_questions",
                                btn_style: "outline",
                              },
                              content: {
                                href: "",
                                innerText: "Learn More",
                              },
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
                {
                  id: genId(),
                  styles: {
                    marginTop: "72px",
                  },
                  className: "",
                  name: "",
                  type: "div_block",
                  isHidden: false,
                  content: [
                    {
                      id: genId(),
                      styles: {
                        width: "1278px",
                        height: "540px",
                        objectFit: "cover",
                        borderRadius: "24px",
                      },
                      className: "w-[1278px] h-[540px]",
                      name: "",
                      type: "image",
                      isHidden: false,
                      settings: {
                        backgroundSource: undefined,
                        mediaResizeMaxWidth: 1278,
                        mediaResizeMaxHeight: 640,
                      },
                      content: {
                        src: "",
                        innerText: " GET YOUR FREE ANALYSIS",
                        width: 1278,
                        height: 640,
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
  },
];
