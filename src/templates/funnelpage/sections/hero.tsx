import { useFunnelStore } from "@/stores/funnelStore/store";
import { HeroSectionContent, PageSection } from "@/types/PageCMS/pageSchema";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  FunnelButton,
  FunnelButtonContainer,
} from "../components/FunnelButton";
import { FunnelSection } from "../components/FunnelSection";

type Props = {
  section: PageSection;
  pageId: string;
};

export const HeroSplitLeft_v1 = ({ section, pageId }: Props) => {
  const nextStep = useFunnelStore((s) => s.nextStep);
  const content: HeroSectionContent = section.content as HeroSectionContent;
  return (
    <FunnelSection
      as="section"
      stepId={`${pageId}-hero-split-left`}
      maxWidth="full"
      padding="none"
      gap="none"
      align="start"
      className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center"
    >
      {/* Left Content */}
      <div className="max-w-xl">
        <h1
          className="max-w-3xl text-2xl sm:text-4xl md:text-5xl leading-[1.15] mb-6"
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

        {/* Original: <div className="flex items-center gap-4"> */}
        <FunnelButtonContainer
          layout="inline"
          justify="start"
          gap="md"
          className="items-center"
        >
          {/* variant="primary" size="lg" + className="font-medium" reproduces
              the original pill CTA exactly — the only delta from the token
              default is font-medium instead of font-semibold. */}
          <FunnelButton
            variant="primary"
            size="lg"
            className="font-medium"
            analyticsId={`${pageId}-hero-primary-cta`}
            onClick={nextStep}
            aria-label={content?.primary_cta?.label ?? "Get Started"}
          >
            {content?.primary_cta?.label ?? "Get Started"}
          </FunnelButton>

          {/* variant="secondary" size="lg" is a pixel-exact match with zero
              overrides — border-2 + hover:brightness-95 + bg-white via
              buttonThemeStyle already matches the original inline style. */}
          {content?.secondary_cta && (
            <FunnelButton
              variant="secondary"
              size="lg"
              analyticsId={`${pageId}-hero-secondary-cta`}
            >
              {content.secondary_cta.label}
            </FunnelButton>
          )}
        </FunnelButtonContainer>
      </div>

      {/* Right Image — unchanged; not a card or button, nothing to map it to */}
      <div className="relative h-[500px] w-full bg-gray-100 rounded-[2.5rem] overflow-hidden shadow-sm">
        <Image
          src="/assets/plantation.jpg"
          alt="Man working on laptop"
          className="absolute inset-0 w-full h-full object-cover object-center"
          style={{ backgroundColor: "#e5e7eb" }}
          width={1200}
          height={1200}
        />
      </div>
    </FunnelSection>
  );
};

