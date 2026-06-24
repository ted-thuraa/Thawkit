import { ElementNode, SectionTemplates } from "@/stores/pageEditorStore/types";
import { v4 } from "uuid";

export const ProductListingTemplates: SectionTemplates[] = [
  {
    id: v4(),
    name: "",
    preview: "",
    properties: {},
    templateContent: {
      id: v4(),
      styles: {},
      className: "",
      name: "Product listing",
      type: "section",
      sectionType: "Product listing",
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
          className: "relative mx-auto max-w-6xl w-full  flex flex-col",
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
                    grid_columns: 3,
                    smart_layout_type: "product_item",
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
                        showItemPrice: true,
                      },
                      content: {
                        title: "Item title",
                        description: "Lorem ipsum",
                        price: 35,
                        href: "",
                        image: "",
                      },
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
                        showItemPrice: true,
                      },
                      content: {
                        title: "Item title",
                        description: "Lorem ipsum",
                        price: 35,
                        href: "",
                        image: "",
                      },
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
                        showItemPrice: true,
                      },
                      content: {
                        title: "Item title",
                        description: "Lorem ipsum",
                        price: 35,
                        href: "",
                        image: "",
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
