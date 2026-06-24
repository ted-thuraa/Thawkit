"use client";
import { Plus, Trash2, ArrowBigDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCallback, useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { v4 } from "uuid";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { DialogProvider, useDialog } from "@/providers/dialog-provider";
import Link from "next/link";
import { ElementNode } from "@/stores/pageEditorStore/types";
import { usePageBuilderStore } from "@/stores/pageEditorStore/store";
import { isValidTweetUrl } from "@/lib/utils/tweetUtils";

// You can place these SVG components outside the main component for clarity
const ValidIcon = () => (
  <svg
    className="w-5 h-5 text-green-500"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M5 13l4 4L19 7"
    ></path>
  </svg>
);

const InvalidIcon = () => (
  <svg
    className="w-5 h-5 text-red-500"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    ></path>
  </svg>
);

const CloseIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M6 18L18 6M6 6l12 12"
    ></path>
  </svg>
);

const SuccessIcon = () => (
  <svg
    className="w-6 h-6 text-green-500 mr-3"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    ></path>
  </svg>
);

const TweetLinkFormModal = ({ section }: { section: ElementNode }) => {
  const { livemode, previewMode, addLayoutItem } = usePageBuilderStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tweetUrl, setTweetUrl] = useState("");
  const [isUrlValid, setIsUrlValid] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // --- State Reset ---
  const resetForm = useCallback(() => {
    setTweetUrl("");
    setIsUrlValid(false);
    setShowValidation(false);
    setShowSuccess(false);
  }, []);

  // --- Event Handlers ---
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setTweetUrl(url);
    setShowValidation(true);
    setIsUrlValid(isValidTweetUrl(url));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (livemode || previewMode) return;
    if (!isUrlValid) return;
    const newNode: ElementNode = {
      id: v4(),
      styles: {},
      className: "",
      name: "Testimonial Item",
      type: "testimonial_item",
      isHidden: false,
      settings: {
        testimonalType: "tweet_testimonial",
      },
      content: {
        href: tweetUrl,
      },
    };

    addLayoutItem(section.id, newNode);

    setShowSuccess(true);
    //setTimeout(closeModal, 2000); // Close modal after showing success
  };

  // --- Dynamic Styles ---
  const inputBorderColor = showValidation
    ? isUrlValid
      ? "border-green-500"
      : "border-red-500"
    : "border-gray-300";

  return (
    <>
      {/* Modal Content */}
      <div
        className={`  w-full max-w-md mx-auto  `}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside content
      >
        <div className="">
          {/* Modal Header */}
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold text-gray-800">
              Add a Tweet Link
            </h2>
            <button className="text-gray-400 hover:text-gray-600 transition-colors">
              <CloseIcon />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate>
            <div>
              <label
                htmlFor="tweetUrl"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Tweet URL
              </label>
              <div className="relative">
                <input
                  type="url"
                  id="tweetUrl"
                  name="tweetUrl"
                  value={tweetUrl}
                  onChange={handleUrlChange}
                  placeholder="https://x.com/user/status/..."
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow ${inputBorderColor}`}
                  required
                  autoFocus
                />
                <div
                  className={`absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none transition-opacity ${showValidation ? "opacity-100" : "opacity-0"}`}
                >
                  {isUrlValid ? <ValidIcon /> : <InvalidIcon />}
                </div>
              </div>
              <p className="text-sm text-red-600 mt-2 h-5">
                {showValidation && !isUrlValid && tweetUrl.length > 0
                  ? "Please enter a valid Tweet URL."
                  : ""}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex justify-end space-x-4">
              <button
                type="button"
                className="px-6 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-4 focus:ring-gray-200 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!isUrlValid}
                className="px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all disabled:bg-blue-300 disabled:cursor-not-allowed"
              >
                Save Link
              </button>
            </div>
          </form>
        </div>
        {/* Success Message */}
        {showSuccess && (
          <div className="p-6 bg-green-50 border-t border-green-200 rounded-b-2xl">
            <div className="flex items-center">
              <SuccessIcon />
              <p className="text-green-800 font-semibold">
                Tweet URL saved successfully!
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default TweetLinkFormModal;
