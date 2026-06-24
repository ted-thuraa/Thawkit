import { ElementNode, SectionTemplates } from "@/stores/pageEditorStore/types";
import { v4 } from "uuid";

export const QuestionTemplates: SectionTemplates[] = [
  {
    id: v4(),
    name: "",
    preview: "",
    properties: {},
    templateContent: {
      id: v4(),
      styles: {},
      className: "min-h-[90vh]",
      name: "Quiz 1",
      type: "quizCanvas",
      sectionType: "quiz",
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
          styles: {},
          className: "w-full overflow-hidden flex flex-col",
          name: "Progress bar",
          type: "progress_bar",
          isHidden: false,
          settings: {
            //section_layout: "",
            content_alignment: "",
          },
          content: [],
        },
        {
          id: v4(),
          styles: {},
          className: "",
          name: "Questions",
          type: "questions",
          isHidden: false,
          settings: {
            content_alignment: "",
            question_option_btn_color: "",
          },
          content: [
            {
              id: v4(),
              styles: {},
              className: "",
              name: "Answers",
              type: "question_options",
              isHidden: false,
              settings: {
                //section_layout: "",
                btn_style: "default",
                content_alignment: "",
                question_option_btn_color: "",
              },
              content: [],
            },
          ],
        },
        {
          id: v4(),
          styles: {},
          className: "w-full overflow-hidden flex flex-col",
          name: "Footer",
          type: "footer",
          isHidden: false,
          settings: {
            //section_layout: "",
            content_alignment: "",
          },
          content: [],
        },
      ],
    },
  },
];

// export const QuestionTemplates: ElementNode[] = [
//   {
//     id: v4(),
//     styles: {},
//     className: "",
//     name: "Quiz 1",
//     type: "quizCanvas",
//     sectionType: "quiz",
//     preview: "",
//     isHidden: false,
//     settings: {
//       //section_layout: "columns",
//       section_full_bleed: false,
//     },
//     content: [
//       {
//         id: v4(),
//         styles: {},
//         className: "w-full overflow-hidden flex flex-col",
//         name: "Progress bar",
//         type: "progress_bar",
//         isHidden: false,
//         settings: {
//           //section_layout: "",
//           content_alignment: "",
//         },
//         content: [],
//       },

//       {
//         id: v4(),
//         styles: {
//           textAlign: "center",
//         },
//         className: "w-full overflow-hidden flex flex-col",
//         name: "Questions",
//         type: "questions",
//         isHidden: false,
//         settings: {
//           //section_layout: "",
//           content_alignment: "",
//           question_option_btn_color: "",
//         },
//         content: [],
//       },
//       {
//         id: v4(),
//         styles: {},
//         className: "w-full overflow-hidden flex flex-col",
//         name: "Footer",
//         type: "footer",
//         isHidden: false,
//         settings: {
//           //section_layout: "",
//           content_alignment: "",
//         },
//         content: [],
//       },
//     ],
//   },
// ];
