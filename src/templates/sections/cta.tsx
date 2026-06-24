import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PageSection } from "@/types/PageCMS/pageSchema";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

type Props = {
  section: PageSection;
};

export const Cta1 = ({ section }: Props) => {
  return (
    <section className=" font-sans">
      <div className=" ">
        {/* Main Card Container */}
        <div className="max-w-6xl mx-auto bg-[#0b3d36] rounded-[40px] p-10 md:p-16 lg:p-20 flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Left Column: Text Content */}
          <div className="flex-1 max-w-xl">
            <h2 className="text-4xl md:text-5xl font-medium text-white mb-6 leading-[1.1] tracking-tight">
              Subscribe our newsletter
            </h2>
            <p className="text-zinc-400 text-sm md:text-base leading-relaxed max-w-md">
              Subscribe to our newsletter and be the first to receive insights,
              updates, and expert tips on optimizing your financial management.
            </p>
          </div>

          {/* Right Column: Form Content */}
          <div className="w-full lg:w-auto flex flex-col gap-4 min-w-[320px] md:min-w-[440px]">
            <p className="text-zinc-400 text-sm mb-1 ml-1">Stay up to date</p>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              {/* Custom Styled Input */}
              <div className="relative w-full">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full bg-[#1a4b44] border-none text-zinc-300 placeholder:text-zinc-500 rounded-full py-4 px-6 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                />
              </div>

              {/* Action Button */}
              <button className="w-full sm:w-auto bg-[#c5f0a4] hover:bg-[#b5e692] text-[#0b3d36] font-semibold py-4 px-8 rounded-full transition-colors whitespace-nowrap">
                Subscribe
              </button>
            </div>

            {/* Disclaimer / Privacy Policy */}
            <p className="text-[11px] md:text-xs text-zinc-500 mt-2 text-center lg:text-left">
              By subscribing you agree to our{" "}
              <a
                href="#"
                className="underline underline-offset-2 hover:text-zinc-300 transition-colors"
              >
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