export const HeroCentered_v1 = ({ section, pageId }: Props) => {
  const nextStep = useFunnelStore((s) => s.nextStep);
  const content: HeroSectionContent = section.content as HeroSectionContent;
  return (
    <FunnelSection
      as="section"
      id="home" // preserved as a real anchor id — not replaced by stepId
      stepId={`${pageId}-hero-centered`}
      maxWidth="full"
      padding="none"
      gap="none"
      align="start"
      className="grid grid-cols-1 items-center"
    >
      <div className="">
        <div className=" *:p-[0.5px]  relative">
          <div className="grid grid-cols-10 gap-px">
            <div className="col-span-10">
              <div
                className="px-3 py-4 text-center sm:px-0 sm:py-12"
                data-grid-content="true"
              >
                <div className="relative mx-auto max-w-4xl text-center">
                  <h1
                    className="max-w-3xl mx-auto flex flex-col items-center gap-1 text-balance font-medium text-2xl text-foreground sm:text-4xl md:text-5xl"
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
                    className="mx-auto mt-5 mb-9 max-w-2xl text-balance font-normal text-base text-muted-foreground sm:mt-7 sm:text-lg"
                    style={{ color: "var(--tk-text-body)" }}
                  >
                    {content?.subtext}
                  </p>

                  {/* Original: <div className="flex w-full flex-col items-center
                      justify-center gap-4 sm:w-auto sm:flex-row"> */}
                  <FunnelButtonContainer
                    layout="responsive"
                    justify="center"
                    gap="md"
                    className="items-center sm:w-auto"
                  >
                    {/* Bespoke shadcn-style compact button — a genuinely
                        different design language from the pill CTAs
                        elsewhere. variant="unstyled" opts fully out of the
                        token variant scale; every visual class below is
                        preserved verbatim from the original. */}
                    <FunnelButton
                      variant="unstyled"
                      size="none"
                      analyticsId={`${pageId}-hero-primary-cta`}
                      onClick={nextStep}
                      aria-label={content?.primary_cta?.label ?? "Get Started"}
                      className="inline-flex cursor-pointer items-center justify-center whitespace-nowrap font-medium transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0 rounded-md focus-visible:ring-1 focus-visible:ring-ring active:scale-[0.99] active:transition-none h-9 px-4 py-2 text-base border border-transparent shadow-black/15 shadow-sm ring-1 ring-foreground/10 duration-200 hover:bg-muted/50 w-full gap-2 bg-white pr-3.5 pl-5 sm:w-auto"
                      style={{
                        backgroundColor: "var(--tk-accent-primary)",
                        color: "var(--tk-accent-primary-fg)",
                        boxShadow:
                          "0 10px 25px -8px var(--tk-accent-primary-border)",
                      }}
                    >
                      {content?.primary_cta?.label ?? "Get Started"}
                    </FunnelButton>

                    {content?.secondary_cta && (
                      <FunnelButton
                        variant="unstyled"
                        size="none"
                        analyticsId={`${pageId}-hero-secondary-cta`}
                        className="cursor-pointer justify-center whitespace-nowrap font-medium transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0 rounded-md duration-150 focus-visible:ring-1 focus-visible:ring-ring active:scale-[0.99] active:transition-none h-9 py-2 text-base border-[0.5px]  flex w-full items-center gap-2 px-5 sm:w-auto"
                        style={{
                          borderColor: "var(--tk-accent-secondary)",
                          color: "var(--tk-accent-secondary)",
                        }}
                      >
                        {content.secondary_cta.label}
                      </FunnelButton>
                    )}
                  </FunnelButtonContainer>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Unchanged below: hero image + 4-box feature mosaic ──
            Intentionally NOT wrapped in FunnelCardContainer/FunnelCardContent.
            FunnelCardContainer would add a border/radius/background this
            mosaic doesn't have. FunnelCardContent would force
            `color: var(--tk-text-body)` onto all four boxes' text — but only
            box 1 currently opts into theme tokens; boxes 2–4 use
            text-muted-foreground / inherited color. Applying it uniformly
            would silently change how 3 of the 4 boxes render, which is a
            real visual change, not a refactor. Flagging this as something
            worth a deliberate decision, not folding it in here. */}
        <div className="mx-auto w-full max-w-276 lg:min-w-5xl xl:min-w-276 p-[0.5px]">
          <div className="h-full rounded bg-background/75" data-slot="content">
            <div className="relative h-[316px] w-full overflow-hidden rounded-sm bg-white sm:h-[395px] md:h-[528px] lg:h-[556px] xl:h-[556px]">
              <Image
                src="/assets/imageplaceholder.svg"
                alt={""}
                width={800}
                height={500}
                className="size-full object-cover opacity-50"
              />
            </div>
          </div>
        </div>

        <div className="@container mt-6 mx-auto w-full max-w-276 lg:min-w-5xl xl:min-w-276 p-[0.5px] grid grid-cols-[auto_1fr_auto] lg:grid-cols-[1fr_minmax(0,69rem)_1fr]">
          <div className="mx-auto w-full max-w-276 lg:min-w-5xl xl:min-w-276">
            <div className="grid *:p-[0.5px] **:data-grid-content:h-full **:data-grid-content:rounded  relative">
              <div className="grid @md:grid-cols-2 @xl:grid-cols-4 gap-px">
                <div className="@4xl:p-6 p-4" data-grid-content="true">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 256 256"
                        className="size-4 text-foreground"
                      >
                        <path
                          d="M204,168a28,28,0,0,0,12-2.69V208a8,8,0,0,1-8,8H64a8,8,0,0,1-8-8V165.31a28,28,0,1,1,0-50.62V72a8,8,0,0,1,8-8h46.69a28,28,0,1,1,50.61,0H208a8,8,0,0,1,8,8v42.69A28,28,0,1,0,204,168Z"
                          opacity="0.2"
                        ></path>
                        <path d="M220.27,158.54a8,8,0,0,0-7.7-.46,20,20,0,1,1,0-36.16A8,8,0,0,0,224,114.69V72a16,16,0,0,0-16-16H171.78a35.36,35.36,0,0,0,.22-4,36.15,36.15,0,0,0-11.36-26.25,36,36,0,0,0-60.55,23.63,36.56,36.56,0,0,0,.14,6.62H64A16,16,0,0,0,48,72v32.22a35.36,35.36,0,0,0-4-.22,36.12,36.12,0,0,0-26.24,11.36,35.7,35.7,0,0,0-9.69,27,36.08,36.08,0,0,0,33.31,33.6,36.56,36.56,0,0,0,6.62-.14V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V165.31A8,8,0,0,0,220.27,158.54ZM208,208H64V165.31a8,8,0,0,0-11.43-7.23,20,20,0,1,1,0-36.16A8,8,0,0,0,64,114.69V72h46.69a8,8,0,0,0,7.23-11.43,20,20,0,1,1,36.16,0A8,8,0,0,0,161.31,72H208v32.23a35.68,35.68,0,0,0-6.62-.14A36,36,0,0,0,204,176a35.36,35.36,0,0,0,4-.22Z"></path>
                      </svg>
                      <h3
                        className="font-medium text-sm"
                        style={{
                          color: "var(--tk-text-heading)",
                          fontFamily: "var(--tk-font-heading)",
                          fontWeight:
                            "var(--tk-font-heading-weight)" as React.CSSProperties["fontWeight"],
                        }}
                      >
                        Content Gap Analysis
                      </h3>
                    </div>
                    <p
                      className="text-muted-foreground text-sm"
                      style={{ color: "var(--tk-text-body)" }}
                    >
                      Map your content against AI responses to see where you
                      cover the answer and where you don't.
                    </p>
                  </div>
                </div>

                <div className="@4xl:p-6 p-4" data-grid-content="true">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 256 256"
                        className="size-4 text-foreground"
                      >
                        <path
                          d="M224,56V216l-32-16-32,16-32-16L96,216,64,200,32,216V56a8,8,0,0,1,8-8H216A8,8,0,0,1,224,56Z"
                          opacity="0.2"
                        ></path>
                        <path d="M216,40H40A16,16,0,0,0,24,56V216a8,8,0,0,0,11.58,7.16L64,208.94l28.42,14.22a8,8,0,0,0,7.16,0L128,208.94l28.42,14.22a8,8,0,0,0,7.16,0L192,208.94l28.42,14.22A8,8,0,0,0,232,216V56A16,16,0,0,0,216,40Zm0,163.06-20.42-10.22a8,8,0,0,0-7.16,0L160,207.06l-28.42-14.22a8,8,0,0,0-7.16,0L96,207.06,67.58,192.84a8,8,0,0,0-7.16,0L40,203.06V56H216ZM60.42,167.16a8,8,0,0,0,10.74-3.58L76.94,152h38.12l5.78,11.58a8,8,0,1,0,14.32-7.16l-32-64a8,8,0,0,0-14.32,0l-32,64A8,8,0,0,0,60.42,167.16ZM96,113.89,107.06,136H84.94ZM136,128a8,8,0,0,1,8-8h16V104a8,8,0,0,1,16,0v16h16a8,8,0,0,1,0,16H176v16a8,8,0,0,1-16,0V136H144A8,8,0,0,1,136,128Z"></path>
                      </svg>
                      <h3 className="font-medium text-sm">Content Briefs</h3>
                    </div>
                    <p className="text-muted-foreground text-sm">
                      Configure each brief with your branding, search results,
                      news, and live web screenshots.
                    </p>
                  </div>
                </div>

                <div className="@4xl:p-6 p-4" data-grid-content="true">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 256 256"
                        className="size-4 text-foreground"
                      >
                        <path
                          d="M216,48V88H40V48a8,8,0,0,1,8-8H208A8,8,0,0,1,216,48Z"
                          opacity="0.2"
                        ></path>
                        <path d="M208,32H184V24a8,8,0,0,0-16,0v8H88V24a8,8,0,0,0-16,0v8H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM72,48v8a8,8,0,0,0,16,0V48h80v8a8,8,0,0,0,16,0V48h24V80H48V48ZM208,208H48V96H208V208Zm-38.34-85.66a8,8,0,0,1,0,11.32l-48,48a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L116,164.69l42.34-42.35A8,8,0,0,1,169.66,122.34Z"></path>
                      </svg>
                      <h3 className="font-medium text-sm">Content Calendar</h3>
                    </div>
                    <p className="text-muted-foreground text-sm">
                      Automatically schedule your content to be published at the
                      best time.
                    </p>
                  </div>
                </div>

                <div className="@4xl:p-6 p-4" data-grid-content="true">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 256 256"
                        className="size-4 text-foreground"
                      >
                        <path
                          d="M200,56H56A24,24,0,0,0,32,80V192a24,24,0,0,0,24,24H200a24,24,0,0,0,24-24V80A24,24,0,0,0,200,56ZM164,184H92a20,20,0,0,1,0-40h72a20,20,0,0,1,0,40Z"
                          opacity="0.2"
                        ></path>
                        <path d="M200,48H136V16a8,8,0,0,0-16,0V48H56A32,32,0,0,0,24,80V192a32,32,0,0,0,32,32H200a32,32,0,0,0,32-32V80A32,32,0,0,0,200,48Zm16,144a16,16,0,0,1-16,16H56a16,16,0,0,1-16-16V80A16,16,0,0,1,56,64H200a16,16,0,0,1,16,16ZM72,108a12,12,0,1,1,12,12A12,12,0,0,1,72,108Zm88,0a12,12,0,1,1,12,12A12,12,0,0,1,160,108Zm4,28H92a28,28,0,0,0,0,56h72a28,28,0,0,0,0-56Zm-24,16v24H116V152ZM80,164a12,12,0,0,1,12-12h8v24H92A12,12,0,0,1,80,164Zm84,12h-8V152h8a12,12,0,0,1,0,24Z"></path>
                      </svg>
                      <h3 className="font-medium text-sm">Agent Analytics</h3>
                    </div>
                    <p className="text-muted-foreground text-sm">
                      See the full timeline from publish to citation so you know
                      what's working and how fast.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </FunnelSection>
  );
};
