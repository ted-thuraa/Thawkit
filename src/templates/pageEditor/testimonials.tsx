import { ElementNode, SectionTemplates } from "@/stores/pageEditorStore/types";

import { v4 } from "uuid";

export const TestimonialTemplates: SectionTemplates[] = [
  {
    id: v4(),
    name: "",
    preview: "",
    properties: {},
    templateContent: {
      id: v4(),
      styles: {},
      className: "",
      name: "Testimonial 1",
      type: "section",
      sectionType: "testimonial",
      preview: "",
      isHidden: false,
      settings: {
        //section_layout: "columns",
        section_full_bleed: false,
      },
      content: [
        {
          id: v4(),
          styles: {},
          className: "w-full flex flex-col",
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
                gap: "96px",
              },
              className: "items-center",
              name: "",
              type: "rows",
              isHidden: false,
              settings: {},
              content: [
                {
                  id: v4(),
                  styles: {
                    gap: "20px",
                    maxWidth: "560px",
                  },
                  className:
                    "w-full flex flex-col items-center justify-center sm:items-start",
                  name: "",
                  type: "div_block",
                  isHidden: false,
                  content: [
                    {
                      id: v4(),
                      styles: {},
                      className:
                        "w-full text-[16px] text-center font-medium block",
                      name: "",
                      type: "text",
                      isHidden: false,
                      content: {
                        innerText: "<p>Create without boundaries.</p>",
                      },
                    },
                    {
                      id: v4(),
                      styles: {},
                      className:
                        "font-bold  leading-[1.1] text-[36px] md:text-[48px] tracking-[-0.05em]  text-left sm:text-center",

                      name: "",
                      type: "text",
                      isHidden: false,
                      content: {
                        innerText:
                          "<h2>Build professional websites easy, fast, and affordable</h2>",
                      },
                    },
                    {
                      id: v4(),
                      styles: {},
                      className: "text-[20px] text-left sm:text-center",
                      name: "",
                      type: "text",
                      isHidden: false,
                      content: {
                        innerText:
                          "<p>Visually build and design beautiful, responsive web projects without compromising your vision.</p>",
                      },
                    },
                  ],
                },
                {
                  id: v4(),
                  styles: {},
                  className: "",
                  name: "",
                  type: "testimonial_Layout",
                  isHidden: false,
                  settings: {
                    grid_columns: 3,
                    smart_layout_type: "testimonial",
                  },
                  content: [
                    {
                      id: v4(),
                      styles: {},
                      className: "",
                      name: "",
                      type: "testimonial_item",
                      isHidden: false,
                      settings: {
                        categoryId: "",
                        contentIsDynamic: false,
                        testimonalType: "tweet_testimonial",
                      },
                      content: {
                        href: "https://x.com/levelsio/status/1958625540963017033",
                      },
                    },
                    {
                      id: v4(),
                      styles: {},
                      className: "",
                      name: "",
                      type: "testimonial_item",
                      isHidden: false,
                      settings: {
                        categoryId: "",
                        contentIsDynamic: false,
                        testimonalType: "tweet_testimonial",
                      },
                      content: {
                        href: "https://x.com/levelsio/status/1958625540963017033",
                      },
                    },
                    {
                      id: v4(),
                      styles: {},
                      className: "",
                      name: "",
                      type: "testimonial_item",
                      isHidden: false,
                      settings: {
                        categoryId: "",
                        contentIsDynamic: false,
                        testimonalType: "tweet_testimonial",
                      },
                      content: {
                        href: "https://x.com/levelsio/status/1958625540963017033",
                      },
                    },
                    {
                      id: v4(),
                      styles: {},
                      className: "",
                      name: "",
                      type: "testimonial_item",
                      isHidden: false,
                      settings: {
                        categoryId: "",
                        contentIsDynamic: false,
                        testimonalType: "normal_testimonial",
                      },
                      content: [
                        {
                          id: v4(),
                          styles: {},
                          className:
                            "text-left font-semibold text-sm truncate ",
                          name: "",
                          type: "testimonial_Title",
                          settings: {
                            contentIsDynamic: false,
                          },
                          content: {
                            innerText: `
                              <h3>Peter Cooper</h3>
                              `,
                            metaDynamic: [],
                          },
                        },
                        {
                          id: v4(),
                          styles: {},
                          className: "text-sm leading-relaxed  break-words ",
                          name: "",
                          type: "testimonial_Content",
                          settings: {
                            contentIsDynamic: false,
                          },
                          content: {
                            innerText: `
                              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula.</p>
                              `,
                            metaDynamic: [],
                          },
                        },
                        {
                          id: v4(),
                          styles: {},
                          className: "text-xs",
                          name: "",
                          type: "testimonial_Occupation",
                          settings: {
                            contentIsDynamic: false,
                          },
                          content: {
                            innerText: `
                              <p>Digital Marketing Specialist</p>
                              `,
                            metaDynamic: [],
                          },
                        },
                        {
                          id: v4(),
                          styles: {},
                          className: "h-12 w-12",
                          name: "",
                          type: "image",
                          settings: {
                            contentIsDynamic: false,
                          },
                          content: {
                            src: "/assets/roundArchitecture.jpg",
                            width: 500,
                            height: 500,
                          },
                        },
                      ],
                    },
                    {
                      id: v4(),
                      styles: {},
                      className: "",
                      name: "",
                      type: "testimonial_item",
                      isHidden: false,
                      settings: {
                        categoryId: "",
                        contentIsDynamic: false,
                        testimonalType: "normal_testimonial",
                      },
                      content: [
                        {
                          id: v4(),
                          styles: {},
                          className:
                            "text-left font-semibold text-sm truncate ",
                          name: "",
                          type: "testimonial_Title",
                          settings: {
                            contentIsDynamic: false,
                          },
                          content: {
                            innerText: `
                              <h3>Peter Cooper</h3>
                              `,
                            metaDynamic: [],
                          },
                        },
                        {
                          id: v4(),
                          styles: {},
                          className: "text-sm leading-relaxed  break-words ",
                          name: "",
                          type: "testimonial_Content",
                          settings: {
                            contentIsDynamic: false,
                          },
                          content: {
                            innerText: `
                              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula.</p>
                              `,
                            metaDynamic: [],
                          },
                        },
                        {
                          id: v4(),
                          styles: {},
                          className: "text-xs",
                          name: "",
                          type: "testimonial_Occupation",
                          settings: {
                            contentIsDynamic: false,
                          },
                          content: {
                            innerText: `
                              <p>Digital Marketing Specialist</p>
                              `,
                            metaDynamic: [],
                          },
                        },
                        {
                          id: v4(),
                          styles: {},
                          className: "h-12 w-12",
                          name: "",
                          type: "image",
                          settings: {
                            contentIsDynamic: false,
                          },
                          content: {
                            src: "/assets/roundArchitecture.jpg",
                            width: 500,
                            height: 500,
                          },
                        },
                      ],
                    },
                    {
                      id: v4(),
                      styles: {},
                      className: "",
                      name: "",
                      type: "testimonial_item",
                      isHidden: false,
                      settings: {
                        categoryId: "",
                        contentIsDynamic: false,
                        testimonalType: "normal_testimonial",
                      },
                      content: [
                        {
                          id: v4(),
                          styles: {},
                          className:
                            "text-left font-semibold text-sm truncate ",
                          name: "",
                          type: "testimonial_Title",
                          settings: {
                            contentIsDynamic: false,
                          },
                          content: {
                            innerText: `
                              <h3>Peter Cooper</h3>
                              `,
                            metaDynamic: [],
                          },
                        },
                        {
                          id: v4(),
                          styles: {},
                          className: "text-sm leading-relaxed  break-words ",
                          name: "",
                          type: "testimonial_Content",
                          settings: {
                            contentIsDynamic: false,
                          },
                          content: {
                            innerText: `
                              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula.</p>
                              `,
                            metaDynamic: [],
                          },
                        },
                        {
                          id: v4(),
                          styles: {},
                          className: "text-xs",
                          name: "",
                          type: "testimonial_Occupation",
                          settings: {
                            contentIsDynamic: false,
                          },
                          content: {
                            innerText: `
                              <p>Digital Marketing Specialist</p>
                              `,
                            metaDynamic: [],
                          },
                        },
                        {
                          id: v4(),
                          styles: {},
                          className: "h-12 w-12",
                          name: "",
                          type: "image",
                          settings: {
                            contentIsDynamic: false,
                          },
                          content: {
                            src: "/assets/roundArchitecture.jpg",
                            width: 500,
                            height: 500,
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
    name: "",
    preview: "",
    properties: {},
    templateContent: {
      id: v4(),
      styles: {},
      className: "",
      name: "testimonial 2",
      type: "section",
      sectionType: "testimonial",
      preview: "",
      isHidden: false,
      settings: {
        //section_layout: "columns",
        section_full_bleed: false,
      },
      content: [
        {
          id: v4(),
          styles: {},
          className: "w-full  flex flex-col",
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
                gap: "56px",
              },
              className: "items-center",
              name: "",
              type: "rows",
              isHidden: false,
              settings: {
                //column_reverse_order: false,
              },
              content: [
                {
                  id: v4(),
                  styles: {
                    gap: "",
                  },
                  className: "flex flex-col",
                  name: "",
                  type: "div_block",
                  isHidden: false,
                  content: [
                    {
                      id: v4(),
                      styles: {
                        maxWidth: "100%",
                        width: "96px",
                        height: "96px",
                        objectFit: "cover",
                        borderRadius: "9999px",
                        minHeight: "440px",
                      },
                      className: " ",
                      name: "",
                      type: "image",
                      isHidden: false,
                      settings: {
                        //media_sub_category: "normal_image",
                        mediaResizeMaxWidth: 100,
                        mediaResizeMaxHeight: 100,
                      },
                      content: {
                        src: "/assets/roundArchitecture.jpg",
                        innerText: " GET YOUR FREE ANALYSIS",
                        width: 500,
                        height: 500,
                      },
                    },
                  ],
                },
                {
                  id: v4(),
                  styles: {
                    gap: "20px",
                    maxWidth: "768px",
                  },
                  className:
                    "flex flex-col items-center justify-center sm:items-stretch gap-[20px]",
                  name: "",
                  type: "div_block",
                  isHidden: false,
                  content: [
                    {
                      id: v4(),
                      styles: {},
                      className:
                        "text-[24px] text-center font-semibold tracking-[-0.025em] leading-[1.625em]",
                      name: "",
                      type: "text",
                      isHidden: false,
                      content: {
                        innerText:
                          "<p>Visually build and design beautiful, responsive web projects without compromising your vision.</p>",
                      },
                    },
                  ],
                },
                {
                  id: v4(),
                  styles: {
                    gap: "4px",
                  },
                  className: "flex flex-col items-start",
                  name: "",
                  type: "div_block",
                  isHidden: false,
                  content: [
                    {
                      id: v4(),
                      styles: {},
                      className: "font-semibold text-[16px] ",
                      name: "",
                      type: "text",
                      isHidden: false,
                      content: {
                        innerText: "<h3>Emily cater</h3>",
                      },
                    },
                    {
                      id: v4(),
                      styles: {},
                      className: "text-[16px] ",
                      name: "",
                      type: "text",
                      isHidden: false,
                      content: {
                        innerText: "<p>Freelance App designer</p>",
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
      className: "",
      name: "testimonial 3",
      type: "section",
      sectionType: "testimonial",
      preview: "",
      isHidden: false,
      settings: {
        //section_layout: "columns",
        section_full_bleed: false,
      },
      content: [
        {
          id: v4(),
          styles: {},
          className: "w-full  flex flex-col",
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
              styles: {},
              className: "flex flex-col md:flex-row  gap-[72px] md:gap-[56px]",
              name: "",
              type: "div_block",
              isHidden: false,
              settings: {
                //column_reverse_order: false,
              },
              content: [
                {
                  id: v4(),
                  styles: {
                    gap: "",
                  },
                  className:
                    "w-full  max-w-[200px] md:max-w-[400px] min-h-[200px] md:min-h-[400px]",
                  name: "",
                  type: "div_block",
                  isHidden: false,
                  content: [
                    {
                      id: v4(),
                      styles: {
                        maxWidth: "100%",
                        width: "400px",
                        height: "400px",
                        objectFit: "cover",
                        borderRadius: "24px",
                        minHeight: "400px",
                      },
                      className: " ",
                      name: "",
                      type: "image",
                      isHidden: false,
                      settings: {
                        //media_sub_category: "normal_image",
                        mediaResizeMaxWidth: 400,
                        mediaResizeMaxHeight: 400,
                      },
                      content: {
                        src: "/assets/roundArchitecture.jpg",
                        innerText: " GET YOUR FREE ANALYSIS",
                        width: 500,
                        height: 500,
                      },
                    },
                  ],
                },

                {
                  id: v4(),
                  styles: {
                    gap: "40px",
                  },
                  className: "items-start justify-center",
                  name: "",
                  type: "rows",
                  isHidden: false,
                  settings: {
                    //column_reverse_order: false,
                  },
                  content: [
                    {
                      id: v4(),
                      styles: {
                        gap: "20px",
                        maxWidth: "640px",
                      },
                      className: "",
                      name: "",
                      type: "div_block",
                      isHidden: false,
                      content: [
                        {
                          id: v4(),
                          styles: {},
                          className:
                            "text-[18px]  text-left leading-[1.625em] md:text-[20px]",
                          name: "",
                          type: "text",
                          isHidden: false,
                          content: {
                            innerText:
                              "<p>Visually build and design beautiful, responsive web projects without compromising your vision.</p>",
                          },
                        },
                      ],
                    },
                    {
                      id: v4(),
                      styles: {
                        gap: "4px",
                      },
                      className: "flex flex-col items-start",
                      name: "",
                      type: "div_block",
                      isHidden: false,
                      content: [
                        {
                          id: v4(),
                          styles: {},
                          className: "font-semibold text-[16px] ",
                          name: "",
                          type: "text",
                          isHidden: false,
                          content: {
                            innerText: "<h3>Emily cater</h3>",
                          },
                        },
                        {
                          id: v4(),
                          styles: {},
                          className: "text-[16px] ",
                          name: "",
                          type: "text",
                          isHidden: false,
                          content: {
                            innerText: "<p>Freelance App designer</p>",
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
