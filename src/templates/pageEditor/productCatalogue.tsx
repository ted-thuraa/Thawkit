import { SectionTemplates } from "@/stores/pageEditorStore/types";
import { nanoid } from "nanoid";

const genId = (): string => nanoid(8);

export const ProductsCatalogueTemplates: SectionTemplates[] = [
  {
    id: genId(),
    name: "",
    preview: "",
    properties: {},
    templateContent: {
      id: `section-${nanoid(8)}`,
      styles: {
        minHeight: "85vh",
      },
      className: "py-24 px-6  md:px-8  min-h-[40rem]",
      name: "catalogue 1",
      type: "section",
      sectionType: "catalogue",
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
          id: `container-${nanoid(8)}`,
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
              id: `catalogue-${nanoid(8)}`,
              styles: {},
              className: "",
              name: "",
              type: "productCatalogue",
              isHidden: false,
              settings: {},
              content: [],
            },
          ],
        },
      ],
    },
  },
];
