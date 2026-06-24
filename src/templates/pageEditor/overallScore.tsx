import { usePageBuilderStore } from "@/stores/pageEditorStore/store";
import { ElementNode, SectionTemplates } from "@/stores/pageEditorStore/types";
import { v4 } from "uuid";

export const OverallScoreTemplates: SectionTemplates[] = [
  {
    id: v4(),
    name: "",
    type: "overallScore",
    preview: "",
    properties: {},
    templateContent: {
      id: v4(),
      type: "section",
      name: "Profile Summary Section",
      styles: {},
      className: "",
      isHidden: false,
      settings: {
        section_full_bleed: false,
        backgroundType: "color",
        backgroundSource: undefined,
      },
      content: [
        {
          id: v4(),
          type: "container",
          name: "Main Content Container",
          styles: {
            paddingTop: "32px",
            paddingBottom: "32px",
            marginRight: "auto",
            marginLeft: "auto",
          },
          className: "relative mx-auto w-full   flex flex-col items-center ",
          isHidden: false,
          settings: {},
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
                    "max-w-3xl w-full flex flex-col items-center sm:items-stretch ",
                  name: "",
                  type: "div_block",
                  isHidden: false,
                  content: [
                    {
                      id: v4(),
                      type: "text",
                      name: "",
                      styles: {
                        textAlign: "center",
                      },
                      className:
                        "text-3xl font-semibold tracking-tight text-balance sm:text-4xl",
                      isHidden: false,
                      settings: {},
                      content: {
                        innerText: `<h1 className="text-center">Your Brand Ai Visibility Report</h1>`,
                      },
                    },
                    {
                      id: v4(),
                      type: "text",
                      name: "",
                      styles: {
                        textAlign: "center",
                      },
                      className: "text-lg/8 text-pretty  pt-3 max-w-3xl ",
                      isHidden: false,
                      settings: {},
                      content: {
                        innerText:
                          '<p className="text-center">Test how ChatGPT, Claude, Gemini, DeepSeek, and Perplexity present Spotify in their responses. Get visibility scores, competitor analysis, and brand sentiment across AI models. For continuous monitoring and alerts, <a class="text-blue-600 hover:text-blue-800 underline cursor-pointer" href="">join our platform</a>.</p>',
                      },
                    },
                  ],
                },
              ],
            },
            // {
            //   id: v4(),
            //   type: "div_block",
            //   name: "",
            //   styles: {},
            //   className: "relative  pb-12 ",
            //   isHidden: false,
            //   settings: {},
            //   content: [
            //     {
            //       id: v4(),
            //       type: "text",
            //       name: "",
            //       styles: {},
            //       className:
            //         "capitalize  mt-6 text-4xl font-medium max-w-3xl sm:mt-12 sm:text-5xl lg:text-5xl",
            //       isHidden: false,
            //       settings: {},
            //       content: {
            //         innerText: "<h1>Your Brand Ai Visibility Report</h1>",
            //       },
            //     },
            //     {
            //       id: v4(),
            //       type: "text",
            //       name: "",
            //       styles: {},
            //       className:
            //         "capitalize text-lg pt-3 max-w-3xl text-muted-foreground",
            //       isHidden: false,
            //       settings: {},
            //       content: {
            //         innerText:
            //           '<p>Test how ChatGPT, Claude, Gemini, DeepSeek, and Perplexity present Spotify in their responses. Get visibility scores, competitor analysis, and brand sentiment across AI models. For continuous monitoring and alerts, <a class="text-blue-600 hover:text-blue-800 underline cursor-pointer" href="">join our platform</a>.</p>',
            //       },
            //     },
            //   ],
            // },
            {
              id: v4(),
              styles: {},
              className: "w-full flex flex-col items-start",
              name: "",
              type: "OutcomeScoreCharts",
              isHidden: false,
              settings: {
                showCategoryScores: true,
                outcomeType: "compositionChart",
              },
              content: [
                {
                  id: v4(),
                  styles: {
                    maxWidth: "1000px",
                    maxHeight: "1000px",
                    width: "580px",
                    height: "580px",
                    borderRadius: "24px",
                    minWidth: "500px",
                    minHeight: "500px",
                  },
                  className: "  ",
                  name: "",
                  type: "OverallScorePieChart",
                  isHidden: false,
                  settings: {
                    chart_type: "pie",
                    contentIsDynamic: false,
                    chartMediaType: "image",
                    showChartMedia: false,
                  },
                  content: {
                    innerText:
                      "<p>Get in-depth campaign analysis now so you can optimize ad spend, increase ROI, and reach your target audience more effectively than ever before.</p>",
                  },
                },
                {
                  id: v4(),
                  styles: {},
                  className: "  ",
                  name: "",
                  type: "CategoryScoreSnapShot",
                  isHidden: false,
                  settings: {
                    contentIsDynamic: false,
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
                        contentIsDynamic: false,
                      },
                      content: [
                        {
                          id: v4(),
                          styles: {},
                          className: "text-sm font-medium",
                          name: "",
                          type: "catItemTitle",
                          settings: {
                            categoryId: cat.id,
                            contentIsDynamic: false,
                          },
                          content: {
                            innerText: `${cat.title}`,
                            metaDynamic: [],
                          },
                        },
                        {
                          id: v4(),
                          styles: {},
                          className: "text-sm ",
                          name: "",
                          type: "catItemDescription",
                          settings: {
                            categoryId: cat.id,
                            contentIsDynamic: false,
                          },
                          content: {
                            innerText: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`,
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
    type: "overallScore",
    preview: "",
    properties: {},
    templateContent: {
      id: v4(),
      type: "section",
      name: "Profile Summary Section",
      styles: {},
      className: "",
      isHidden: false,
      settings: {
        section_full_bleed: false,
        backgroundType: "color",
        backgroundSource: undefined,
      },
      content: [
        {
          id: v4(),
          type: "container",
          name: "",
          styles: {},
          className: "relative flex justify-center font-sans  overflow-hidden",
          isHidden: false,
          settings: {},
          content: [
            {
              id: v4(),
              type: "div_block",
              name: "",
              styles: {},
              className:
                "w-full max-w-4xl px-6 py-8 flex flex-col gap-6 relative z-10",
              isHidden: false,
              settings: {},
              content: [
                {
                  id: v4(),
                  type: "div_block",
                  name: "",
                  styles: {},
                  className: "mt-4",
                  isHidden: false,
                  settings: {},
                  content: [
                    {
                      id: v4(),
                      type: "text",
                      name: "",
                      styles: {},
                      className: "text-3xl font-bold  mb-1 md:text-center",
                      isHidden: false,
                      settings: {},
                      content: {
                        innerText: `<h1 className="text-3xl font-bold md:text-center">Hello, Alex</h1>`,
                      },
                    },
                    {
                      id: v4(),
                      type: "text",
                      name: "",
                      styles: {},
                      className: "text-lg  md:text-center ",
                      isHidden: false,
                      settings: {},
                      content: {
                        innerText:
                          '<p className="text-lg  md:text-center">Here is your results</p>',
                      },
                    },
                  ],
                },
                {
                  id: v4(),
                  styles: {},
                  className: "",
                  name: "",
                  type: "OutcomeScoreCharts",
                  isHidden: false,
                  settings: {
                    showCategoryScores: true,
                    outcomeType: "singleMetriChart",
                  },
                  content: [
                    {
                      id: v4(),
                      styles: {
                        maxWidth: "1000px",
                        maxHeight: "1000px",
                        width: "580px",
                        height: "580px",
                        borderRadius: "24px",
                        minWidth: "500px",
                        minHeight: "500px",
                      },
                      className: "  ",
                      name: "",
                      type: "OverallScorePieChart",
                      isHidden: false,
                      settings: {
                        chart_type: "gauge",
                        contentIsDynamic: false,
                        chartMediaType: "image",
                        showChartMedia: false,
                      },
                      content: {
                        innerText:
                          "<p>Get in-depth campaign analysis now so you can optimize ad spend, increase ROI, and reach your target audience more effectively than ever before.</p>",
                      },
                    },
                    {
                      id: v4(),
                      styles: {},
                      className: "  ",
                      name: "",
                      type: "CategoryScoreSnapShot",
                      isHidden: false,
                      settings: {
                        contentIsDynamic: false,
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
                            contentIsDynamic: false,
                          },
                          content: [
                            {
                              id: v4(),
                              styles: {},
                              className: "text-3xl font-semibold",
                              name: "",
                              type: "catItemTitle",
                              settings: {
                                categoryId: cat.id,
                                contentIsDynamic: false,
                              },
                              content: {
                                innerText: `<h2 className="font-medium text-sm">${cat.title}</h2>`,
                                metaDynamic: [],
                              },
                            },
                            {
                              id: v4(),
                              styles: {},
                              className: "text-[10px] leading-tight pr-2 ",
                              name: "",
                              type: "catItemDescription",
                              settings: {
                                categoryId: cat.id,
                                contentIsDynamic: false,
                              },
                              content: {
                                innerText: `<p className="text-xs leading-tight ">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>`,
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
      ],
    },
  },
];
