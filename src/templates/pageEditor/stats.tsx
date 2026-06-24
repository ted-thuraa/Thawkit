import { ElementNode, SectionTemplates } from "@/stores/pageEditorStore/types";
import { nanoid } from "nanoid";
import { v4 } from "uuid";

const genId = (): string => nanoid(8);

export const StatsSectionTemplates: SectionTemplates[] = [
  {
    id: v4(),
    name: "",
    preview: "",
    properties: {},
    templateContent: {
      id: v4(),
      styles: {
        // minHeight: "85vh",
      },
      className: "py-24 px-6  md:px-8 ",
      name: "stats 1",
      type: "section",
      sectionType: "stats",
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
          id: v4(),
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
              id: v4(),
              styles: {
                gap: "72px",
              },
              className: "",
              name: "",
              type: "rows",
              isHidden: false,
              content: [
                {
                  id: v4(),
                  styles: {},
                  className: "",
                  name: "",
                  type: "columns",
                  isHidden: false,
                  content: [
                    {
                      id: v4(),
                      styles: {
                        maxWidth: "560px",
                      },
                      className: " block",
                      name: "",
                      type: "div_block",
                      isHidden: false,
                      content: [
                        {
                          id: v4(),
                          styles: {},
                          className:
                            " font-bold text-[36px] leading-[1.1] md:text-[48px] tracking-[-0.05em] text-left",
                          name: "",
                          type: "text",
                          isHidden: false,
                          content: {
                            innerText:
                              "<h1>A trusted choice for busineses globally</h1>",
                          },
                        },
                      ],
                    },
                    {
                      id: v4(),
                      styles: {
                        gap: "20px",
                      },
                      className: "block",
                      name: "",
                      type: "div_block",
                      isHidden: false,
                      content: [
                        {
                          id: v4(),
                          styles: {},
                          className: "text-[20px]  text-left",
                          name: "",
                          type: "text",
                          isHidden: false,
                          content: {
                            innerText:
                              "<p>Delivering powerful tools and secure solutions, making it easy for creators to bring their ideas to life effortlessly.</p>",
                          },
                        },
                      ],
                    },
                  ],
                },
                {
                  id: v4(),
                  styles: {},
                  className: "",
                  name: "",
                  type: "smart_layout",
                  isHidden: false,
                  settings: {
                    grid_columns: 4,
                    smart_layout_type: "stats_with_text",
                  },
                  content: [
                    {
                      id: v4(),
                      styles: {},
                      className: "",
                      name: "",
                      type: "layout_item",
                      isHidden: false,
                      settings: {
                        categoryId: "",
                        contentIsDynamic: false,
                      },
                      content: [
                        {
                          id: v4(),
                          styles: {},
                          className: "text-base font-semibold",
                          name: "",
                          type: "text",
                          settings: {
                            contentIsDynamic: false,
                          },
                          content: {
                            innerText: `<p>200+</p>`,
                            title: `<p>Websites launched</p>`,
                            description: `<p>We've empowered creators to launch over 200 stunning websites.</p>`,
                          },
                        },
                      ],
                    },
                    {
                      id: v4(),
                      styles: {},
                      className: "",
                      name: "",
                      type: "layout_item",
                      isHidden: false,
                      settings: {
                        categoryId: "",
                        contentIsDynamic: false,
                      },
                      content: [
                        {
                          id: v4(),
                          styles: {},
                          className: "text-base font-semibold",
                          name: "",
                          type: "text",
                          settings: {
                            contentIsDynamic: false,
                          },
                          content: {
                            innerText: "<p>95%</p>",
                            title: "<p>Customer satisfaction</p>",
                            description:
                              "<p>Our users love us, with a 95% satisfaction rate across the board.</p>",
                          },
                        },
                      ],
                    },
                    {
                      id: v4(),
                      styles: {},
                      className: "",
                      name: "",
                      type: "layout_item",
                      isHidden: false,
                      settings: {
                        categoryId: "",
                        contentIsDynamic: false,
                      },
                      content: [
                        {
                          id: v4(),
                          styles: {},
                          className: "text-base font-semibold",
                          name: "",
                          type: "text",
                          settings: {
                            contentIsDynamic: false,
                          },
                          content: {
                            innerText: "<p>50+</p>",
                            title: "<p>Templates available</p>",
                            description:
                              "<p>Choose from over 50 professional templates to kickstart your website.</p>",
                          },
                        },
                      ],
                    },
                    {
                      id: v4(),
                      styles: {},
                      className: "",
                      name: "",
                      type: "layout_item",
                      isHidden: false,
                      settings: {
                        categoryId: "",
                        contentIsDynamic: false,
                      },
                      content: [
                        {
                          id: v4(),
                          styles: {},
                          className: "text-base font-semibold",
                          name: "",
                          type: "text",
                          settings: {
                            contentIsDynamic: false,
                          },
                          content: {
                            innerText: "<p>1M+</p>",
                            title: "<p>Page views generated</p>",
                            description:
                              "<p>Our websites have collectively garnered over 1 million page views.</p>",
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
      className: "",
      name: "Stats 2",
      type: "section",
      sectionType: "Stats",
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
            column_reverse_order: true,
          },
          content: [
            {
              id: v4(),
              styles: {},
              className: "",
              name: "",
              type: "smart_layout",
              isHidden: false,
              settings: {
                grid_columns: 1,
                smart_layout_type: "stats_with_text",
              },
              content: [
                {
                  id: v4(),
                  styles: {},
                  className: "",
                  name: "",
                  type: "layout_item",
                  isHidden: false,
                  settings: {
                    categoryId: "",
                    contentIsDynamic: false,
                  },
                  content: [
                    {
                      id: v4(),
                      styles: {},
                      className: "text-base font-semibold",
                      name: "",
                      type: "text",
                      settings: {
                        contentIsDynamic: false,
                      },
                      content: {
                        innerText: `<p>200+</p>`,
                        title: `<p>Websites launched</p>`,
                        description: `<p>We've empowered creators to launch over 200 stunning websites.</p>`,
                      },
                    },
                  ],
                },
                {
                  id: v4(),
                  styles: {},
                  className: "",
                  name: "",
                  type: "layout_item",
                  isHidden: false,
                  settings: {
                    categoryId: "",
                    contentIsDynamic: false,
                  },
                  content: [
                    {
                      id: v4(),
                      styles: {},
                      className: "text-base font-semibold",
                      name: "",
                      type: "text",
                      settings: {
                        contentIsDynamic: false,
                      },
                      content: {
                        innerText: "<p>95%</p>",
                        title: "<p>Customer satisfaction</p>",
                        description:
                          "<p>Our users love us, with a 95% satisfaction rate across the board.</p>",
                      },
                    },
                  ],
                },
                {
                  id: v4(),
                  styles: {},
                  className: "",
                  name: "",
                  type: "layout_item",
                  isHidden: false,
                  settings: {
                    categoryId: "",
                    contentIsDynamic: false,
                  },
                  content: [
                    {
                      id: v4(),
                      styles: {},
                      className: "text-base font-semibold",
                      name: "",
                      type: "text",
                      settings: {
                        contentIsDynamic: false,
                      },
                      content: {
                        innerText: "<p>1M+</p>",
                        title: "<p>Page views generated</p>",
                        description:
                          "<p>Our websites have collectively garnered over 1 million page views.</p>",
                      },
                    },
                  ],
                },
              ],
            },
            {
              id: `div-${nanoid(8)}`,
              styles: {},
              className: "relative h-[480px] w-full",
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
        // minHeight: "85vh",
      },
      className: "",
      name: "Stats 3",
      type: "section",
      sectionType: "Stats",
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
          id: v4(),
          styles: {},
          className:
            "flex flex-col lg:flex-row justify-between items-start gap-6 lg:gap-12 mb-8",
          name: "",
          type: "div_block",
          settings: {
            contentIsDynamic: false,
          },
          content: [
            {
              id: v4(),
              styles: {},
              className:
                "text-3xl md:text-4xl lg:text-[2.75rem] leading-[1.2] font-medium tracking-tight max-w-3xl",
              name: "",
              type: "text",
              settings: {
                contentIsDynamic: false,
              },
              content: {
                innerText: `<h1 className= "text-3xl md:text-4xl lg:text-[2.75rem] leading-[1.2] font-medium tracking-tight max-w-3xl">We are passionate about empowering individuals and businesses to
              take control of their finances and achieve their financial goals.</h1>`,
              },
            },
          ],
        },
        {
          id: v4(),
          styles: {},
          className: "max-w-2xl text-base md:text-lg leading-relaxed mb-16",
          name: "",
          type: "text",
          settings: {
            contentIsDynamic: false,
          },
          content: {
            innerText: `<p className= "max-w-2xl text-base md:text-lg leading-relaxed">We are dedicated to revolutionizing the way individuals and
            businesses manage their finances. Our team is committed to providing
            intuitive and innovative solutions that empower our users to achieve
            financial success.</p>`,
          },
        },
        {
          id: v4(),
          styles: {},
          className: "",
          name: "",
          type: "smart_layout",
          isHidden: false,
          settings: {
            grid_columns: 3,
            smart_layout_type: "stats_with_text",
          },
          content: [
            {
              id: v4(),
              styles: {},
              className: "",
              name: "",
              type: "layout_item",
              isHidden: false,
              settings: {
                categoryId: "",
                contentIsDynamic: false,
              },
              content: [
                {
                  id: v4(),
                  styles: {},
                  className: "text-base font-semibold",
                  name: "",
                  type: "text",
                  settings: {
                    contentIsDynamic: false,
                  },
                  content: {
                    innerText: `<p className= "text-4xl md:text-5xl font-normal tracking-tight">200+</p>`,
                    title: `<p>Websites launched</p>`,
                    description: `<p>We've empowered creators to launch over 200 stunning websites.</p>`,
                  },
                },
              ],
            },
            {
              id: v4(),
              styles: {},
              className: "",
              name: "",
              type: "layout_item",
              isHidden: false,
              settings: {
                categoryId: "",
                contentIsDynamic: false,
              },
              content: [
                {
                  id: v4(),
                  styles: {},
                  className: "text-base font-semibold",
                  name: "",
                  type: "text",
                  settings: {
                    contentIsDynamic: false,
                  },
                  content: {
                    innerText: `<p className= "text-4xl md:text-5xl font-normal tracking-tight">95%</p>`,
                    title: "<p>Customer satisfaction</p>",
                    description:
                      "<p>Our users love us, with a 95% satisfaction rate across the board.</p>",
                  },
                },
              ],
            },
            {
              id: v4(),
              styles: {},
              className: "",
              name: "",
              type: "layout_item",
              isHidden: false,
              settings: {
                categoryId: "",
                contentIsDynamic: false,
              },
              content: [
                {
                  id: v4(),
                  styles: {},
                  className: "text-base font-semibold",
                  name: "",
                  type: "text",
                  settings: {
                    contentIsDynamic: false,
                  },
                  content: {
                    innerText: `<p className= "text-4xl md:text-5xl font-normal tracking-tight">1M+</p>`,
                    title: "<p>Page views generated</p>",
                    description:
                      "<p>Our websites have collectively garnered over 1 million page views.</p>",
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
