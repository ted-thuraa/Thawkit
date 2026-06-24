"use client";

import React from "react";
import { ChevronLeft, Bookmark } from "lucide-react";
import { ElementNode, QuestionField } from "@/stores/pageEditorStore/types";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { THEME_CLASSES } from "@/lib/constants/theme";

type Props = {
  selectedTabItem: QuestionField;
};

export default function InfoTabItem({ selectedTabItem }: Props) {
  // Mock image URL for demonstration. In a real app, use Next/Image.
  const imageUrl = "/assets/plantation.jpg";

  return (
    // Outer container to simulate the light background environment
    <div className="relative mx-auto  h-auto  flex items-center justify-center  px-1 lg:px-8 font-sans">
      {/* Main Card Container */}
      <div className="w-full rounded-[32px] overflow-hidden transition-all duration-300">
        {/* Article Image */}
        <div className="px-6 pt-4">
          <Image
            src={imageUrl}
            alt="Abstract mobile app design workspace"
            className="w-full aspect-[3/2] object-cover"
            height={600}
            width={800}
            // Rounded corner matching: Using rounded-2xl to match the inner image corners relative to the card border.
            style={{ borderRadius: "20px" }}
          />
        </div>

        {/* Article Content */}
        <div className="px-6 py-6 space-y-4">
          {/* Article Title */}
          <h2 className="text-xl font-extrabold  leading-snug">
            How to get started as a mobile app designer and get your first
            client?
          </h2>

          {/* Article Snippet / Excerpt */}
          <div className="text-sm space-y-4  leading-relaxed">
            {/* Typography: soft gray, readable line height (leading-relaxed for good readability) */}
            <p>
              Everyone wants to make the next great mobile app. It can be an
              extremely profitable way to make some money if you know what
              you're doing.
            </p>
            <p>
              If you’ve got a great mobile app idea and decided to consult with
              a developer or an app development company, you may have been
              surprised to hear how costly it is to outsource development.
            </p>
            <p>
              So that's when the thought hit you, "I can just do learn to do
              this myself."
            </p>
          </div>

          {/* Read More Button */}
          <div className="pt-4 pb-2">
            <button
              className={cn(
                "w-full py-4  rounded-xl text-base font-medium transition-all duration-200",
                THEME_CLASSES.button
              )}
              // Button styling: Black rounded button with white text, using rounded-xl for accuracy.
              style={{
                borderRadius: "12px",
                letterSpacing: "0.01em", // Subtle tracking adjustment
              }}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
