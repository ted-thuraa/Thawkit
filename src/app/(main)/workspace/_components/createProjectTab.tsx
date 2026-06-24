"use client";
import { Button } from "@/components/ui/button";
import { createProjectCards } from "@/lib/constants";
import useCreateProjectPage from "@/stores/createProjectStore/store";
import React, { useEffect } from "react";
type props = {
  onSelectOption: (option: string) => void;
};
const ProjectCreatePage = ({ onSelectOption }: props) => {
  const { setPage } = useCreateProjectPage();

  useEffect(() => {
    setPage("create-scratch");
  }, []);

  return (
    <div className="flex-1 overflow-auto">
      <div className="mx-auto max-w-5xl px-8 py-16">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-semibold text-gray-900 mb-3">
            How would you like to get started
          </h1>
          <p className="text-gray-600">Choose your preferred method to begin</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {createProjectCards.map((option) => (
            <div
              key={option.type}
              className={`${option.highlight ? "border border-indigo-600" : "border hover:border-indigo-600"} relative overflow-hidden rounded-2xl border border-gray-100 p-8
                transition-all duration-300 hover:shadow-lg`}
            >
              <div className="flex h-full flex-col justify-between">
                <div className="mb-8">
                  <div className="flex flex-row items-center gap-x-2">
                    <h3 className={`text-xl font-semibold text-gray-900`}>
                      {option.title}
                    </h3>
                    <h3
                      className={`${option.highlight ? "text-indigo-600 " : "text-foreground"} text-xl font-bold`}
                    >
                      {option.highlightedText}
                    </h3>
                  </div>

                  <p className="text-gray-600">{option.description}</p>
                </div>
                <Button
                  variant={option.highlight ? "default" : "outline"}
                  size={"sm"}
                  onClick={() => onSelectOption(option.type)}
                  className={`
                    rounded-full px-5 py-2.5 text-sm font-medium 
                    transition-all duration-300 w-fit 
                    ${option.highlight ? `bg-primary text-white hover:opacity-90` : "bg-white border border-gray-200 text-gray-900 hover:bg-gray-50"}
                  `}
                >
                  {option.highlight ? "Generate" : "Continue"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectCreatePage;
