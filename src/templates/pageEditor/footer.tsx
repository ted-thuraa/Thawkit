import { ElementNode, SectionTemplates } from "@/stores/pageEditorStore/types";
import { v4 } from "uuid";

export const FooterTemplates: SectionTemplates[] = [
  {
    id: v4(),
    name: "",
    preview: "",
    properties: {},
    templateContent: {
      id: v4(),
      styles: {},
      className: "",
      name: "Footer 1",
      type: "section",
      sectionType: "Footer",
      preview: "",
      isHidden: false,
      settings: {
        //section_layout: "columns",
        section_full_bleed: false,
        backgroundType: "color",
        backgroundSource: undefined,
        section_layout: "block",
        itemsHorizontalAlignment: "flex-start",
      },
      content: [
        {
          id: v4(),
          styles: {},
          className: "flex flex-col w-full  mx-auto py-[32px]",
          name: "",
          type: "container",
          isHidden: false,

          content: [
            {
              id: v4(),
              styles: {
                gap: "56px",
              },
              className: "items-stretch",
              name: "",
              type: "rows",
              isHidden: false,

              content: [
                {
                  id: v4(),
                  styles: {},
                  className: "justify-between gap-[12px] md:gap-[48px]",
                  name: "",
                  type: "columns",
                  isHidden: false,

                  content: [
                    {
                      id: v4(),
                      styles: {},
                      className: "block",
                      name: "",
                      type: "div_block",
                      isHidden: false,

                      content: [
                        {
                          id: v4(),
                          styles: {
                            maxWidth: "100%",
                          },
                          className: "w-[auto] h-[24px]",
                          name: "",
                          type: "image",
                          isHidden: false,
                          settings: {
                            mediaResizeMaxWidth: 100,
                            mediaResizeMaxHeight: 100,
                          },
                          content: {
                            src: "/assets/editor/dummy_company_1_logo.svg",
                            innerText: "logo",
                            width: 400,
                            height: 400,
                          },
                        },
                      ],
                    },
                    {
                      id: v4(),
                      styles: {},
                      className: "",
                      name: "",
                      type: "div_block",
                      isHidden: false,

                      content: [
                        {
                          id: v4(),
                          styles: {},
                          className: "md:justify-end",
                          name: "",
                          type: "links",
                          isHidden: false,
                          settings: {
                            link_type: "text",
                          },
                          content: [
                            {
                              id: v4(),
                              styles: {},
                              className:
                                "no-underline tracking-[0.025em] text-[16px] font-normal",
                              name: "",
                              type: "layout_item",
                              isHidden: false,
                              settings: {},
                              content: {
                                href: "#",
                                innerText: "Features",
                              },
                            },
                            {
                              id: v4(),
                              styles: {},
                              className:
                                "no-underline tracking-[0.025em] text-[16px] font-normal",
                              name: "",
                              type: "layout_item",
                              isHidden: false,
                              settings: {},
                              content: {
                                href: "#",
                                innerText: "Pricing",
                              },
                            },
                            {
                              id: v4(),
                              styles: {},
                              className:
                                "no-underline tracking-[0.025em] text-[16px] font-normal",
                              name: "",
                              type: "layout_item",
                              isHidden: false,
                              settings: {},
                              content: {
                                href: "#",
                                innerText: "About",
                              },
                            },
                            {
                              id: v4(),
                              styles: {},
                              className:
                                "no-underline tracking-[0.025em] text-[16px] font-normal",
                              name: "",
                              type: "layout_item",
                              isHidden: false,
                              settings: {},
                              content: {
                                href: "#",
                                innerText: "Blog",
                              },
                            },
                            {
                              id: v4(),
                              styles: {},
                              className:
                                "no-underline tracking-[0.025em] text-[16px] font-normal",
                              name: "",
                              type: "layout_item",
                              isHidden: false,
                              settings: {},
                              content: {
                                href: "#",
                                innerText: "Contact",
                              },
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
                {
                  id: v4(),
                  styles: {},
                  className:
                    "block border-t-[1px] border-[var(--card-border-color)]",
                  name: "",
                  type: "div_block",
                  isHidden: false,
                  content: [],
                },
                {
                  id: v4(),
                  styles: {},
                  className: "justify-between gap-[12px] md:gap-[32px]",
                  name: "",
                  type: "columns",
                  isHidden: false,

                  content: [
                    {
                      id: v4(),
                      styles: {},
                      className: "block",
                      name: "",
                      type: "div_block",
                      isHidden: false,

                      content: [
                        {
                          id: v4(),
                          styles: {},
                          className: "text-[12px] block text-left",
                          name: "",
                          type: "text",
                          isHidden: false,
                          settings: {},
                          content: {
                            innerText: `<p>© 2024 Your company, inc All rights reserved</p>`,
                          },
                        },
                      ],
                    },
                    {
                      id: v4(),
                      styles: {},
                      className: "",
                      name: "",
                      type: "div_block",
                      isHidden: false,

                      content: [
                        {
                          id: v4(),
                          styles: {},
                          className: "md:justify-end gap-[20px]",
                          name: "",
                          type: "links",
                          isHidden: false,
                          settings: {
                            link_type: "icon",
                          },
                          content: [
                            {
                              id: v4(),
                              styles: {},
                              className: "block w-[20px] h-auto",
                              name: "",
                              type: "layout_item",
                              isHidden: false,
                              settings: {},
                              content: {
                                icon: "FaFacebook",
                              },
                            },
                            {
                              id: v4(),
                              styles: {},
                              className: "block w-[20px] h-auto",
                              name: "",
                              type: "layout_item",
                              isHidden: false,
                              settings: {},
                              content: {
                                icon: "FaXTwitter",
                              },
                            },
                            {
                              id: v4(),
                              styles: {},
                              className: "block w-[20px] h-auto",
                              name: "",
                              type: "layout_item",
                              isHidden: false,
                              settings: {},
                              content: {
                                icon: "FaSquareInstagram",
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
      ],
    },
  },
  {
    id: v4(),
    name: "",
    preview: "",
    properties: {},
    templateContent: {
      id: v4(),
      styles: {},
      className: "py-[100px]",
      name: "Footer 2",
      type: "section",
      sectionType: "Footer",
      preview: "",
      isHidden: false,
      settings: {
        //section_layout: "columns",
        section_full_bleed: false,
        backgroundType: "color",
        backgroundSource: undefined,
        section_layout: "block",
        itemsHorizontalAlignment: "flex-start",
      },
      content: [
        {
          id: v4(),
          styles: {},
          className: "flex flex-col w-full  mx-auto py-[32px]",
          name: "",
          type: "container",
          isHidden: false,

          content: [
            {
              id: v4(),
              styles: {
                gap: "40px",
              },
              className: "items-center",
              name: "",
              type: "rows",
              isHidden: false,

              content: [
                {
                  id: v4(),
                  styles: {},
                  className: "md:justify-center md:gap-y-[20px]",
                  name: "",
                  type: "links",
                  isHidden: false,
                  settings: {
                    link_type: "text",
                  },
                  content: [
                    {
                      id: v4(),
                      styles: {},
                      className:
                        "no-underline tracking-[0.025em] text-[16px] font-normal",
                      name: "",
                      type: "layout_item",
                      isHidden: false,
                      settings: {},
                      content: {
                        href: "#",
                        innerText: "Features",
                      },
                    },
                    {
                      id: v4(),
                      styles: {},
                      className:
                        "no-underline tracking-[0.025em] text-[16px] font-normal",
                      name: "",
                      type: "layout_item",
                      isHidden: false,
                      settings: {},
                      content: {
                        href: "#",
                        innerText: "Pricing",
                      },
                    },
                    {
                      id: v4(),
                      styles: {},
                      className:
                        "no-underline tracking-[0.025em] text-[16px] font-normal",
                      name: "",
                      type: "layout_item",
                      isHidden: false,
                      settings: {},
                      content: {
                        href: "#",
                        innerText: "About",
                      },
                    },
                    {
                      id: v4(),
                      styles: {},
                      className:
                        "no-underline tracking-[0.025em] text-[16px] font-normal",
                      name: "",
                      type: "layout_item",
                      isHidden: false,
                      settings: {},
                      content: {
                        href: "#",
                        innerText: "Blog",
                      },
                    },
                    {
                      id: v4(),
                      styles: {},
                      className:
                        "no-underline tracking-[0.025em] text-[16px] font-normal",
                      name: "",
                      type: "layout_item",
                      isHidden: false,
                      settings: {},
                      content: {
                        href: "#",
                        innerText: "Contact",
                      },
                    },
                  ],
                },
                {
                  id: v4(),
                  styles: {},
                  className: "md:justify-center gap-[32px]",
                  name: "",
                  type: "links",
                  isHidden: false,
                  settings: {
                    link_type: "icon",
                  },
                  content: [
                    {
                      id: v4(),
                      styles: {},
                      className: "block w-[20px] h-auto",
                      name: "",
                      type: "layout_item",
                      isHidden: false,
                      settings: {},
                      content: {
                        icon: "FaFacebook",
                      },
                    },
                    {
                      id: v4(),
                      styles: {},
                      className: "block w-[20px] h-auto",
                      name: "",
                      type: "layout_item",
                      isHidden: false,
                      settings: {},
                      content: {
                        icon: "FaXTwitter",
                      },
                    },
                    {
                      id: v4(),
                      styles: {},
                      className: "block w-[20px] h-auto",
                      name: "",
                      type: "layout_item",
                      isHidden: false,
                      settings: {},
                      content: {
                        icon: "FaSquareInstagram",
                      },
                    },
                  ],
                },
                {
                  id: v4(),
                  styles: {},
                  className: "text-[12px] block text-center",
                  name: "",
                  type: "text",
                  isHidden: false,
                  settings: {},
                  content: {
                    innerText: `<p>© 2024 Your company, inc All rights reserved</p>`,
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
    id: v4(),
    name: "",
    preview: "",
    properties: {},
    templateContent: {
      id: v4(),
      styles: {},
      className: "py-[80px]",
      name: "Footer 3",
      type: "section",
      sectionType: "Footer",
      preview: "",
      isHidden: false,
      settings: {
        //section_layout: "columns",
        section_full_bleed: false,
        backgroundType: "color",
        backgroundSource: undefined,
        section_layout: "block",
        itemsHorizontalAlignment: "flex-start",
      },
      content: [
        {
          id: v4(),
          styles: {},
          className: "flex flex-col w-full  mx-auto py-[32px]",
          name: "",
          type: "container",
          isHidden: false,

          content: [
            {
              id: v4(),
              styles: {},
              className: "justify-between gap-[12px]  md:gap-[32px]",
              name: "",
              type: "columns",
              isHidden: false,

              content: [
                {
                  id: v4(),
                  styles: {},
                  className: "block ",
                  name: "",
                  type: "div_block",
                  isHidden: false,
                  settings: {},
                  content: [
                    {
                      id: v4(),
                      styles: {},
                      className: "text-[12px] block text-left",
                      name: "",
                      type: "text",
                      isHidden: false,
                      settings: {},
                      content: {
                        innerText: `<p>© 2024 Your company, inc All rights reserved</p>`,
                      },
                    },
                  ],
                },

                {
                  id: v4(),
                  styles: {},
                  className: "gap-[20px]",
                  name: "",
                  type: "links",
                  isHidden: false,
                  settings: {
                    link_type: "icon",
                  },
                  content: [
                    {
                      id: v4(),
                      styles: {},
                      className: "block w-[20px] h-auto",
                      name: "",
                      type: "layout_item",
                      isHidden: false,
                      settings: {},
                      content: {
                        icon: "FaFacebook",
                      },
                    },
                    {
                      id: v4(),
                      styles: {},
                      className: "block w-[20px] h-auto",
                      name: "",
                      type: "layout_item",
                      isHidden: false,
                      settings: {},
                      content: {
                        icon: "FaXTwitter",
                      },
                    },
                    {
                      id: v4(),
                      styles: {},
                      className: "block w-[20px] h-auto",
                      name: "",
                      type: "layout_item",
                      isHidden: false,
                      settings: {},
                      content: {
                        icon: "FaSquareInstagram",
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
    id: v4(),
    name: "",
    preview: "",
    properties: {},
    templateContent: {
      id: v4(),
      styles: {},
      className: "py-[100px]",
      name: "Footer 4",
      type: "section",
      sectionType: "Footer",
      preview: "",
      isHidden: false,
      settings: {
        //section_layout: "columns",
        section_full_bleed: false,
        backgroundType: "color",
        backgroundSource: undefined,
        section_layout: "block",
        itemsHorizontalAlignment: "flex-start",
      },
      content: [
        {
          id: v4(),
          styles: {},
          className: "flex flex-col w-full  mx-auto ",
          name: "",
          type: "container",
          isHidden: false,
          content: [
            {
              id: v4(),
              styles: {
                gap: "32px",
              },
              className: "items-center",
              name: "",
              type: "rows",
              isHidden: false,

              content: [
                {
                  id: v4(),
                  styles: {},
                  className: "md:justify-center md:gap-y-[20px]",
                  name: "",
                  type: "links",
                  isHidden: false,
                  settings: {
                    link_type: "text",
                  },
                  content: [
                    {
                      id: v4(),
                      styles: {},
                      className:
                        "no-underline tracking-[0.025em] text-[12px] font-normal",
                      name: "",
                      type: "layout_item",
                      isHidden: false,
                      settings: {},
                      content: {
                        href: "#",
                        innerText: "terms and conditions",
                      },
                    },
                    {
                      id: v4(),
                      styles: {},
                      className:
                        "no-underline tracking-[0.025em] text-[12px] font-normal",
                      name: "",
                      type: "layout_item",
                      isHidden: false,
                      settings: {},
                      content: {
                        href: "#",
                        innerText: "Privacy policy",
                      },
                    },
                  ],
                },

                {
                  id: v4(),
                  styles: {},
                  className: "text-[12px] block text-center",
                  name: "",
                  type: "text",
                  isHidden: false,
                  settings: {},
                  content: {
                    innerText: `<p>© 2024 Your company, inc All rights reserved</p>`,
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  },
];
