import { usePageBuilderStore } from "@/stores/pageEditorStore/store";
import { ElementNode, SectionTemplates } from "@/stores/pageEditorStore/types";
import { v4 } from "uuid";

export const CategoryScoresTemplates: SectionTemplates[] = [
  {
    id: v4(),
    name: "",
    type: "categoryScore",
    preview: "",
    properties: {},
    templateContent: {
      id: v4(),
      styles: {},
      className: "",
      name: "Category Scores 1",
      type: "section",
      sectionType: "categoryScores",
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
                  id: v4(),
                  styles: {},
                  className: "",
                  name: "",
                  type: "category_scores",
                  isHidden: false,
                  settings: {
                    grid_columns: 3,
                    smart_layout_type: "category_score_item_short",
                  },
                  content: usePageBuilderStore
                    .getState()
                    .categories.map((cat) => ({
                      id: v4(),
                      styles: {},
                      className: "",
                      name: "",
                      type: "catItem",
                      settings: {
                        categoryId: cat.id,
                        contentCanBeDynamic: false,
                      },
                      content: [
                        {
                          id: v4(),
                          styles: {},
                          className: "text-base font-semibold",
                          name: "",
                          type: "catItemTitle",
                          settings: {
                            categoryId: cat.id,
                            contentCanBeDynamic: false,
                          },
                          content: {
                            innerText: `
                              <h3>${cat.title}</h3>
                              `,
                            metaDynamic: [],
                          },
                        },
                        {
                          id: v4(),
                          styles: {},
                          className: "",
                          name: "",
                          type: "catItemDescription",
                          settings: {
                            categoryId: cat.id,
                            contentCanBeDynamic: false,
                          },
                          content: {
                            innerText: `
                              
                              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                              `,
                            metaDynamic: [],
                          },
                        },
                      ],
                    })),
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
    type: "categoryScore",
    preview: "",
    properties: {},
    templateContent: {
      id: v4(),
      styles: {},
      className: "",
      name: "Detailed Results by AI Model",
      type: "section",
      sectionType: "DetailedCategoryScore",
      preview: "",
      isHidden: false,
      settings: {
        section_full_bleed: false,
      },
      content: [
        {
          id: v4(),
          styles: {},
          className: "relative mx-auto max-w-6xl  px-4 sm:px-6 md:px-12",
          name: "",
          type: "container",
          isHidden: false,
          settings: {
            content_alignment: "",
          },
          content: [
            {
              id: v4(),
              type: "div_block",
              name: "",
              styles: {},
              className: "relative  pb-12  ",
              isHidden: false,
              settings: {},
              content: [
                {
                  id: v4(),
                  type: "text",
                  name: "",
                  styles: {},
                  className:
                    "text-3xl font-semibold tracking-tight text-balance sm:text-4xl",
                  isHidden: false,
                  settings: {},
                  content: {
                    innerText: "<h1>Detailed Results by Category</h1>",
                  },
                },
                {
                  id: v4(),
                  type: "text",
                  name: "",
                  styles: {},
                  className: "text-lg/8 text-pretty  pt-3 max-w-3xl",
                  isHidden: false,
                  settings: {},
                  content: {
                    innerText:
                      "<p>See how you performed across  different Categories.</p>",
                  },
                },
              ],
            },
            {
              id: v4(),
              styles: {},
              className: "",
              name: "",
              type: "DetailedCategoryScores",
              isHidden: false,
              settings: {
                contentCanBeDynamic: false,
              },
              content: usePageBuilderStore.getState().categories.map((cat) => ({
                id: v4(),
                styles: {},
                className: "",
                name: "",
                type: "catItem",
                settings: {
                  categoryId: cat.id,
                  contentCanBeDynamic: false,
                },
                content: [
                  {
                    id: v4(),
                    styles: {},
                    className:
                      "text-xl md:text-2xl font-extrabold  leading-snug",
                    name: "",
                    type: "catItemTitle",
                    settings: {
                      categoryId: cat.id,
                      contentCanBeDynamic: true,
                    },
                    content: {
                      innerText: `<h2>${cat.title}</h2>`,
                      metaDynamic: [],
                    },
                  },
                  {
                    id: v4(),
                    styles: {},
                    className:
                      "text-sm md:text-base space-y-4  leading-relaxed",
                    name: "",
                    type: "catItemDescription",
                    settings: {
                      categoryId: cat.id,
                      contentCanBeDynamic: true,
                    },
                    content: {
                      innerText: `<p>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                    Pellentesque eros tortor, tempor vel imperdiet quis, egestas et
                                    velit. Nam quam leo, feugiat ac sem et, posuere faucibus sem.
                                    Praesent ac fringilla diam. Fusce bibendum, ante vel ultrices
                                    ullamcorper, risus enim finibus diam, id laoreet odio massa at
                                    quam.
                                  </p>
                                  <p>
                                    Curabitur ut enim a tortor sodales vehicula in vel urna. Fusce
                                    nunc arcu, commodo in elementum vitae, laoreet non dui. In justo
                                    erat, fringilla quis tincidunt sed, varius sit amet velit.
                                    Praesent vitae lobortis nunc, ut pharetra elit.
                                  </p>
                                  <p>
                                    Sed sed massa at eros egestas sollicitudin. Quisque mollis mattis
                                    cursus. Phasellus in tristique eros, feugiat volutpat dolor.
                                    Nullam id neque porta, ultricies ipsum sed, gravida nulla. Integer
                                    eu urna enim. Ut gravida pellentesque turpis et sollicitudin. Ut
                                    ultricies luctus ex, in auctor augue scelerisque et.
                                  </p>
                                  <p>
                                    Phasellus tincidunt ligula sed tortor pharetra dapibus. Phasellus
                                    lacinia convallis laoreet. Proin condimentum laoreet pretium.
                                    Fusce auctor leo a metus fringilla, eget fermentum justo
                                    elementum. Mauris at mauris non augue sodales sagittis. In
                                    efficitur nulla ut justo rutrum suscipit. Etiam in lacus vel
                                    mauris consequat viverra euismod sed augue. Duis malesuada dui eu
                                    purus scelerisque, nec rutrum libero malesuada.
                                  </p>`,
                      metaDynamic: [],
                    },
                  },
                ],
              })),
            },
          ],
        },
      ],
    },
  },
  {
    id: v4(),
    name: "",
    type: "categoryScore",
    preview: "",
    properties: {},
    templateContent: {
      id: v4(),
      styles: {},
      className: "",
      name: "Category Scores 1",
      type: "section",
      sectionType: "categoryScores",
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
                    smart_layout_type: "category_score_item_short",
                  },
                  content: usePageBuilderStore
                    .getState()
                    .categories.map((cat) => ({
                      id: v4(),
                      styles: {},
                      className: "",
                      name: "",
                      type: "catItem",
                      settings: {
                        categoryId: cat.id,
                        contentCanBeDynamic: false,
                      },
                      content: [
                        {
                          id: v4(),
                          styles: {},
                          className: "text-base font-semibold",
                          name: "",
                          type: "catItemTitle",
                          settings: {
                            categoryId: cat.id,
                            contentCanBeDynamic: false,
                          },
                          content: {
                            innerText: `
                              <h2>${cat.title}</h2>
                              `,
                            metaDynamic: [],
                          },
                        },
                        {
                          id: v4(),
                          styles: {},
                          className: "text-sm",
                          name: "",
                          type: "catItemDescription",
                          settings: {
                            categoryId: cat.id,
                            contentCanBeDynamic: false,
                          },
                          content: {
                            innerText: `
                              
                              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                              `,
                            metaDynamic: [],
                          },
                        },
                      ],
                    })),
                },
              ],
            },
          ],
        },
      ],
    },
  },
];
