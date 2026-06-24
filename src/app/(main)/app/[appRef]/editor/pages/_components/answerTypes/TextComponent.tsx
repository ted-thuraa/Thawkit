import React, { useState, useCallback, memo } from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { QuestionField } from "@/stores/pageEditorStore/types";
interface TextQuestionProps {
  question: QuestionField;
}
const TextAnsTypeComponent = memo(({ question }: TextQuestionProps) => {
  const [charCount, setCharCount] = useState(0);
  const maxChars = question.settings?.max_char || 1000;
  const isMultiLine = question.settings?.multiple_line_text_input;

  return (
    <div className="w-full max-w-[35rem]  space-y-2">
      <div className="w-full  flex flex-col items-center justify-center space-y-2">
        {isMultiLine ? (
          <div className="w-full [--ring:var(--color-indigo-300)] *:not-first:mt-2 in-[.dark]:[--ring:var(--color-indigo-900)]">
            <Label htmlFor="text-answer">Type here</Label>
            <Textarea
              id="text-answer"
              placeholder="Type your answer here..."
              maxLength={maxChars}
              className={cn(
                "w-full min-h-[70px] p-4 text-gray-700",
                "border border-gray-200 rounded-lg resize-none",
                "focus:outline-none focus:ring-2 focus-visible:ring-[var(--color-primary)] focus:border-transparent",
                "placeholder:text-gray-400"
              )}
            />
          </div>
        ) : (
          // <textarea
          //   className={cn(
          //     "w-full min-h-[120px] p-4 text-gray-700",
          //     "border border-gray-200 rounded-lg resize-none",
          //     "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent",
          //     "placeholder:text-gray-400"
          //   )}
          //   placeholder="Type your answer here..."
          //   maxLength={maxChars}
          //   onChange={handleInput}
          // />
          // <input
          //   type="text"
          //   className={cn(
          //     "w-full h-12 px-4 text-gray-700",
          //     "border border-gray-200 rounded-lg",
          //     "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent",
          //     "placeholder:text-gray-400"
          //   )}
          //   placeholder="Type your answer here..."
          //   maxLength={maxChars}
          //   //onChange={handleInput}
          // />
          <div className="*:not-first:mt-2 w-full">
            <Label htmlFor="text-answer" className="text-xs mb-1">
              Type your answer here
            </Label>
            <Input
              id="text-answer"
              className={cn(
                "w-full h-11 p-4 text-gray-700",
                "border border-gray-200 rounded-lg resize-none",
                "focus:outline-none focus:ring-2 focus-visible:ring-[var(--color-primary)] focus:border-transparent",
                "placeholder:text-gray-400"
              )}
              placeholder="Type your answer here..."
              type="text"
              maxLength={maxChars}
            />
          </div>
        )}
      </div>

      {/* Character counter */}
      <div className="flex justify-end">
        <span
          className={cn(
            "text-sm",
            charCount >= maxChars ? "text-red-500" : "text-gray-500"
          )}
        >
          {charCount}/{maxChars} characters
        </span>
      </div>
    </div>
  );
});

export default TextAnsTypeComponent;
