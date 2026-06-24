import { ElementNode, SectionTemplates } from "@/stores/pageEditorStore/types";
import { v4 } from "uuid";

export const VideoTemplates: SectionTemplates[] = [
  {
    id: v4(),
    name: "",
    properties: {},
    templateContent: {
      id: v4(),
      styles: {},
      className: "",
      name: "video 1",
      type: "section",
      sectionType: "video",
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
              type: "rows",
              isHidden: false,
              content: [
                {
                  id: v4(),
                  styles: {
                    marginTop: "72px",
                  },
                  className: "",
                  name: "",
                  type: "div_block",
                  isHidden: false,
                  content: [
                    {
                      id: v4(),
                      styles: {
                        width: "1278px",
                        height: "540px",
                        objectFit: "cover",
                        borderRadius: "24px",
                      },
                      className: "",
                      name: "",
                      type: "video",
                      isHidden: false,
                      settings: {
                        media_sub_category: "normal_image",
                        mediaResizeMaxWidth: 1278,
                        mediaResizeMaxHeight: 640,
                      },
                      content: {
                        src: "https://youtu.be/05Jzdwkkvh8?si=JpDAsxRhORaj_QTW",
                        innerText: "video",
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
    properties: {},
    templateContent: {
      id: v4(),
      styles: {},
      className: "",
      name: "Video 2",
      type: "section",
      sectionType: "video",
      preview: "",
      isHidden: false,
      settings: {
        //section_layout: "columns",
        section_full_bleed: false,
        backgroundType: "color",
        backgroundSource: "",
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
                      className:
                        "font-bold text-[36px] leading-[1.1] sm:text-[36px] tracking-[-0.05em]  md:text-[48px]",
                      name: "",
                      type: "text",
                      isHidden: false,
                      content: {
                        innerText:
                          "<h1>Build professional websites easy, fast, and affordable</h1>",
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
                  styles: {
                    gap: "",
                  },
                  className: "",
                  name: "",
                  type: "div_block",
                  isHidden: false,
                  content: [
                    {
                      id: v4(),
                      styles: {
                        maxWidth: "100%",
                        width: "600px",
                        height: "450px",
                        objectFit: "cover",
                        borderRadius: "24px",
                        minHeight: "440px",
                      },
                      className: "",
                      name: "",
                      type: "video",
                      isHidden: false,
                      settings: {
                        media_sub_category: "normal_image",
                        mediaResizeMaxWidth: 600,
                        mediaResizeMaxHeight: 600,
                      },
                      content: {
                        src: "https://youtu.be/05Jzdwkkvh8?si=JpDAsxRhORaj_QTW",
                        innerText: " GET YOUR FREE ANALYSIS",
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
    properties: {},
    templateContent: {
      id: v4(),
      styles: {},
      className: "",
      name: "video 3",
      type: "section",
      sectionType: "video",
      preview: "",
      isHidden: false,
      settings: {
        //section_layout: "columns",
        section_full_bleed: false,
        backgroundType: "color",
        backgroundSource: "",
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
              className: "",
              name: "",
              type: "rows",
              isHidden: false,
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
                        maxWidth: "768px",
                      },
                      className: "flex flex-col items-center sm:items-stretch ",
                      name: "",
                      type: "div_block",
                      isHidden: false,
                      content: [
                        {
                          id: v4(),
                          styles: { textAlign: "center" },
                          className:
                            "font-bold text-[60px] leading-[1.1] sm:text-[36px] tracking-[-0.05em]  md:text-[48px] ",
                          name: "",
                          type: "text",
                          isHidden: false,
                          content: {
                            innerText:
                              "<h1>Build professional websites easy, fast, and affordable</h1>",
                          },
                        },
                        {
                          id: v4(),
                          styles: { textAlign: "center" },
                          className: "text-[20px]  ",
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
                  styles: {
                    maxWidth: "1000px",
                  },
                  className: "",
                  name: "",
                  type: "div_block",
                  isHidden: false,
                  content: [
                    {
                      id: v4(),
                      styles: {
                        width: "1278px",
                        height: "540px",
                        maxWidth: "100%",
                        objectFit: "cover",
                        borderRadius: "24px",
                      },
                      className: "",
                      name: "",
                      type: "video",
                      isHidden: false,
                      settings: {
                        media_sub_category: "normal_image",
                        mediaResizeMaxWidth: 1278,
                        mediaResizeMaxHeight: 640,
                      },
                      content: {
                        src: "https://youtu.be/05Jzdwkkvh8?si=JpDAsxRhORaj_QTW",
                        innerText: " GET YOUR FREE ANALYSIS",
                        // height: 540,
                        // width: 1278,
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
    properties: {},
    templateContent: {
      id: v4(),
      styles: {},
      className: "",
      name: "video 4",
      type: "section",
      sectionType: "video",
      preview: "",
      isHidden: false,
      settings: {
        //section_layout: "columns",
        section_full_bleed: false,
        backgroundType: "color",
        backgroundSource: "",
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
                      className:
                        "w-full flex flex-col items-center justify-center sm:items-stretch gap-[20px]",
                      name: "",
                      type: "div_block",
                      isHidden: false,
                      content: [
                        {
                          id: v4(),
                          styles: {},
                          className:
                            " font-bold text-[60px] leading-[1.1] sm:text-[36px] tracking-[-0.05em]  md:text-[48px]",
                          name: "",
                          type: "text",
                          isHidden: false,
                          content: {
                            innerText:
                              "<h1>Build professional websites easy, fast, and affordable</h1>",
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
                        "flex flex-col items-start flex-1 sm:items-stretch",
                      name: "",
                      type: "div_block",
                      isHidden: false,
                      content: [
                        {
                          id: v4(),
                          styles: {},
                          className: "text-[20px]  ",
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
                  styles: {
                    marginTop: "72px",
                  },
                  className: "",
                  name: "",
                  type: "div_block",
                  isHidden: false,
                  content: [
                    {
                      id: v4(),
                      styles: {
                        width: "1278px",
                        height: "540px",
                        objectFit: "cover",
                        borderRadius: "24px",
                      },
                      className: "",
                      name: "",
                      type: "video",
                      isHidden: false,
                      settings: {
                        media_sub_category: "normal_image",
                        mediaResizeMaxWidth: 1278,
                        mediaResizeMaxHeight: 640,
                      },
                      content: {
                        src: "https://youtu.be/05Jzdwkkvh8?si=JpDAsxRhORaj_QTW",
                        innerText: "video",
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

// export const VideoTemplates: ElementNode[] = [
//   {
//     id: v4(),
//     styles: {},
//     className: "",
//     name: "video 1",
//     type: "section",
//     sectionType: "video",
//     preview: "",
//     isHidden: false,
//     settings: {
//       //section_layout: "columns",
//       section_full_bleed: false,
//       backgroundType: "color",
//       backgroundSource: "",
//     },
//     content: [
//       {
//         id: v4(),
//         styles: {
//           paddingTop: "0px",
//           paddingBottom: "0px",

//           marginTop: "0px",
//           marginBottom: "0px",
//           marginRight: "auto",
//           marginLeft: "auto",
//           maxWidth: "1280px",
//         },
//         className: "w-full h-full  py-8 md:py-[24px]",
//         name: "",
//         type: "container",
//         isHidden: false,
//         settings: {
//           //section_layout: "",
//           content_alignment: "",
//         },
//         content: [
//           {
//             id: v4(),
//             styles: {},
//             className: "",
//             name: "",
//             type: "rows",
//             isHidden: false,
//             content: [
//               {
//                 id: v4(),
//                 styles: {
//                   marginTop: "72px",
//                 },
//                 className: "",
//                 name: "",
//                 type: "div_block",
//                 isHidden: false,
//                 content: [
//                   {
//                     id: v4(),
//                     styles: {
//                       width: "1278px",
//                       height: "540px",
//                       objectFit: "cover",
//                       borderRadius: "24px",
//                     },
//                     className: "",
//                     name: "",
//                     type: "video",
//                     isHidden: false,
//                     settings: {
//                       media_sub_category: "normal_image",
//                       mediaResizeMaxWidth: 1278,
//                       mediaResizeMaxHeight: 640,
//                     },
//                     content: {
//                       src: "https://youtu.be/05Jzdwkkvh8?si=JpDAsxRhORaj_QTW",
//                       innerText: "video",
//                     },
//                   },
//                 ],
//               },
//             ],
//           },
//         ],
//       },
//     ],
//   },
//   {
//     id: v4(),
//     styles: {},
//     className: "",
//     name: "Video 2",
//     type: "section",
//     sectionType: "video",
//     preview: "",
//     isHidden: false,
//     settings: {
//       //section_layout: "columns",
//       section_full_bleed: false,
//       backgroundType: "color",
//       backgroundSource: "",
//     },
//     content: [
//       {
//         id: v4(),
//         styles: {
//           paddingTop: "32px",
//           paddingBottom: "32px",
//           marginRight: "auto",
//           marginLeft: "auto",
//           maxWidth: "1280px",
//         },
//         className: "w-full  flex flex-col",
//         name: "",
//         type: "container",
//         isHidden: false,
//         settings: {
//           //section_layout: "",
//           content_alignment: "",
//         },
//         content: [
//           {
//             id: v4(),
//             styles: {},
//             className: "",
//             name: "",
//             type: "columns",
//             isHidden: false,
//             settings: {
//               column_reverse_order: false,
//             },
//             content: [
//               {
//                 id: v4(),
//                 styles: {
//                   gap: "20px",
//                 },
//                 className: "flex flex-col ",
//                 name: "",
//                 type: "div_block",
//                 isHidden: false,
//                 content: [
//                   {
//                     id: v4(),
//                     styles: {},
//                     className:
//                       "font-bold text-[36px] leading-[1.1] sm:text-[36px] tracking-[-0.05em]  md:text-[48px]",
//                     name: "",
//                     type: "text",
//                     isHidden: false,
//                     content: {
//                       innerText:
//                         "<h1>Build professional websites easy, fast, and affordable</h1>",
//                     },
//                   },
//                   {
//                     id: v4(),
//                     styles: {},
//                     className: "text-[20px] ",
//                     name: "",
//                     type: "text",
//                     isHidden: false,
//                     content: {
//                       innerText:
//                         "<p>Visually build and design beautiful, responsive web projects without compromising your vision.</p>",
//                     },
//                   },
//                 ],
//               },
//               {
//                 id: v4(),
//                 styles: {
//                   gap: "",
//                 },
//                 className: "",
//                 name: "",
//                 type: "div_block",
//                 isHidden: false,
//                 content: [
//                   {
//                     id: v4(),
//                     styles: {
//                       maxWidth: "100%",
//                       width: "600px",
//                       height: "450px",
//                       objectFit: "cover",
//                       borderRadius: "24px",
//                       minHeight: "440px",
//                     },
//                     className: "",
//                     name: "",
//                     type: "video",
//                     isHidden: false,
//                     settings: {
//                       media_sub_category: "normal_image",
//                       mediaResizeMaxWidth: 600,
//                       mediaResizeMaxHeight: 600,
//                     },
//                     content: {
//                       src: "https://youtu.be/05Jzdwkkvh8?si=JpDAsxRhORaj_QTW",
//                       innerText: " GET YOUR FREE ANALYSIS",
//                     },
//                   },
//                 ],
//               },
//             ],
//           },
//         ],
//       },
//     ],
//   },

//   {
//     id: v4(),
//     styles: {},
//     className: "",
//     name: "video 3",
//     type: "section",
//     sectionType: "video",
//     preview: "",
//     isHidden: false,
//     settings: {
//       //section_layout: "columns",
//       section_full_bleed: false,
//       backgroundType: "color",
//       backgroundSource: "",
//     },
//     content: [
//       {
//         id: v4(),
//         styles: {
//           paddingTop: "32px",
//           paddingBottom: "32px",
//           marginRight: "auto",
//           marginLeft: "auto",
//           maxWidth: "1280px",
//         },
//         className: "w-full flex flex-col items-center",
//         name: "",
//         type: "container",
//         isHidden: false,
//         settings: {
//           //section_layout: "",
//           content_alignment: "",
//         },
//         content: [
//           {
//             id: v4(),
//             styles: {},
//             className: "",
//             name: "",
//             type: "rows",
//             isHidden: false,
//             content: [
//               {
//                 id: v4(),
//                 styles: {
//                   maxWidth: "768px",
//                 },
//                 className: "",
//                 name: "",
//                 type: "rows",
//                 isHidden: false,
//                 content: [
//                   {
//                     id: v4(),
//                     styles: {
//                       gap: "20px",
//                       maxWidth: "768px",
//                     },
//                     className: "flex flex-col items-center sm:items-stretch ",
//                     name: "",
//                     type: "div_block",
//                     isHidden: false,
//                     content: [
//                       {
//                         id: v4(),
//                         styles: { textAlign: "center" },
//                         className:
//                           "font-bold text-[60px] leading-[1.1] sm:text-[36px] tracking-[-0.05em]  md:text-[48px] ",
//                         name: "",
//                         type: "text",
//                         isHidden: false,
//                         content: {
//                           innerText:
//                             "<h1>Build professional websites easy, fast, and affordable</h1>",
//                         },
//                       },
//                       {
//                         id: v4(),
//                         styles: { textAlign: "center" },
//                         className: "text-[20px]  ",
//                         name: "",
//                         type: "text",
//                         isHidden: false,
//                         content: {
//                           innerText:
//                             "<p>Visually build and design beautiful, responsive web projects without compromising your vision.</p>",
//                         },
//                       },
//                     ],
//                   },
//                 ],
//               },
//               {
//                 id: v4(),
//                 styles: {
//                   maxWidth: "1000px",
//                 },
//                 className: "",
//                 name: "",
//                 type: "div_block",
//                 isHidden: false,
//                 content: [
//                   {
//                     id: v4(),
//                     styles: {
//                       width: "1278px",
//                       height: "540px",
//                       maxWidth: "100%",
//                       objectFit: "cover",
//                       borderRadius: "24px",
//                     },
//                     className: "",
//                     name: "",
//                     type: "video",
//                     isHidden: false,
//                     settings: {
//                       media_sub_category: "normal_image",
//                       mediaResizeMaxWidth: 1278,
//                       mediaResizeMaxHeight: 640,
//                     },
//                     content: {
//                       src: "https://youtu.be/05Jzdwkkvh8?si=JpDAsxRhORaj_QTW",
//                       innerText: " GET YOUR FREE ANALYSIS",
//                       // height: 540,
//                       // width: 1278,
//                     },
//                   },
//                 ],
//               },
//             ],
//           },
//         ],
//       },
//     ],
//   },

//   {
//     id: v4(),
//     styles: {},
//     className: "",
//     name: "video 4",
//     type: "section",
//     sectionType: "video",
//     preview: "",
//     isHidden: false,
//     settings: {
//       //section_layout: "columns",
//       section_full_bleed: false,
//       backgroundType: "color",
//       backgroundSource: "",
//     },
//     content: [
//       {
//         id: v4(),
//         styles: {
//           paddingTop: "0px",
//           paddingBottom: "0px",

//           marginTop: "0px",
//           marginBottom: "0px",
//           marginRight: "auto",
//           marginLeft: "auto",
//           maxWidth: "1280px",
//         },
//         className: "w-full h-full  py-8 md:py-[24px]",
//         name: "",
//         type: "container",
//         isHidden: false,
//         settings: {
//           //section_layout: "",
//           content_alignment: "",
//         },
//         content: [
//           {
//             id: v4(),
//             styles: {},
//             className: "",
//             name: "",
//             type: "rows",
//             isHidden: false,
//             content: [
//               {
//                 id: v4(),
//                 styles: {},
//                 className: "",
//                 name: "",
//                 type: "columns",
//                 isHidden: false,
//                 content: [
//                   {
//                     id: v4(),
//                     styles: {
//                       maxWidth: "560px",
//                     },
//                     className:
//                       "w-full flex flex-col items-center justify-center sm:items-stretch gap-[20px]",
//                     name: "",
//                     type: "div_block",
//                     isHidden: false,
//                     content: [
//                       {
//                         id: v4(),
//                         styles: {},
//                         className:
//                           " font-bold text-[60px] leading-[1.1] sm:text-[36px] tracking-[-0.05em]  md:text-[48px]",
//                         name: "",
//                         type: "text",
//                         isHidden: false,
//                         content: {
//                           innerText:
//                             "<h1>Build professional websites easy, fast, and affordable</h1>",
//                         },
//                       },
//                     ],
//                   },
//                   {
//                     id: v4(),
//                     styles: {
//                       gap: "20px",
//                     },
//                     className:
//                       "flex flex-col items-start flex-1 sm:items-stretch",
//                     name: "",
//                     type: "div_block",
//                     isHidden: false,
//                     content: [
//                       {
//                         id: v4(),
//                         styles: {},
//                         className: "text-[20px]  ",
//                         name: "",
//                         type: "text",
//                         isHidden: false,
//                         content: {
//                           innerText:
//                             "<p>Visually build and design beautiful, responsive web projects without compromising your vision.</p>",
//                         },
//                       },
//                     ],
//                   },
//                 ],
//               },
//               {
//                 id: v4(),
//                 styles: {
//                   marginTop: "72px",
//                 },
//                 className: "",
//                 name: "",
//                 type: "div_block",
//                 isHidden: false,
//                 content: [
//                   {
//                     id: v4(),
//                     styles: {
//                       width: "1278px",
//                       height: "540px",
//                       objectFit: "cover",
//                       borderRadius: "24px",
//                     },
//                     className: "",
//                     name: "",
//                     type: "video",
//                     isHidden: false,
//                     settings: {
//                       media_sub_category: "normal_image",
//                       mediaResizeMaxWidth: 1278,
//                       mediaResizeMaxHeight: 640,
//                     },
//                     content: {
//                       src: "https://youtu.be/05Jzdwkkvh8?si=JpDAsxRhORaj_QTW",
//                       innerText: "video",
//                     },
//                   },
//                 ],
//               },
//             ],
//           },
//         ],
//       },
//     ],
//   },
// ];
