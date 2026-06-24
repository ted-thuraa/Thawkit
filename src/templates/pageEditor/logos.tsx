import { ElementNode, SectionTemplates } from "@/stores/pageEditorStore/types";
import { v4 } from "uuid";

export const LogosSectionTemplates: SectionTemplates[] = [
  {
    id: v4(),
    name: "",
    preview: "",
    properties: {},
    templateContent: {
      id: v4(),
      styles: {
        minHeight: "",
      },
      className: "py-24 px-6  md:px-8 ",
      name: "Logos 1",
      type: "section",
      sectionType: "logos",
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
            paddingTop: "32px",
            paddingBottom: "32px",
            marginRight: "auto",
            marginLeft: "auto",
            maxWidth: "1280px",
          },
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
              className: "",
              name: "",
              type: "rows",
              isHidden: false,
              settings: {
                column_reverse_order: false,
              },
              content: [
                {
                  id: v4(),
                  styles: {},
                  className:
                    "font-bold text-[20px] text-center tracking-[-0.025em]  ",
                  name: "",
                  type: "text",
                  isHidden: false,
                  content: {
                    innerText: "<h3>Trusted by global companies</h3>",
                  },
                },
                {
                  id: v4(),
                  styles: {
                    gap: "",
                  },
                  className: "",
                  name: "",
                  type: "grid",
                  isHidden: false,
                  content: [
                    {
                      id: v4(),
                      styles: {
                        gap: "",
                      },
                      className: "flex items-center justify-center flex-col",
                      name: "",
                      type: "div_block",
                      isHidden: false,
                      content: [
                        {
                          id: v4(),
                          styles: {
                            maxWidth: "100%",
                          },
                          className: " h-[28px]",
                          name: "",
                          type: "image",
                          isHidden: false,
                          settings: {
                            backgroundSource: undefined,
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
                      styles: {
                        gap: "",
                      },
                      className: "flex items-center justify-center flex-col",
                      name: "",
                      type: "div_block",
                      isHidden: false,
                      content: [
                        {
                          id: v4(),
                          styles: {
                            maxWidth: "100%",
                          },
                          className: " h-[28px]",
                          name: "",
                          type: "image",
                          isHidden: false,
                          settings: {
                            backgroundSource: undefined,
                            mediaResizeMaxWidth: 100,
                            mediaResizeMaxHeight: 100,
                          },
                          content: {
                            src: "/assets/editor/dummy_company_2_logo.svg",
                            innerText: "logo",
                            width: 400,
                            height: 400,
                          },
                        },
                      ],
                    },
                    {
                      id: v4(),
                      styles: {
                        gap: "",
                      },
                      className: "flex items-center justify-center flex-col",
                      name: "",
                      type: "div_block",
                      isHidden: false,
                      content: [
                        {
                          id: v4(),
                          styles: {
                            maxWidth: "100%",
                          },
                          className: " h-[28px]",
                          name: "",
                          type: "image",
                          isHidden: false,
                          settings: {
                            backgroundSource: undefined,
                            mediaResizeMaxWidth: 100,
                            mediaResizeMaxHeight: 100,
                          },
                          content: {
                            src: "/assets/editor/dummy_company_3_logo.svg",
                            innerText: "logo",
                            width: 400,
                            height: 400,
                          },
                        },
                      ],
                    },
                    {
                      id: v4(),
                      styles: {
                        gap: "",
                      },
                      className: "flex items-center justify-center flex-col",
                      name: "",
                      type: "div_block",
                      isHidden: false,
                      content: [
                        {
                          id: v4(),
                          styles: {
                            maxWidth: "100%",
                          },
                          className: "h-[28px]",
                          name: "",
                          type: "image",
                          isHidden: false,
                          settings: {
                            backgroundSource: undefined,
                            mediaResizeMaxWidth: 100,
                            mediaResizeMaxHeight: 100,
                          },
                          content: {
                            src: "/assets/editor/dummy_company_4_logo.svg",
                            innerText: "logo",
                            width: 400,
                            height: 400,
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
