"use client";
import { Trash } from "lucide-react";

import { useState } from "react";
import CreateCategory from "./categoryEditor";
import { usePageBuilderStore } from "@/stores/pageEditorStore/store";
import DialogWrapper from "@/wrappers/dialog-wrapper";

const CategoryList = () => {
  const [hoveredId, setHoveredId] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [isThemeDialogOpen, setIsThemeDialogOpen] = useState(false);
  const {
    questions,
    categories,
    deleteQuestion,
    deleteCategory,
    setSelectedQuestion,
  } = usePageBuilderStore();
  const [dropDownOpen, setDropDownOpen] = useState(false);

  const handleNewCategory = () => {
    setIsCategoryDialogOpen(true);
  };

  const handleDeleteQuestion = (questionId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the onClick that sets selected question

    deleteQuestion(questionId); // This will remove the question
  };

  const handleDeleteCategory = (catId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the onClick that sets selected question
    deleteCategory(catId); // This will remove the question
  };
  return (
    <>
      <div className="mb-4 ">
        <div className="">
          {categories.map((cat) => (
            <div
              key={cat.id}
              //   onClick={() => setSelectedQuestion(cat)}
              onMouseEnter={() => setHoveredId(cat.id)}
              onMouseLeave={() => setHoveredId("")}
              className="group relative mb-1 py-2 px-1 flex items-center  flex-row  w-full gap-x-1 border border-input bg-white   text-editor-foreground  shadow rounded-sm cursor-pointer"
            >
              <DialogWrapper
                trigger={
                  <div className="p-0 w-full max-w-[150px] relative  flex flex-row items-center   rounded-sm cursor-pointer">
                    <p
                      className={`text-sm font-normal truncate whitespace-nowrap overflow-hidden cursor-pointer rounded-md transition-colors`}
                    >
                      {cat.order}.
                    </p>
                    <p
                      className={`flex-1 text-sm font-normal truncate whitespace-nowrap overflow-hidden cursor-pointer rounded-md transition-colors`}
                    >
                      {cat.title}
                    </p>
                  </div>
                }
                title="Edit category"
                description="Score questions"
                className="bg-sidebar"
              >
                <CreateCategory defaultData={cat} />
              </DialogWrapper>

              {hoveredId === cat.id && (
                <div className="absolute z-30 right-[2px] top-1 p-[0.4rem] bg-editor-component text-editor-foreground border-b border-editor-border shadow-md rounded-md">
                  <div className="flex flex-row flex-nowrap space-x-1.5">
                    <button
                      className="text-destructive"
                      onClick={(e) => handleDeleteCategory(cat.id, e)}
                    >
                      <Trash className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default CategoryList;
