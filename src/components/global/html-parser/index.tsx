import { cn, prioritizeStyles, hierarchicalClasses } from "@/lib/utils";
import parse, { HTMLReactParserOptions, Element } from "html-react-parser";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";

import get from "lodash.get";
import { usePageBuilderStore } from "@/stores/pageEditorStore/store";
import { resultDataDummy } from "@/lib/dummyData/resultPage";

// Define type for variable data structure
interface VariableData {
  [category: string]: {
    [key: string]: string | number;
  };
}

type HtmlParserProps = {
  html: string;
  isLive: boolean;
  editorContentClasses?: string;
  editorContentStyles?: React.CSSProperties;
};

export const HtmlParser = ({
  html,
  isLive,
  editorContentClasses,
  editorContentStyles,
}: HtmlParserProps) => {
  const [mounted, setMounted] = useState(false);
  const [processedHtml, setProcessedHtml] = useState("");

  // Get data from the store that will be used for variable substitution
  const { page, questions, categories, scoretiers } = usePageBuilderStore();
  // const { resultInfo } = useToolPublicStore();

  // Construct the lookup data context
  // In a real app, you might merge resultDataDummy with other stores
  const dataContext = useMemo(() => {
    // We flatten the arrays into maps for O(1) lookup if performance is critical,
    // but lodash.get handles paths like "categoryScores[0].score" or filters fine?
    // Actually, our VariableSelector generated specific paths based on IDs.

    // Issue: The Selector generated "categoryScores.UUID.score".
    // The Dummy data is an Array. We need a helper to resolve "UUID" to an index
    // or preprocess the data object to be keyed by ID.

    const context = { ...resultDataDummy };

    // Performance Optimization: Transform Arrays to Objects keyed by ID
    const keyedCategories = context.categoryScores.reduce((acc: any, item) => {
      acc[item.categoryId] = item;
      return acc;
    }, {});

    const keyedQuestions = context.questionsData.reduce((acc: any, item) => {
      acc[item.id] = item;
      return acc;
    }, {});

    return {
      ...context,
      categoryScores: keyedCategories, // Now we can access categoryScores['uuid'].score
      questionsData: keyedQuestions,
    };
  }, []);

  useEffect(() => {
    // Process dynamic variables on mount and when html changes
    if (html) {
      setProcessedHtml(html);
    } else {
      setProcessedHtml("");
    }

    setMounted(true);
  }, [html]);

  const options: HTMLReactParserOptions = {
    replace: (domNode) => {
      if (domNode instanceof Element && domNode.attribs) {
        // 1. VARIABLE REPLACEMENT
        if (
          domNode.name === "span" &&
          domNode.attribs["data-type"] === "variable"
        ) {
          const path = domNode.attribs["data-id"]; // e.g., "categoryScores.uuid-123.score"
          const fallbackLabel = domNode.attribs["data-label"];

          // Retrieve value safely
          const value = get(dataContext, path);

          // Styling for the rendered variable (optional: make it bold or just text)
          // If value is missing, show fallback or empty
          const displayValue =
            value !== undefined ? value : isLive ? "" : fallbackLabel;

          return (
            <span className="font-semibold text-primary">{displayValue}</span>
          );
        }
        if (domNode.name === "img") {
          const { src, alt, width, height } = domNode.attribs;

          return (
            <Image
              src={src}
              alt={alt || ""}
              width={parseInt(width) || 500}
              height={parseInt(height) || 300}
              layout="responsive"
              objectFit="contain"
            />
          );
        }

        if (domNode.name === "iframe") {
          const { src, width, height, allowfullscreen } = domNode.attribs;
          return (
            <iframe
              src={src}
              width={width || "100%"}
              height={height || "315"}
              allowFullScreen={allowfullscreen !== undefined}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            ></iframe>
          );
        }
      }
    },
  };

  return (
    <div
      className={hierarchicalClasses(
        "prose prose-lg max-w-none",
        editorContentClasses
      )}
      style={prioritizeStyles(editorContentStyles)}
    >
      {mounted && processedHtml && parse(processedHtml, options)}
    </div>
  );
};
