import { ElementNode, SectionTemplates } from "@/stores/pageEditorStore/types";
import { v4 } from "uuid";

export const NavTemplates: SectionTemplates[] = [
  {
    id: v4(),
    name: "",
    preview: "",
    properties: {},
    templateContent: {
      id: v4(),
      styles: {},
      className: "",
      name: "Nav 1",
      type: "navigation",
      sectionType: "Navigation",
      preview: "",
      isHidden: false,
      settings: {
        //section_layout: "columns",
        section_full_bleed: false,
        backgroundType: "color",
        backgroundSource: undefined,
        section_layout: "block",
        itemsHorizontalAlignment: "flex-start",
      },
      content: [
        {
          id: v4(),
          styles: {
            maxWidth: "100%",
          },
          className: "w-[auto] h-[24px]",
          name: "",
          type: "image",
          isHidden: false,
          settings: {
            imageResizable: false,
            //media_sub_category: "normal_image",
            mediaResizeMaxWidth: 60,
            mediaResizeMaxHeight: 60,
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
      name: "Nav 2",
      type: "navigation",
      sectionType: "Navigation",
      preview: "",
      isHidden: false,
      settings: {
        //section_layout: "columns",
        section_full_bleed: false,
        backgroundType: "color",
        backgroundSource: undefined,
        section_layout: "block",
        itemsHorizontalAlignment: "flex-start",
      },
      content: [
        {
          id: v4(),
          styles: {
            maxWidth: "100%",
          },
          className: "w-[auto] h-[24px]",
          name: "",
          type: "image",
          isHidden: false,
          settings: {
            imageResizable: false,
            //media_sub_category: "normal_image",
            mediaResizeMaxWidth: 60,
            mediaResizeMaxHeight: 60,
          },
          content: {
            src: "/assets/editor/dummy_company_1_logo.svg",
            innerText: "logo",
            width: 400,
            height: 400,
          },
        },
        {
          id: v4(),
          styles: {},
          className: "md:justify-end",
          name: "",
          type: "links",
          isHidden: false,
          settings: {
            link_type: "text",
          },
          content: [
            {
              id: v4(),
              styles: {},
              className:
                "no-underline tracking-[0.025em] text-[16px] font-normal",
              name: "",
              type: "layout_item",
              isHidden: false,
              settings: {},
              content: {
                href: "#",
                innerText: "Features",
              },
            },
            {
              id: v4(),
              styles: {},
              className:
                "no-underline tracking-[0.025em] text-[16px] font-normal",
              name: "",
              type: "layout_item",
              isHidden: false,
              settings: {},
              content: {
                href: "#",
                innerText: "Pricing",
              },
            },
            {
              id: v4(),
              styles: {},
              className:
                "no-underline tracking-[0.025em] text-[16px] font-normal",
              name: "",
              type: "layout_item",
              isHidden: false,
              settings: {},
              content: {
                href: "#",
                innerText: "About",
              },
            },
            {
              id: v4(),
              styles: {},
              className:
                "no-underline tracking-[0.025em] text-[16px] font-normal",
              name: "",
              type: "layout_item",
              isHidden: false,
              settings: {},
              content: {
                href: "#",
                innerText: "Blog",
              },
            },
            {
              id: v4(),
              styles: {},
              className:
                "no-underline tracking-[0.025em] text-[16px] font-normal",
              name: "",
              type: "layout_item",
              isHidden: false,
              settings: {},
              content: {
                href: "#",
                innerText: "Contact",
              },
            },
          ],
        },
        {
          id: v4(),
          styles: {},
          className: "w-fit",
          name: "",
          type: "buttons",
          layoutType: "",
          isHidden: false,
          settings: {
            itemsHorizontalAlignment: "center",
          },
          content: [
            {
              id: v4(),
              styles: {},
              className:
                " inline-flex justify-center items-center text-center outline-none m-[1px] h-[36px] px-[16px] rounded-[8px] shadow-sm",
              name: "",
              type: "button_item",
              isHidden: false,
              settings: {
                btn_action: "go_to_questions",
                btn_style: "default",
              },
              content: {
                href: "/questions",
                innerText: "Get started",
              },
            },
          ],
        },
      ],
    },
  },
];
