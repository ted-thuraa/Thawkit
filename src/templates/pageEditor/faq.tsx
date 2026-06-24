import { SectionTemplates } from "@/stores/pageEditorStore/types";
import { v4 } from "uuid";
import { nanoid } from "nanoid";

const genId = (): string => nanoid(8);

export const FaqTemplates: SectionTemplates[] = [
  {
    id: v4(),
    name: "",
    preview: "",
    properties: {},
    templateContent: {
      id: v4(),
      styles: {
        backgroundColor: "",
        // minHeight: "100vh",
        paddingTop: "60px",
        paddingBottom: "60px",
      },
      className: " relative ",
      name: "Faq 1",
      type: "section",
      sectionType: "Faq",
      preview: "",
      isHidden: false,
      settings: {
        //section_layout: "columns",
        section_full_bleed: false,
        backgroundType: "color",
        backgroundSource: "upload",
      },
      content: [
        {
          id: v4(),
          styles: {
            paddingTop: "0px",
            paddingBottom: "0px",
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
              styles: {},
              className: "",
              name: "",
              type: "columns",
              isHidden: false,
              content: [
                {
                  id: v4(),
                  styles: {
                    maxWidth: "400px",
                  },
                  className:
                    "w-full flex flex-col items-start justify-center sm:items-stretch gap-[20px] lg:max-w-full",
                  name: "",
                  type: "div_block",
                  isHidden: false,
                  content: [
                    {
                      id: v4(),
                      styles: {},
                      className:
                        " font-bold text-[48px] md:text-[36px] leading-[1.1] sm:text-[36px] tracking-[-0.05em]  md:text-[48px]",
                      name: "",
                      type: "text",
                      isHidden: false,
                      content: {
                        innerText: "<h2>FAQ</h2>",
                      },
                    },
                    {
                      id: v4(),
                      styles: {},
                      className: " text-[20px]",
                      name: "",
                      type: "text",
                      isHidden: false,
                      content: {
                        innerText:
                          "<p>Discover helpful answers to the questions we hear most often.</p>",
                      },
                    },
                  ],
                },
                {
                  id: v4(),
                  styles: {
                    gap: "20px",
                  },
                  className: "flex flex-col  flex-1",
                  name: "",
                  type: "div_block",
                  isHidden: false,
                  content: [
                    {
                      id: v4(),
                      styles: {},
                      className: "",
                      name: "",
                      type: "faq",
                      isHidden: false,
                      content: [
                        {
                          id: v4(),
                          styles: {},
                          className: "",
                          name: "",
                          type: "faq_item",
                          isHidden: false,
                          settings: {},
                          content: [
                            {
                              id: v4(),
                              styles: {},
                              className: "text-left text-base font-semibold",
                              name: "",
                              type: "faq_Item_Title",
                              settings: {
                                contentIsDynamic: false,
                              },
                              content: {
                                innerText: `
                                      <h3>Question Title here</h3>
                                      `,
                                metaDynamic: [],
                              },
                            },
                            {
                              id: v4(),
                              styles: {},
                              className: "text-base/7 text-left",
                              name: "",
                              type: "faq_Item_Content",
                              settings: {
                                contentIsDynamic: false,
                              },
                              content: {
                                innerText: `
                                      
                                      <p>You can type answer here</p>
                                      `,
                                metaDynamic: [],
                              },
                            },
                          ],
                        },
                        {
                          id: v4(),
                          styles: {},
                          className: "",
                          name: "",
                          type: "faq_item",
                          isHidden: false,
                          settings: {},
                          content: [
                            {
                              id: v4(),
                              styles: {},
                              className: "text-left text-base font-semibold",
                              name: "",
                              type: "faq_Item_Title",
                              settings: {
                                contentIsDynamic: false,
                              },
                              content: {
                                innerText: `
                                      <h3>Question Title here</h3>
                                      `,
                                metaDynamic: [],
                              },
                            },
                            {
                              id: v4(),
                              styles: {},
                              className: "text-base/7 text-left",
                              name: "",
                              type: "faq_Item_Content",
                              settings: {
                                contentIsDynamic: false,
                              },
                              content: {
                                innerText: `
                                      
                                      <p>You can type answer here</p>
                                      `,
                                metaDynamic: [],
                              },
                            },
                          ],
                        },
                        {
                          id: v4(),
                          styles: {},
                          className: "",
                          name: "",
                          type: "faq_item",
                          isHidden: false,
                          settings: {},
                          content: [
                            {
                              id: v4(),
                              styles: {},
                              className: "text-left text-base font-semibold",
                              name: "",
                              type: "faq_Item_Title",
                              settings: {
                                contentIsDynamic: false,
                              },
                              content: {
                                innerText: `
                                      <h3>Question Title here</h3>
                                      `,
                                metaDynamic: [],
                              },
                            },
                            {
                              id: v4(),
                              styles: {},
                              className: "text-base/7 text-left",
                              name: "",
                              type: "faq_Item_Content",
                              settings: {
                                contentIsDynamic: false,
                              },
                              content: {
                                innerText: `
                                      
                                      <p>You can type answer here</p>
                                      `,
                                metaDynamic: [],
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
      className: "",
      name: "faq 2",
      type: "section",
      sectionType: "faq",
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
                        innerText: "<h2>Frequently asked questions</h2>",
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
                          "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula.</p>",
                      },
                    },
                  ],
                },
                {
                  id: v4(),
                  styles: {
                    gap: "20px",
                  },
                  className:
                    "w-full flex flex-row items-center justify-center  flex-1",
                  name: "",
                  type: "div_block",
                  isHidden: false,
                  content: [
                    {
                      id: v4(),
                      styles: {},
                      className: "",
                      name: "",
                      type: "faq",
                      isHidden: false,
                      content: [
                        {
                          id: v4(),
                          styles: {},
                          className: "",
                          name: "",
                          type: "faq_item",
                          isHidden: false,
                          settings: {},
                          content: [
                            {
                              id: v4(),
                              styles: {},
                              className: "text-left text-base font-semibold",
                              name: "",
                              type: "faq_Item_Title",
                              settings: {
                                contentIsDynamic: false,
                              },
                              content: {
                                innerText: `
                                      <h3>Question Title here</h3>
                                      `,
                                metaDynamic: [],
                              },
                            },
                            {
                              id: v4(),
                              styles: {},
                              className: "text-base/7 text-left",
                              name: "",
                              type: "faq_Item_Content",
                              settings: {
                                contentIsDynamic: false,
                              },
                              content: {
                                innerText: `
                                      
                                      <p>You can type answer here</p>
                                      `,
                                metaDynamic: [],
                              },
                            },
                          ],
                        },
                        {
                          id: v4(),
                          styles: {},
                          className: "",
                          name: "",
                          type: "faq_item",
                          isHidden: false,
                          settings: {},
                          content: [
                            {
                              id: v4(),
                              styles: {},
                              className: "text-left text-base font-semibold",
                              name: "",
                              type: "faq_Item_Title",
                              settings: {
                                contentIsDynamic: false,
                              },
                              content: {
                                innerText: `
                                      <h3>Question Title here</h3>
                                      `,
                                metaDynamic: [],
                              },
                            },
                            {
                              id: v4(),
                              styles: {},
                              className: "text-base/7 text-left",
                              name: "",
                              type: "faq_Item_Content",
                              settings: {
                                contentIsDynamic: false,
                              },
                              content: {
                                innerText: `
                                      
                                      <p>You can type answer here</p>
                                      `,
                                metaDynamic: [],
                              },
                            },
                          ],
                        },
                        {
                          id: v4(),
                          styles: {},
                          className: "",
                          name: "",
                          type: "faq_item",
                          isHidden: false,
                          settings: {},
                          content: [
                            {
                              id: v4(),
                              styles: {},
                              className: "text-left text-base font-semibold",
                              name: "",
                              type: "faq_Item_Title",
                              settings: {
                                contentIsDynamic: false,
                              },
                              content: {
                                innerText: `
                                      <h3>Question Title here</h3>
                                      `,
                                metaDynamic: [],
                              },
                            },
                            {
                              id: v4(),
                              styles: {},
                              className: "text-base/7 text-left",
                              name: "",
                              type: "faq_Item_Content",
                              settings: {
                                contentIsDynamic: false,
                              },
                              content: {
                                innerText: `
                                      
                                      <p>You can type answer here</p>
                                      `,
                                metaDynamic: [],
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
      className: "",
      name: "faq 3",
      type: "section",
      sectionType: "faq",
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
              id: v4(),
              styles: {},
              className: "max-w-3xl w-full flex flex-col items-center",
              name: "",
              type: "div_block",
              isHidden: false,
              settings: {},
              content: [
                {
                  id: v4(),
                  styles: {},
                  className: "w-full text-center  mx-auto mb-16",
                  name: "",
                  type: "div_block",
                  isHidden: false,
                  content: [
                    {
                      id: v4(),
                      styles: {},
                      className: " text-sm text-center font-medium block",
                      name: "",
                      type: "text",
                      isHidden: false,
                      content: {
                        innerText: `<p className="text-sm text-center font-medium">FAQ.</p>`,
                      },
                    },
                    {
                      id: v4(),
                      styles: {},
                      className:
                        " text-4xl font-medium  mb-6  leading-[1.1]  md:text-5xl tracking-[-0.05em]  text-left sm:text-center",

                      name: "",
                      type: "text",
                      isHidden: false,
                      content: {
                        innerText: `<h2 className="text-3xl font-medium  mb-6   md:text-4xl   text-left sm:text-center">Some of the things you<br />may want to know</h2>`,
                      },
                    },
                    {
                      id: v4(),
                      styles: {},
                      className:
                        "text-sm md:text-base text-left sm:text-center leading-relaxed max-w-2xl mx-auto",
                      name: "",
                      type: "text",
                      isHidden: false,
                      content: {
                        innerText: `<p className="text-sm md:text-base text-left sm:text-center leading-relaxed ">We answered questions so you don&apos;t have to ask them.</p>`,
                      },
                    },
                  ],
                },
                {
                  id: v4(),
                  styles: {},
                  className: "w-full",
                  name: "",
                  type: "faq",
                  isHidden: false,
                  settings: {
                    grid_columns: 1,
                  },
                  content: [
                    {
                      id: v4(),
                      styles: {},
                      className: "border-none",
                      name: "",
                      type: "faq_item",
                      isHidden: false,
                      settings: {},
                      content: [
                        {
                          id: v4(),
                          styles: {},
                          className:
                            "text-left text-sm md:text-base font-medium",
                          name: "",
                          type: "faq_Item_Title",
                          settings: {
                            contentIsDynamic: false,
                          },
                          content: {
                            innerText: `
                                      <h3 className="text-left text-sm md:text-base font-medium">Question Title here</h3>
                                      `,
                            metaDynamic: [],
                          },
                        },
                        {
                          id: v4(),
                          styles: {},
                          className: "text-sm leading-relaxed",
                          name: "",
                          type: "faq_Item_Content",
                          settings: {
                            contentIsDynamic: false,
                          },
                          content: {
                            innerText: `
                                      <p className="text-sm leading-relaxed">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.</p>
                                      `,
                            metaDynamic: [],
                          },
                        },
                      ],
                    },
                    {
                      id: v4(),
                      styles: {},
                      className: "border-none",
                      name: "",
                      type: "faq_item",
                      isHidden: false,
                      settings: {},
                      content: [
                        {
                          id: v4(),
                          styles: {},
                          className:
                            "text-left text-sm md:text-base font-medium",
                          name: "",
                          type: "faq_Item_Title",
                          settings: {
                            contentIsDynamic: false,
                          },
                          content: {
                            innerText: `
                                      <h3 className="text-left text-sm md:text-base font-medium">Question Title here</h3>
                                      `,
                            metaDynamic: [],
                          },
                        },
                        {
                          id: v4(),
                          styles: {},
                          className: "text-sm leading-relaxed",
                          name: "",
                          type: "faq_Item_Content",
                          settings: {
                            contentIsDynamic: false,
                          },
                          content: {
                            innerText: `
                                      <p className="text-sm leading-relaxed">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.</p>
                                      `,
                            metaDynamic: [],
                          },
                        },
                      ],
                    },
                    {
                      id: v4(),
                      styles: {},
                      className: "border-none",
                      name: "",
                      type: "faq_item",
                      isHidden: false,
                      settings: {},
                      content: [
                        {
                          id: v4(),
                          styles: {},
                          className:
                            "text-left text-sm md:text-base font-medium",
                          name: "",
                          type: "faq_Item_Title",
                          settings: {
                            contentIsDynamic: false,
                          },
                          content: {
                            innerText: `
                                      <h3 className="text-left text-sm md:text-base font-medium">Question Title here</h3>
                                      `,
                            metaDynamic: [],
                          },
                        },
                        {
                          id: v4(),
                          styles: {},
                          className: "text-sm leading-relaxed",
                          name: "",
                          type: "faq_Item_Content",
                          settings: {
                            contentIsDynamic: false,
                          },
                          content: {
                            innerText: `
                                      <p className="text-sm leading-relaxed">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.</p>
                                      `,
                            metaDynamic: [],
                          },
                        },
                      ],
                    },
                    {
                      id: v4(),
                      styles: {},
                      className: "border-none",
                      name: "",
                      type: "faq_item",
                      isHidden: false,
                      settings: {},
                      content: [
                        {
                          id: v4(),
                          styles: {},
                          className:
                            "text-left text-sm md:text-base font-medium",
                          name: "",
                          type: "faq_Item_Title",
                          settings: {
                            contentIsDynamic: false,
                          },
                          content: {
                            innerText: `
                                      <h3 className="text-left text-sm md:text-base font-medium">Question Title here</h3>
                                      `,
                            metaDynamic: [],
                          },
                        },
                        {
                          id: v4(),
                          styles: {},
                          className: "text-sm leading-relaxed",
                          name: "",
                          type: "faq_Item_Content",
                          settings: {
                            contentIsDynamic: false,
                          },
                          content: {
                            innerText: `
                                      <p className="text-sm leading-relaxed">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.</p>
                                      `,
                            metaDynamic: [],
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
              className: "flex flex-col justify-start pt-4",
              name: "",
              type: "div_block",
              isHidden: false,
              settings: {},
              content: [
                {
                  id: `text-${nanoid(8)}`,
                  styles: {},
                  className:
                    "font-medium text-3xl md:text-4xl lg:text-5xl mb-6 leading-tight",
                  name: "",
                  type: "text",
                  isHidden: false,
                  content: {
                    innerText: `<h2 className="font-medium text-3xl md:text-4xl lg:text-5xl leading-tight">Any questions?<br />We got you.</h2>`,
                  },
                },
                {
                  id: `text-${nanoid(8)}`,
                  styles: {},
                  className:
                    "text-base md:text-lg mb-8 leading-relaxed max-w-md",
                  name: "",
                  type: "text",
                  isHidden: false,
                  content: {
                    innerText: `<p className="text-base md:text-lg leading-relaxed max-w-md">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec.</p>`,
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
                  className: "w-full",
                  name: "",
                  type: "faq",
                  isHidden: false,
                  settings: {
                    grid_columns: 1,
                  },
                  content: [
                    {
                      id: v4(),
                      styles: {},
                      className:
                        "w-full !border-b !border-gray-200 last:!border-none",
                      name: "",
                      type: "faq_item",
                      isHidden: false,
                      settings: {},
                      content: [
                        {
                          id: v4(),
                          styles: {},
                          className:
                            "text-left text-sm md:text-base font-semibold hover:no-underline",
                          name: "",
                          type: "faq_Item_Title",
                          settings: {
                            contentIsDynamic: false,
                          },
                          content: {
                            innerText: `
                                      <h3 className="text-left text-sm md:text-base font-semibold ">Question Title here</h3>
                                      `,
                            metaDynamic: [],
                          },
                        },
                        {
                          id: v4(),
                          styles: {},
                          className: "text-base leading-relaxed",
                          name: "",
                          type: "faq_Item_Content",
                          settings: {
                            contentIsDynamic: false,
                          },
                          content: {
                            innerText: `
                                      <p className="text-base leading-relaxed">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.</p>
                                      `,
                            metaDynamic: [],
                          },
                        },
                      ],
                    },
                    {
                      id: v4(),
                      styles: {},
                      className:
                        "w-full !border-b !border-gray-200 last:!border-none",
                      name: "",
                      type: "faq_item",
                      isHidden: false,
                      settings: {},
                      content: [
                        {
                          id: v4(),
                          styles: {},
                          className:
                            "text-left text-sm md:text-base font-semibold hover:no-underline",
                          name: "",
                          type: "faq_Item_Title",
                          settings: {
                            contentIsDynamic: false,
                          },
                          content: {
                            innerText: `
                                      <h3 className="text-left text-sm md:text-base font-semibold ">Question Title here</h3>
                                      `,
                            metaDynamic: [],
                          },
                        },
                        {
                          id: v4(),
                          styles: {},
                          className: "text-base leading-relaxed",
                          name: "",
                          type: "faq_Item_Content",
                          settings: {
                            contentIsDynamic: false,
                          },
                          content: {
                            innerText: `
                                      <p className="text-base leading-relaxed">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.</p>
                                      `,
                            metaDynamic: [],
                          },
                        },
                      ],
                    },
                    {
                      id: v4(),
                      styles: {},
                      className:
                        "w-full !border-b !border-gray-200 last:!border-none",
                      name: "",
                      type: "faq_item",
                      isHidden: false,
                      settings: {},
                      content: [
                        {
                          id: v4(),
                          styles: {},
                          className:
                            "text-left text-sm md:text-base font-semibold hover:no-underline",
                          name: "",
                          type: "faq_Item_Title",
                          settings: {
                            contentIsDynamic: false,
                          },
                          content: {
                            innerText: `
                                      <h3 className="text-left text-sm md:text-base font-semibold ">Question Title here</h3>
                                      `,
                            metaDynamic: [],
                          },
                        },
                        {
                          id: v4(),
                          styles: {},
                          className: "text-base leading-relaxed",
                          name: "",
                          type: "faq_Item_Content",
                          settings: {
                            contentIsDynamic: false,
                          },
                          content: {
                            innerText: `
                                      <p className="text-base leading-relaxed">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.</p>
                                      `,
                            metaDynamic: [],
                          },
                        },
                      ],
                    },
                    {
                      id: v4(),
                      styles: {},
                      className:
                        "w-full !border-b !border-gray-200 last:!border-none",
                      name: "",
                      type: "faq_item",
                      isHidden: false,
                      settings: {},
                      content: [
                        {
                          id: v4(),
                          styles: {},
                          className:
                            "text-left text-sm md:text-base font-semibold hover:no-underline",
                          name: "",
                          type: "faq_Item_Title",
                          settings: {
                            contentIsDynamic: false,
                          },
                          content: {
                            innerText: `
                                      <h3 className="text-left text-sm md:text-base font-semibold ">Question Title here</h3>
                                      `,
                            metaDynamic: [],
                          },
                        },
                        {
                          id: v4(),
                          styles: {},
                          className: "text-base leading-relaxed",
                          name: "",
                          type: "faq_Item_Content",
                          settings: {
                            contentIsDynamic: false,
                          },
                          content: {
                            innerText: `
                                      <p className="text-base leading-relaxed">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.</p>
                                      `,
                            metaDynamic: [],
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
