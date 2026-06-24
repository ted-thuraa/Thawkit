import { ElementNode, SectionTemplates } from "@/stores/pageEditorStore/types";
import { v4 } from "uuid";

export const AdvertTemplates: SectionTemplates[] = [
  {
    id: v4(),
    name: "",
    properties: {},
    templateContent: {
      id: v4(),
      styles: {},
      className: "",
      name: "EcommerceBanner1",
      type: "ad_banner",
      sectionType: "advert",
      preview: "",
      isHidden: false,
      settings: {
        backgroundType: "color",
        backgroundSource: "upload",
      },
      content: [
        {
          id: v4(),
          styles: {},
          className: "w-full rounded-lg overflow-hidden",
          name: "",
          type: "div_block",
          content: [
            {
              id: v4(),
              styles: {},
              className:
                "flex flex-col md:flex-row items-center justify-center",
              name: "",
              type: "div_block",
              content: [
                {
                  id: v4(),
                  styles: {},
                  className: "w-[70%] md:w-1/3",
                  name: "",
                  type: "div_block",
                  content: [
                    {
                      id: v4(),
                      styles: {
                        maxWidth: "100%",
                        width: "392px",
                        height: "192px",
                        objectFit: "cover",
                        borderRadius: "24px",
                        minHeight: "440px",
                      },
                      className: "object-cover w-full h-48 ",
                      name: "",
                      type: "image",
                      isHidden: false,
                      settings: {
                        media_sub_category: "normal_image",
                        mediaResizeMaxWidth: 600,
                        mediaResizeMaxHeight: 600,
                      },
                      content: {
                        src: "/assets/roundArchitecture.jpg",
                        innerText: " add alt here",
                      },
                    },
                  ],
                },
                {
                  id: v4(),
                  styles: {},
                  className: "p-6 md:p-8",
                  name: "",
                  type: "div_block",
                  content: [
                    {
                      id: v4(),
                      styles: {},
                      className:
                        "text-2xl font-bold tracking-tight  sm:text-2xl",
                      name: "",
                      type: "text",
                      isHidden: false,
                      content: {
                        innerText: "<h3> Elegant Smartwatch</h3>",
                      },
                    },
                    {
                      id: v4(),
                      styles: {},
                      className: "mt-2 font-normal",
                      name: "",
                      type: "text",
                      isHidden: false,
                      content: {
                        innerText:
                          "<p>Stay connected in style. Track your fitness, calls, and more.</p>",
                      },
                    },
                    {
                      id: v4(),
                      styles: {},
                      className: "flex items-baseline gap-4 mt-4",
                      name: "",
                      type: "div_block",
                      content: [
                        {
                          id: v4(),
                          styles: {},
                          className: "text-3xl font-bold",
                          name: "",
                          type: "text",
                          isHidden: false,
                          content: {
                            innerText: "<span>$249.99</span>",
                          },
                        },
                      ],
                    },
                    {
                      id: v4(),
                      styles: {},
                      className: "",
                      name: "",
                      type: "buttons",
                      layoutType: "",
                      isHidden: false,
                      settings: {
                        itemsHorizontalAlignment: "flex-start",
                        showPrivacyStatement: false,
                        privacyStatement: "",
                      },
                      content: [
                        {
                          id: v4(),
                          styles: {},
                          className:
                            "inline-block mt-6 inline-flex justify-center items-center text-center outline-none m-[1px] h-[36px] px-[16px] rounded-[8px] shadow-sm",
                          name: "",
                          type: "button_item",
                          isHidden: false,
                          settings: {
                            btn_action: "open_link",
                            btn_style: "default",
                          },
                          content: {
                            href: "",
                            innerText: "Shop Now",
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

// export const AdvertTemplates: ElementNode[] = [
//   {
//     id: v4(),
//     styles: {},
//     className: "",
//     name: "EcommerceBanner1",
//     type: "ad_banner",
//     sectionType: "advert",
//     preview: "",
//     isHidden: false,
//     settings: {
//       backgroundType: "color",
//       backgroundSource: "upload",
//     },
//     content: [
//       {
//         id: v4(),
//         styles: {},
//         className: "w-full rounded-lg overflow-hidden",
//         name: "",
//         type: "div_block",
//         content: [
//           {
//             id: v4(),
//             styles: {},
//             className: "flex flex-col md:flex-row items-center justify-center",
//             name: "",
//             type: "div_block",
//             content: [
//               {
//                 id: v4(),
//                 styles: {},
//                 className: "w-[70%] md:w-1/3",
//                 name: "",
//                 type: "div_block",
//                 content: [
//                   {
//                     id: v4(),
//                     styles: {
//                       maxWidth: "100%",
//                       width: "392px",
//                       height: "192px",
//                       objectFit: "cover",
//                       borderRadius: "24px",
//                       minHeight: "440px",
//                     },
//                     className: "object-cover w-full h-48 ",
//                     name: "",
//                     type: "image",
//                     isHidden: false,
//                     settings: {
//                       media_sub_category: "normal_image",
//                       mediaResizeMaxWidth: 600,
//                       mediaResizeMaxHeight: 600,
//                     },
//                     content: {
//                       src: "/assets/roundArchitecture.jpg",
//                       innerText: " add alt here",
//                     },
//                   },
//                 ],
//               },
//               {
//                 id: v4(),
//                 styles: {},
//                 className: "p-6 md:p-8",
//                 name: "",
//                 type: "div_block",
//                 content: [
//                   {
//                     id: v4(),
//                     styles: {},
//                     className: "text-2xl font-bold tracking-tight  sm:text-2xl",
//                     name: "",
//                     type: "text",
//                     isHidden: false,
//                     content: {
//                       innerText: "<h3> Elegant Smartwatch</h3>",
//                     },
//                   },
//                   {
//                     id: v4(),
//                     styles: {},
//                     className: "mt-2 font-normal",
//                     name: "",
//                     type: "text",
//                     isHidden: false,
//                     content: {
//                       innerText:
//                         "<p>Stay connected in style. Track your fitness, calls, and more.</p>",
//                     },
//                   },
//                   {
//                     id: v4(),
//                     styles: {},
//                     className: "flex items-baseline gap-4 mt-4",
//                     name: "",
//                     type: "div_block",
//                     content: [
//                       {
//                         id: v4(),
//                         styles: {},
//                         className: "text-3xl font-bold",
//                         name: "",
//                         type: "text",
//                         isHidden: false,
//                         content: {
//                           innerText: "<span>$249.99</span>",
//                         },
//                       },
//                     ],
//                   },
//                   {
//                     id: v4(),
//                     styles: {},
//                     className: "",
//                     name: "",
//                     type: "buttons",
//                     layoutType: "",
//                     isHidden: false,
//                     settings: {
//                       itemsHorizontalAlignment: "flex-start",
//                       showPrivacyStatement: false,
//                       privacyStatement: "",
//                     },
//                     content: [
//                       {
//                         id: v4(),
//                         styles: {},
//                         className:
//                           "inline-block mt-6 inline-flex justify-center items-center text-center outline-none m-[1px] h-[36px] px-[16px] rounded-[8px] shadow-sm",
//                         name: "",
//                         type: "button_item",
//                         isHidden: false,
//                         settings: {
//                           btn_action: "open_link",
//                           btn_style: "default",
//                         },
//                         content: {
//                           href: "",
//                           innerText: "Shop Now",
//                         },
//                       },
//                     ],
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
