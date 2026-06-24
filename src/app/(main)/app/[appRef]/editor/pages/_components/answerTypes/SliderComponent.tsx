import React, { useCallback, useState, memo } from "react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { QuestionField } from "@/stores/pageEditorStore/types";

interface RangeQuestionProps {
  question: QuestionField;
}

const SliderComponent = memo(({ question }: RangeQuestionProps) => {
  const [value, setValue] = useState<number>(question.settings?.default || 0);

  const min = question.settings?.rangeMin || 0;
  const max = question.settings?.rangeMax || 10;
  const startingVal = question.settings?.startingValue || 0;
  const labels = question.settings?.rangeLabels;
  const showLabels = question.settings?.showLabels;

  const ansType = question.settings?.anstype;
  const skipInterval = 2; // Set to 1 to allow no text skipping

  const handleSliderChange = useCallback((newValue: number) => {
    setValue(newValue);
  }, []);

  const ticks = [...Array(max + 1)].map((_, i) => i);

  const renderSlider = () => (
    <div className="*:not-first:mt-4 cursor-pointer">
      {/* <Label>Slider with ticks</Label> */}
      <div>
        <span
          className="text-muted-foreground mb-3 flex w-full items-center justify-between gap-2 text-xs font-medium"
          aria-hidden="true"
        >
          {labels?.left && <span>{labels?.left}</span>}
          {labels?.center && <span>{labels?.center}</span>}
          {labels?.right && <span>{labels?.right}</span>}
        </span>
        <Slider
          defaultValue={[startingVal]}
          max={max}
          min={min}
          aria-label="Slider with ticks"
        />
        <span
          className="text-muted-foreground mt-3 flex w-full items-center justify-between gap-1 px-2.5 text-xs font-medium"
          aria-hidden="true"
        >
          {ticks.map((_, i) => (
            <span
              key={i}
              className="flex w-0 flex-col items-center justify-center gap-2"
            >
              <span
                className={cn(
                  "bg-muted-foreground/70 h-1 w-px",
                  i % skipInterval !== 0 && "h-0.5"
                )}
              />
              <span className={cn(i % skipInterval !== 0 && "opacity-1")}>
                {i}
              </span>
            </span>
          ))}
        </span>
      </div>
    </div>

    // <div className="w-full space-y-6">
    //   {/* Custom styled slider */}
    //   <div className="relative w-full">
    //     <input
    //       type="range"
    //       min={min}
    //       max={max}
    //       value={value}
    //       onChange={(e) => handleSliderChange(Number(e.target.value))}
    //       className={cn(
    //         "w-full h-2 appearance-none bg-gray-200 rounded-lg",
    //         "focus:outline-none focus:ring-2 focus:ring-indigo-500",
    //         "[&::-webkit-slider-thumb]:appearance-none",
    //         "[&::-webkit-slider-thumb]:w-6",
    //         "[&::-webkit-slider-thumb]:h-6",
    //         "[&::-webkit-slider-thumb]:bg-indigo-600",
    //         "[&::-webkit-slider-thumb]:rounded-full",
    //         "[&::-webkit-slider-thumb]:cursor-pointer",
    //         "[&::-webkit-slider-thumb]:border-0",
    //         "[&::-webkit-slider-thumb]:transition-all",
    //         "[&::-webkit-slider-thumb]:duration-150",
    //         "[&::-webkit-slider-thumb]:hover:bg-indigo-700"
    //       )}
    //     />

    //     {/* Current value bubble */}
    //     <div
    //       className="absolute -top-8 transform -translate-x-1/2 px-2 py-1 bg-indigo-600 text-white rounded text-sm"
    //       style={{ left: `${((value - min) / (max - min)) * 100}%` }}
    //     >
    //       {value}
    //     </div>
    //   </div>

    //   {/* Labels */}
    //   {showLabels && (
    //     <div className="flex justify-between px-2">
    //       <span className="text-sm text-gray-600">{labels[0] || min}</span>
    //       {labels[1] && (
    //         <span className="text-sm text-gray-600">{labels[1]}</span>
    //       )}
    //       <span className="text-sm text-gray-600">{labels[2] || max}</span>
    //     </div>
    //   )}
    // </div>
  );

  return <div className="w-full max-w-[35rem] py-6">{renderSlider()}</div>;
});

export default SliderComponent;
