import { useFunnelStore } from "@/stores/funnelStore/store";
import { HeroSectionContent, PageSection } from "@/types/PageCMS/pageSchema";
import { Hexagon } from "lucide-react";
import Image from "next/image";

const NAV_LINKS = [
  { label: "Home", href: "#" },
  { label: "Product", href: "#" },
  { label: "Solution", href: "#" },
  { label: "Pricing", href: "#" },
  { label: "About us", href: "#" },
  { label: "Contact", href: "#" },
];
type Props = {
  section: PageSection;
  pageId: string;
};

export const Navbar1 = ({ section, pageId }: Props) => {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="bg-blue-600 p-1.5 rounded-lg">
            <Hexagon className="w-5 h-5 text-white fill-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">
            Mentorea
          </span>
        </div>

        {/* Nav Links */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Auth Buttons */}
        <div className="flex items-center gap-6">
          <button className="text-sm font-semibold text-gray-700 hover:text-gray-900">
            Sign up
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors shadow-sm">
            Sign up
          </button>
        </div>
      </div>
    </header>
  );
};
export const Navbar2 = ({ section, pageId }: Props) => {
  const nextStep = useFunnelStore((s) => s.nextStep);
  const content: HeroSectionContent = section.content as HeroSectionContent;
  const NAV_TRIGGERS = ["Platform", "Solutions", "Resources"];
  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-white">
      <div className="absolute z-50 w-full rounded transition-all duration-300">
        <div className="@container">
          <div className="mx-auto w-full max-w-276 lg:min-w-5xl xl:min-w-276">
            <div className="grid  backdrop-blur">
              <div className="grid gap-px">
                <div
                  className="relative flex flex-wrap items-center justify-between px-3 lg:px-8 lg:py-5"
                  data-grid-content="true"
                >
                  <div className="flex justify-between gap-8 max-lg:h-14 max-lg:w-full max-lg:border-foreground/5 max-lg:border-b">
                    <a
                      aria-label="home"
                      className="flex items-center space-x-2"
                      href="/"
                    >
                      <Image
                        src="/text-logo-light.svg"
                        alt="Promptwatch Logo"
                        width={194}
                        height={33}
                        priority
                      />
                    </a>

                    <div className="flex items-center gap-3 lg:hidden">
                      <button
                        type="button"
                        className="inline-flex cursor-pointer items-center justify-center whitespace-nowrap font-medium transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0 rounded-md duration-150 focus-visible:ring-1 focus-visible:ring-ring active:scale-[0.99] active:transition-none border-[0.5px] border-white/25 bg-primary text-primary-foreground ring-(--ring-color) ring-1 [--ring-color:color-mix(in_oklab,var(--color-foreground)15%,var(--color-primary))] hover:bg-primary/90 h-8 px-3 text-xs"
                      >
                        Start Free Trial
                      </button>

                      <button
                        type="button"
                        aria-label="Open Menu"
                        className="relative z-20 -m-2.5 -mr-3 block cursor-pointer p-2.5"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 256 256"
                          className="m-auto size-5 in-data-[state=active]:rotate-180 in-data-[state=active]:scale-0 in-data-[state=active]:opacity-0 duration-200"
                        >
                          <path d="M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128ZM40,72H216a8,8,0,0,0,0-16H40a8,8,0,0,0,0,16ZM216,184H40a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Z" />
                        </svg>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 256 256"
                          className="absolute inset-0 m-auto size-5 -rotate-180 in-data-[state=active]:rotate-0 in-data-[state=active]:scale-100 scale-0 in-data-[state=active]:opacity-100 opacity-0 duration-200"
                        >
                          <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Desktop nav */}
                  {/* <div className="absolute inset-0 m-auto size-fit">
                    <nav
                      aria-label="Main"
                      role="navigation"
                      dir="ltr"
                      data-orientation="horizontal"
                      data-slot="navigation-menu"
                      data-viewport="false"
                      className="group/navigation-menu relative flex max-w-max flex-1 items-center justify-center max-lg:hidden"
                    >
                      <div style={{ position: "relative" }}>
                        <ul
                          dir="ltr"
                          data-orientation="horizontal"
                          data-slot="navigation-menu-list"
                          className="group flex flex-1 list-none items-center justify-center gap-1"
                        >
                          {NAV_TRIGGERS.map((label) => (
                            <li
                              key={label}
                              className="relative"
                              data-slot="navigation-menu-item"
                            >
                              <button
                                type="button"
                                aria-expanded="false"
                                className="group inline-flex h-8 w-max items-center justify-center rounded-md px-4 py-1 font-medium text-muted-foreground text-sm outline-none transition-[color,box-shadow] hover:bg-foreground/5 hover:text-foreground focus:bg-foreground/5 focus:text-foreground focus-visible:outline-1 focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 data-[state=open]:bg-foreground/5 data-[state=open]:text-foreground data-[state=open]:focus:bg-foreground/5 data-[state=open]:hover:bg-foreground/5 group"
                              >
                                {label}
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="currentColor"
                                  viewBox="0 0 256 256"
                                  aria-hidden="true"
                                  className="relative top-[1px] ml-1.5 size-3 opacity-75 transition duration-300 group-data-[state=open]:translate-y-px"
                                >
                                  <path d="M216.49,104.49l-80,80a12,12,0,0,1-17,0l-80-80a12,12,0,0,1,17-17L128,159l71.51-71.52a12,12,0,0,1,17,17Z" />
                                </svg>
                              </button>
                            </li>
                          ))}
                          <li
                            className="relative"
                            data-slot="navigation-menu-item"
                          >
                            <a
                              href="/pricing"
                              className="flex-col gap-1 p-2 data-[active=true]:bg-muted/50 data-[active=true]:text-foreground data-[active=true]:focus:bg-muted data-[active=true]:hover:bg-muted [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground group inline-flex h-8 w-max items-center justify-center rounded-md px-4 py-1 font-medium text-muted-foreground text-sm outline-none transition-[color,box-shadow] hover:bg-foreground/5 hover:text-foreground focus:bg-foreground/5 focus:text-foreground focus-visible:outline-1 focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 data-[state=open]:bg-foreground/5 data-[state=open]:text-foreground data-[state=open]:focus:bg-foreground/5 data-[state=open]:hover:bg-foreground/5"
                            >
                              Pricing
                            </a>
                          </li>
                        </ul>
                      </div>
                    </nav>
                  </div> */}

                  {/* Mobile menu / secondary CTAs (visible on desktop too, per original layout) */}
                  <div className="mb-6 in-data-[state=active]:flex hidden w-full flex-wrap items-center justify-end space-y-8 max-lg:in-data-[state=active]:mt-6 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none">
                    <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
                      <button
                        className="inline-flex cursor-pointer items-center justify-center whitespace-nowrap font-medium transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0 rounded-md focus-visible:ring-1 focus-visible:ring-ring active:scale-[0.99] active:transition-none h-9 px-4 py-2 text-base border border-transparent shadow-black/15 shadow-sm ring-1 ring-foreground/10 duration-200 hover:bg-muted/50 w-full gap-2 bg-white pr-3.5 pl-5 sm:w-auto"
                        onClick={nextStep}
                        style={{
                          backgroundColor: "var(--tk-accent-primary)",
                          color: "var(--tk-accent-primary-fg)",
                          boxShadow:
                            "0 10px 25px -8px var(--tk-accent-primary-border)",
                        }}
                        aria-label={
                          content?.primary_cta?.label ?? "Get Started"
                        }
                      >
                        {content?.primary_cta?.label ?? "Get Started"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
