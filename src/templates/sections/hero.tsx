import { useFunnelStore } from "@/stores/funnelStore/store";
import { HeroSectionContent, PageSection } from "@/types/PageCMS/pageSchema";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

type Props = {
  section: PageSection;
  pageId: string;
};

export const Hero1 = ({ section, pageId }: Props) => {
  const nextStep = useFunnelStore((s) => s.nextStep);
  const content: HeroSectionContent = section.content as HeroSectionContent;
  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
      {/* Left Content */}
      <div className="max-w-xl">
        {/* <StarRating /> */}

        <h1
          className="text-5xl lg:text-[3.5rem] leading-[1.15] mb-6"
          style={{
            color: "var(--tk-text-heading)",
            fontFamily: "var(--tk-font-heading)",
            fontWeight:
              "var(--tk-font-heading-weight)" as React.CSSProperties["fontWeight"],
          }}
        >
          {content?.heading}
        </h1>

        <p
          className="text-base lg:text-lg leading-relaxed mb-10 max-w-lg"
          style={{ color: "var(--tk-text-body)" }}
        >
          {content?.subtext}
        </p>

        <div className="flex items-center gap-4">
          {/* Primary CTA — triggers soft navigation to step 1 */}
          <button
            onClick={nextStep}
            className="font-semibold px-8 py-4 rounded-full text-base
                       transition-all duration-200 hover:brightness-90 active:scale-95"
            style={{
              backgroundColor: "var(--tk-accent-primary)",
              color: "var(--tk-accent-primary-fg)",
              boxShadow: "0 10px 25px -8px var(--tk-accent-primary-border)",
            }}
            aria-label={content?.primary_cta?.label ?? "Get Started"}
          >
            {content?.primary_cta?.label ?? "Get Started"}
          </button>

          {/* Secondary CTA (optional) */}
          {content?.secondary_cta && (
            <button
              className="border-2 font-semibold px-8 py-4 rounded-full text-base
                         transition-all duration-200 bg-white hover:brightness-95"
              style={{
                borderColor: "var(--tk-accent-secondary)",
                color: "var(--tk-accent-secondary)",
              }}
            >
              {content.secondary_cta.label}
            </button>
          )}
        </div>
      </div>

      {/* Right Image */}
      <div className="relative h-[500px] w-full bg-gray-100 rounded-[2.5rem] overflow-hidden shadow-sm">
        <Image
          src="/assets/plantation.jpg"
          alt="Man working on laptop"
          className="absolute inset-0 w-full h-full object-cover object-center"
          // Fallback styling
          style={{ backgroundColor: "#e5e7eb" }}
          width={1200}
          height={1200}
        />
      </div>
    </section>
  );
};
