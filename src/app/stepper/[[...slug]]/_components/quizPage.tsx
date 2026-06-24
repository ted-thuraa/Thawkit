"use client";
import React, { useState } from "react";
import { ArrowLeft, X } from "lucide-react";

export default function QuizPageClient() {
  const [selectedOption, setSelectedOption] = useState("Equities");

  const options = [
    {
      id: "Equities",
      title: "Equities",
      description: "Recommended for long term investment",
    },
    {
      id: "Crypto",
      title: "Crypto",
      description: "Risky sector with high potential returns",
    },
    {
      id: "Equity + Crypto",
      title: "Equity + Crypto",
      description: "Recommended if you prefer stable returns",
    },
  ];

  return (
    // Outer Desktop Wrapper: Centers the UI on larger screens
    <div className="min-h-screen bg-[#F4EFE6] flex items-center justify-center  font-sans antialiased">
      {/* App Container: Mobile UI Frame */}
      <div className="w-full max-w-md md:max-w-lg  flex flex-col relative ">
        {/* Header */}
        <header className="flex justify-between items-center p-6 pt-8">
          <button
            className="p-3 border border-gray-300 rounded-2xl bg-transparent hover:bg-white/50 transition-colors focus:outline-none"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5 text-gray-800" strokeWidth={2} />
          </button>

          {/* Pagination Dots */}
          <div className="flex gap-1.5 items-center">
            <div className="w-3 h-1.5 rounded-full bg-gray-800" />
            <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
            <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
          </div>

          <button
            className="p-2 text-gray-800 hover:bg-black/5 rounded-full transition-colors focus:outline-none"
            aria-label="Close"
          >
            <X className="w-6 h-6" strokeWidth={2} />
          </button>
        </header>

        {/* Main Content */}
        <main className="flex-1 px-6 flex flex-col">
          {/* Titles */}
          <div className="mt-2 mb-8">
            <p className="text-[#BE6B42] text-sm font-medium mb-3">
              Spendings Limits
            </p>
            <h1 className="text-[2.75rem] leading-[1.1] font-medium text-[#1A1A1A] tracking-tight">
              What do you <br /> want to invest in?
            </h1>
          </div>

          {/* Selection List */}
          <div className="flex flex-col gap-4">
            {options.map((option) => {
              const isSelected = selectedOption === option.id;

              return (
                <button
                  key={option.id}
                  onClick={() => setSelectedOption(option.id)}
                  className={`flex items-center text-left w-full p-5 rounded-[1.25rem] transition-all duration-200 border focus:outline-none focus:ring-2 focus:ring-[#C87A5B]/50 ${
                    isSelected
                      ? "bg-[#FDF4EC] border-[#C87A5B]"
                      : "bg-white border-transparent shadow-sm hover:shadow-md"
                  }`}
                >
                  {/* Radio Icon */}
                  <div className="flex-shrink-0 mr-4 flex items-center justify-center">
                    <div className="w-5 h-5 rounded-full border-[1.5px] border-[#C87A5B] flex items-center justify-center">
                      {isSelected && (
                        <div className="w-2.5 h-2.5 rounded-full bg-[#C87A5B]" />
                      )}
                    </div>
                  </div>

                  {/* Option Text */}
                  <div>
                    <h3 className="text-[#1A1A1A] text-lg font-medium mb-0.5">
                      {option.title}
                    </h3>
                    <p className="text-gray-500 text-[13px] leading-snug">
                      {option.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </main>

        {/* Footer */}
        <footer className="p-6 pb-8 mt-auto w-full">
          <button className="w-full py-4 bg-[#231F1E] text-white rounded-[1.25rem] font-medium text-lg hover:bg-black transition-colors focus:outline-none focus:ring-4 focus:ring-gray-300">
            Proceed
          </button>
        </footer>
      </div>
    </div>
  );
}
