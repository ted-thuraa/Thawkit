import { ElementNode, SectionTemplates } from "@/stores/pageEditorStore/types";
import { v4 } from "uuid";
import { nanoid } from "nanoid";

const genId = (): string => nanoid(8);

export const FeaturesTemplates: SectionTemplates[] = [
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
      name: "features 1",
      type: "section",
      sectionType: "features",
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
              id: `div-${nanoid(8)}`,
              styles: {},
              className: "max-w-xl",
              name: "",
              type: "div_block",
              isHidden: false,
              settings: {},
              content: [
                {
                  id: v4(),
                  styles: {},
                  className:
                    "mb-6 text-3xl md:text-4xl font-medium leading-[1.1]  tracking-[-0.05em]",
                  name: "",
                  type: "text",
                  isHidden: false,
                  content: {
                    innerText: `<h2 className="mb-6 text-3xl md:text-4xl font-medium leading-[1.1]  tracking-[-0.05em]">Build professional websites easy, fast, and affordable</h2>`,
                  },
                },
                {
                  id: v4(),
                  styles: {},
                  className: "text-base leading-relaxed",
                  name: "",
                  type: "text",
                  isHidden: false,
                  content: {
                    innerText: `<p className="text-base leading-relaxed">Visually build and design beautiful, responsive web projects without compromising your vision.</p>`,
                  },
                },
              ],
            },
            {
              id: `div-${nanoid(8)}`,
              styles: {},
              className: "relative aspect-[4/3] w-full",
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
                  id: v4(),
                  styles: {},
                  className:
                    "mb-6 text-3xl md:text-4xl font-medium leading-[1.1]  tracking-[-0.05em]",
                  name: "",
                  type: "text",
                  isHidden: false,
                  content: {
                    innerText: `<h2 className="mb-6 text-3xl md:text-4xl font-medium leading-[1.1]  tracking-[-0.05em]">Build professional websites easy, fast, and affordable</h2>`,
                  },
                },
                {
                  id: v4(),
                  styles: {},
                  className: "text-base leading-relaxed",
                  name: "",
                  type: "text",
                  isHidden: false,
                  content: {
                    innerText: `<p className="text-base leading-relaxed">Visually build and design beautiful, responsive web projects without compromising your vision.</p>`,
                  },
                },
              ],
            },
            {
              id: `div-${nanoid(8)}`,
              styles: {},
              className: "relative aspect-[4/3] w-full",
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
    id: v4(),
    name: "",
    preview: "",
    properties: {},
    templateContent: {
      id: v4(),
      styles: {},
      className: "",
      name: "features 2",
      type: "section",
      sectionType: "features",
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
                    gap: "56px",
                  },
                  className: " ",
                  name: "",
                  type: "rows",
                  isHidden: false,
                  content: [
                    {
                      id: v4(),
                      styles: {
                        gap: "20px",
                      },
                      className: "flex flex-col ",
                      name: "",
                      type: "div_block",
                      isHidden: false,
                      content: [
                        {
                          id: v4(),
                          styles: {},
                          className: " text-[16px] font-medium block",
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
                            "font-bold text-[48px] leading-[1.1] md:text-[36px] tracking-[-0.05em]  ",
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
                          className: "text-[20px] ",
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
                      type: "smart_layout",
                      isHidden: false,
                      settings: {
                        grid_columns: 2,
                        smart_layout_type: "icon_with_text",
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
                              type: "layout_Item_Title",
                              settings: {
                                contentIsDynamic: false,
                              },
                              content: {
                                innerText: `
                                  <h3>Title here</h3>
                                  `,
                                metaDynamic: [],
                              },
                            },
                            {
                              id: v4(),
                              styles: {},
                              className: "text-base/7",
                              name: "",
                              type: "layout_Item_Content",
                              settings: {
                                contentIsDynamic: false,
                              },
                              content: {
                                // title: `<h3>${cat.title}</h3>`,
                                innerText: `
                                  
                                  <p>You can type something here</p>
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
                              type: "layout_Item_Title",
                              settings: {
                                contentIsDynamic: false,
                              },
                              content: {
                                innerText: `
                                  <h3>Title here</h3>
                                  `,
                                metaDynamic: [],
                              },
                            },
                            {
                              id: v4(),
                              styles: {},
                              className: "",
                              name: "",
                              type: "layout_Item_Content",
                              settings: {
                                contentIsDynamic: false,
                              },
                              content: {
                                // title: `<h3>${cat.title}</h3>`,
                                innerText: `
                                  
                                  <p>You can type something here</p>
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
                              type: "layout_Item_Title",
                              settings: {
                                contentIsDynamic: false,
                              },
                              content: {
                                innerText: `
                                  <h3>Title here</h3>
                                  `,
                                metaDynamic: [],
                              },
                            },
                            {
                              id: v4(),
                              styles: {},
                              className: "",
                              name: "",
                              type: "layout_Item_Content",
                              settings: {
                                contentIsDynamic: false,
                              },
                              content: {
                                // title: `<h3>${cat.title}</h3>`,
                                innerText: `
                                  
                                  <p>You can type something here</p>
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
                        width: "560px",
                        height: "640px",
                        objectFit: "cover",
                        borderRadius: "24px",
                        minHeight: "440px",
                      },
                      className: "w-[560px] h-[640px]",
                      name: "",
                      type: "image",
                      isHidden: false,
                      settings: {
                        mediaResizeMaxWidth: 600,
                        mediaResizeMaxHeight: 800,
                      },
                      content: {
                        src: "",
                        innerText: " GET YOUR FREE ANALYSIS",
                        width: 500,
                        height: 800,
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
      name: "features 3",
      type: "section",
      sectionType: "features",
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
              styles: {},
              className: "",
              name: "",
              type: "rows",
              isHidden: false,
              settings: {},
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
                      className: "max-w-xl flex flex-col",
                      name: "",
                      type: "div_block",
                      isHidden: false,
                      settings: {},
                      content: [
                        {
                          id: v4(),
                          styles: {},
                          className: " text-sm font-medium ",
                          name: "",
                          type: "text",
                          isHidden: false,
                          content: {
                            innerText: `<p className="text-sm font-medium ">Create without boundaries.</p>`,
                          },
                        },
                        {
                          id: v4(),
                          styles: {},
                          className:
                            "text-3xl md:text-4xl font-medium leading-[1.1]  tracking-[-0.05em]",
                          name: "",
                          type: "text",
                          isHidden: false,
                          content: {
                            innerText: `<h2 className="text-3xl md:text-4xl font-medium leading-[1.1]  tracking-[-0.05em]">Build professional websites easy, fast, and affordable</h2>`,
                          },
                        },
                        {
                          id: v4(),
                          styles: {},
                          className: "text-base leading-relaxed",
                          name: "",
                          type: "text",
                          isHidden: false,
                          content: {
                            innerText: `<p className="text-base leading-relaxed">Visually build and design beautiful, responsive web projects without compromising your vision.</p>`,
                          },
                        },
                      ],
                    },
                    {
                      id: `div-${nanoid(8)}`,
                      styles: {},
                      className: "relative aspect-[5/3] w-full",
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

                {
                  id: v4(),
                  styles: {},
                  className: "",
                  name: "",
                  type: "smart_layout",
                  isHidden: false,
                  settings: {
                    grid_columns: 3,
                    smart_layout_type: "icon_with_text",
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
                          type: "layout_Item_Title",
                          settings: {
                            contentIsDynamic: false,
                          },
                          content: {
                            innerText: `
                              <h3>Title here</h3>
                              `,
                            metaDynamic: [],
                          },
                        },
                        {
                          id: v4(),
                          styles: {},
                          className: "",
                          name: "",
                          type: "layout_Item_Content",
                          settings: {
                            contentIsDynamic: false,
                          },
                          content: {
                            // title: `<h3>${cat.title}</h3>`,
                            innerText: `
                              
                              <p>You can type something here</p>
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
                          type: "layout_Item_Title",
                          settings: {
                            contentIsDynamic: false,
                          },
                          content: {
                            innerText: `
                              <h3>Title here</h3>
                              `,
                            metaDynamic: [],
                          },
                        },
                        {
                          id: v4(),
                          styles: {},
                          className: "",
                          name: "",
                          type: "layout_Item_Content",
                          settings: {
                            contentIsDynamic: false,
                          },
                          content: {
                            // title: `<h3>${cat.title}</h3>`,
                            innerText: `
                              
                              <p>You can type something here</p>
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
                          type: "layout_Item_Title",
                          settings: {
                            contentIsDynamic: false,
                          },
                          content: {
                            innerText: `
                              <h3>Title here</h3>
                              `,
                            metaDynamic: [],
                          },
                        },
                        {
                          id: v4(),
                          styles: {},
                          className: "",
                          name: "",
                          type: "layout_Item_Content",
                          settings: {
                            contentIsDynamic: false,
                          },
                          content: {
                            // title: `<h3>${cat.title}</h3>`,
                            innerText: `
                              
                              <p>You can type something here</p>
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
    id: v4(),
    name: "",
    preview: "",
    properties: {},
    templateContent: {
      id: v4(),
      styles: {},
      className: "",
      name: "features 4",
      type: "section",
      sectionType: "features",
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
                  className: "text-center max-w-3xl mx-auto mb-16",
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
                        innerText: `<p className="text-sm text-center font-medium">Create without boundaries.</p>`,
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
                        innerText: `<h2 className="text-4xl font-medium  mb-6   md:text-5xl   text-left sm:text-center">Build professional websites easy, fast, and affordable</h2>`,
                      },
                    },
                    {
                      id: v4(),
                      styles: {},
                      className:
                        "text-base text-left sm:text-center leading-relaxed max-w-2xl mx-auto",
                      name: "",
                      type: "text",
                      isHidden: false,
                      content: {
                        innerText: `<p className="text-base text-left sm:text-center leading-relaxed max-w-2xl mx-auto">Visually build and design beautiful, responsive web projects without compromising your vision.</p>`,
                      },
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
                    layout: "flex",
                    grid_columns: 3,
                    smart_layout_type: "icon_with_text",
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
                          className:
                            "text-lg   font-semibold mb-3 leading-tight",
                          name: "",
                          type: "layout_Item_Title",
                          settings: {
                            contentIsDynamic: false,
                          },
                          content: {
                            innerText: `
                              <h3 className="text-lg leading-tight">Title here</h3>
                              `,
                            metaDynamic: [],
                          },
                        },
                        {
                          id: v4(),
                          styles: {},
                          className: "text-sm leading-relaxed",
                          name: "",
                          type: "layout_Item_Content",
                          settings: {
                            contentIsDynamic: false,
                          },
                          content: {
                            innerText: `
                              <p className= "text-sm leading-relaxed">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula.</p>
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
                          className: "text-[16px] font-semibold",
                          name: "",
                          type: "layout_Item_Title",
                          settings: {
                            contentIsDynamic: false,
                          },
                          content: {
                            innerText: `
                              <h3>Title here</h3>
                              `,
                            metaDynamic: [],
                          },
                        },
                        {
                          id: v4(),
                          styles: {},
                          className: "text-[16px] leading-[1.625em]",
                          name: "",
                          type: "layout_Item_Content",
                          settings: {
                            contentIsDynamic: false,
                          },
                          content: {
                            innerText: `
                              
                              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec.</p>
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
                          className: "text-[16px] font-semibold",
                          name: "",
                          type: "layout_Item_Title",
                          settings: {
                            contentIsDynamic: false,
                          },
                          content: {
                            innerText: `
                              <h3>Title here</h3>
                              `,
                            metaDynamic: [],
                          },
                        },
                        {
                          id: v4(),
                          styles: {},
                          className: "text-[16px] leading-[1.625em]",
                          name: "",
                          type: "layout_Item_Content",
                          settings: {
                            contentIsDynamic: false,
                          },
                          content: {
                            innerText: `
                              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.</p>
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
