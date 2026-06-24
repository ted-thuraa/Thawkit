import { ElementNode, SectionTemplates } from "@/stores/pageEditorStore/types";
import { v4 } from "uuid";

export const IndividualScoreTemplates: SectionTemplates[] = [
  {
    id: v4(),
    name: "",
    type: "individualScore",
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
        backgroundSource: "upload",
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
                  className: "flex flex-col items-center sm:items-stretch ",
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
                        innerText: "<h1>Your Brand Ai Visibility Report</h1>",
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
                          '<p>Test how ChatGPT, Claude, Gemini, DeepSeek, and Perplexity present Spotify in their responses. Get visibility scores, competitor analysis, and brand sentiment across AI models. For continuous monitoring and alerts, <a class="text-blue-600 hover:text-blue-800 underline cursor-pointer" href="">join our platform</a>.</p>',
                      },
                    },
                  ],
                },
              ],
            },

            {
              id: v4(),
              styles: {},
              className: "flex flex-col items-start",
              name: "",
              type: "IndividualScore",
              isHidden: false,
              settings: {
                showCategoryScores: true,
                individualScoreLogic: "highest_score_cat",
              },
              content: [
                {
                  id: v4(),
                  styles: {},
                  className: "text-xl font-semibold",
                  name: "",
                  type: "IndividualScoreHeader",
                  isHidden: false,
                  settings: {
                    contentIsDynamic: false,
                  },
                  content: {
                    innerText: "<h2>Category Level</h2>",
                  },
                },
                {
                  id: v4(),
                  styles: {},
                  className: "  ",
                  name: "",
                  type: "IndividualScoreChart",
                  isHidden: false,
                  settings: {
                    chart_type: "text_block",
                    contentIsDynamic: false,
                    showChartMedia: false,
                  },
                  content: {
                    src: "/assets/imageplaceholder.svg",
                    innerText: "[Add text here]",
                    icon: "HelpCircle",
                    title: "<h2>Property knowledge</h2>",
                    description: "<p>Your score shows you are good at</p>",
                  },
                },
                {
                  id: v4(),
                  styles: {},
                  className: "  ",
                  name: "",
                  type: "IndividualScoreFeedback",
                  isHidden: false,
                  settings: {
                    contentIsDynamic: false,
                  },
                  content: [
                    {
                      id: v4(),
                      styles: {},
                      className: "text-lg font-bold ",
                      name: "",
                      type: "IndividualScoreFeedbackTitle",
                      settings: {
                        contentIsDynamic: false,
                      },
                      content: {
                        innerText: `<h3>Good, room for improvement</h3>`,
                        metaDynamic: [],
                      },
                    },
                    {
                      id: v4(),
                      styles: {},
                      className: "text-sm  leading-relaxed ",
                      name: "",
                      type: "IndividualScoreFeedbackDescription",
                      settings: {
                        contentIsDynamic: false,
                      },
                      content: {
                        innerText: `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>`,
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
  },
];
