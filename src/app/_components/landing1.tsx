"use client";
import {
  Search,
  Sparkles,
  ArrowRight,
  Star,
  PieChart,
  Activity,
  Cpu,
  Eye,
  ChevronDown,
  FileText,
  Bot,
  Globe2,
  Server,
  FileSearch,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const NAV_TRIGGERS = ["Platform", "Solutions", "Resources"];
export default function Landing1() {
  const [menuOpen, setMenuOpen] = useState(false);

  // Auto-close the mobile menu if the viewport grows back to desktop width
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <header
        data-state={menuOpen ? "active" : "inactive"}
        className="fixed inset-x-0 top-0 z-50 bg-stone-900/10"
      >
        <div className="absolute z-50 w-full rounded transition-all duration-300">
          <div className="@container grid grid-cols-[auto_1fr_auto] lg:grid-cols-[1fr_minmax(0,69rem)_1fr]">
            {/* Left edge spacer */}
            <div aria-hidden="true" className="p-[0.5px]">
              <div className="h-full rounded bg-background/75 max-lg:w-2" />
            </div>

            <div className="mx-auto w-full max-w-276 lg:min-w-5xl xl:min-w-276">
              <div className="grid *:p-[0.5px] **:data-grid-content:h-full **:data-grid-content:rounded **:data-grid-content:bg-background/75 backdrop-blur">
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
                          aria-expanded={menuOpen}
                          onClick={() => setMenuOpen((open) => !open)}
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
                    <div className="absolute inset-0 m-auto size-fit">
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
                    </div>

                    {/* Mobile menu / secondary CTAs (visible on desktop too, per original layout) */}
                    <div className="mb-6 in-data-[state=active]:flex hidden w-full flex-wrap items-center justify-end space-y-8 max-lg:in-data-[state=active]:mt-6 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none">
                      <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
                        <a
                          href="/book-a-demo"
                          className="inline-flex cursor-pointer items-center justify-center whitespace-nowrap font-medium transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0 rounded-md focus-visible:ring-1 focus-visible:ring-ring active:scale-[0.99] active:transition-none h-7 px-3 text-xs border border-transparent bg-background shadow-black/15 ring-1 ring-foreground/10 duration-200 hover:bg-muted/50 shadow-xs/80"
                        >
                          Book a Demo
                        </a>
                        <button
                          type="button"
                          className="cursor-pointer justify-center whitespace-nowrap font-medium transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0 rounded-md duration-150 focus-visible:ring-1 focus-visible:ring-ring active:scale-[0.99] active:transition-none h-7 px-3 text-xs border-[0.5px] border-white/25 bg-primary text-primary-foreground ring-(--ring-color) ring-1 [--ring-color:color-mix(in_oklab,var(--color-foreground)15%,var(--color-primary))] hover:bg-primary/90 flex items-center gap-2"
                        >
                          Start Free Trial
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 256 256"
                            className="size-4"
                          >
                            <path d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right edge spacer */}
            <div aria-hidden="true" className="p-[0.5px]">
              <div className="h-full rounded bg-background/75 max-lg:w-2" />
            </div>
          </div>
        </div>
      </header>
      <main>
        <section id="home">
          <div className="relative">
            <div className="@container grid grid-cols-[auto_1fr_auto] lg:grid-cols-[1fr_minmax(0,69rem)_1fr]">
              <div aria-hidden="true" className="p-[0.5px]">
                <div className="h-full rounded bg-background/75 max-lg:w-2" />
              </div>
              <div className="mx-auto w-full max-w-276 lg:min-w-5xl xl:min-w-276">
                <div className="grid *:p-[0.5px] **:data-grid-content:h-full **:data-grid-content:rounded **:data-grid-content:bg-background/75 relative">
                  {/* Canvas Background Grid Decor */}
                  <div
                    aria-hidden="true"
                    className="dither-xs mask-x-from-80% mask-x-to-95% mask-y-from-50% pointer-events-none absolute inset-0 overflow-hidden opacity-75 max-lg:opacity-50 2xl:mx-auto 2xl:max-w-5xl"
                  >
                    <div className="size-full">
                      <div className="relative h-full w-full overflow-hidden">
                        <canvas
                          data-engine="three.js r184"
                          width="1103"
                          height="632"
                          style={{ width: "100%", height: "100%" }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Grid Top Rows */}
                  <div
                    aria-hidden="true"
                    className="col-span-full grid grid-cols-10 gap-px"
                  >
                    {Array.from({ length: 10 }).map((_, i) => (
                      <div key={i} className="aspect-square">
                        <div data-grid-content="true" />
                      </div>
                    ))}
                  </div>

                  {/* Main Content Area */}
                  <div className="grid grid-cols-10 gap-px">
                    <div aria-hidden="true" className="grid grid-rows-4 gap-px">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i}>
                          <div data-grid-content="true" />
                        </div>
                      ))}
                    </div>

                    <div className="col-span-8">
                      <div
                        className="px-3 py-4 text-center sm:px-0 sm:py-12"
                        data-grid-content="true"
                      >
                        <div className="relative mx-auto max-w-4xl text-center">
                          <div className="transition-[opacity,filter] duration-500 ease-out motion-reduce:transition-none opacity-100 blur-0">
                            <h1 className="flex flex-col items-center gap-1 text-balance font-medium text-2xl text-foreground sm:text-4xl md:text-5xl">
                              <span className="inline-flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
                                The{" "}
                                <span className="text-primary underline decoration-primary/50 decoration-dashed">
                                  growth
                                </span>{" "}
                                engine for your
                              </span>{" "}
                              <span className="inline-flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
                                AI Search visibility
                              </span>
                            </h1>
                          </div>

                          <h2 className="mx-auto mt-5 mb-9 max-w-3xl text-balance font-normal text-base text-muted-foreground sm:mt-7 sm:text-lg">
                            Track and optimize visibility in ChatGPT, Gemini and
                            other AI Search engines to drive traffic to your
                            website that converts.
                          </h2>

                          {/* CTAs */}
                          <div className="flex w-full flex-col items-center justify-center gap-4 sm:w-auto sm:flex-row">
                            <Link
                              className="inline-flex cursor-pointer items-center justify-center whitespace-nowrap font-medium transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0 rounded-md focus-visible:ring-1 focus-visible:ring-ring active:scale-[0.99] active:transition-none h-9 px-4 py-2 text-base border border-transparent shadow-black/15 shadow-sm ring-1 ring-foreground/10 duration-200 hover:bg-muted/50 w-full gap-2 bg-white pr-3.5 pl-5 sm:w-auto"
                              href="#"
                            >
                              Book a Demo
                            </Link>

                            <button className="cursor-pointer justify-center whitespace-nowrap font-medium transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0 rounded-md duration-150 focus-visible:ring-1 focus-visible:ring-ring active:scale-[0.99] active:transition-none h-9 py-2 text-base border-[0.5px] border-white/25 bg-primary text-primary-foreground ring-(--ring-color) ring-1 [--ring-color:color-mix(in_oklab,var(--color-foreground)15%,var(--color-primary))] hover:bg-primary/90 flex w-full items-center gap-2 px-5 sm:w-auto">
                              Start Free Trial
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor"
                                viewBox="0 0 256 256"
                                className="size-4"
                              >
                                <path d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z" />
                              </svg>
                            </button>
                          </div>

                          {/* G2 Rating */}
                          <a
                            className="items-center gap-2 rounded-full text-sm mt-3 hidden sm:mt-7 sm:inline-flex"
                            rel="noopener noreferrer"
                            target="_blank"
                            href="https://www.g2.com/sellers/promptwatch"
                          >
                            <Image
                              src="/g2-icon.svg"
                              alt="G2"
                              width={24}
                              height={24}
                              className="size-6"
                            />
                            <div className="flex flex-col items-start gap-0.5">
                              <div className="flex items-center gap-0.5">
                                {[...Array(4)].map((_, i) => (
                                  <svg
                                    key={i}
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="currentColor"
                                    viewBox="0 0 256 256"
                                    className="size-2.5 text-[#FF492C]"
                                  >
                                    <path d="M234.29,114.85l-45,38.83L203,211.75a16.4,16.4,0,0,1-24.5,17.82L128,198.49,77.47,229.57A16.4,16.4,0,0,1,53,211.75l13.76-58.07-45-38.83A16.46,16.46,0,0,1,31.08,86l59-4.76,22.76-55.08a16.36,16.36,0,0,1,30.27,0l22.75,55.08,59,4.76a16.46,16.46,0,0,1,9.37,28.86Z" />
                                  </svg>
                                ))}
                                {/* Half Star */}
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="currentColor"
                                  viewBox="0 0 256 256"
                                  className="size-2.5 text-[#FF492C]"
                                >
                                  <path d="M239.18,97.26A16.38,16.38,0,0,0,224.92,86l-59-4.76L143.14,26.15a16.36,16.36,0,0,0-30.27,0L90.11,81.23,31.08,86a16.46,16.46,0,0,0-9.37,28.86l45,38.83L53,211.75a16.4,16.4,0,0,0,24.5,17.82L128,198.49l50.53,31.08A16.4,16.4,0,0,0,203,211.75l-13.76-58.07,45-38.83A16.43,16.43,0,0,0,239.18,97.26Zm-15.34,5.47-48.7,42a8,8,0,0,0-2.56,7.91l14.88,62.8a.37.37,0,0,1-.17.48c-.18.14-.23.11-.38,0l-54.72-33.65A8,8,0,0,0,128,181.1V32c.24,0,.27.08.35.26L153,91.86a8,8,0,0,0,6.75,4.92l63.91,5.16c.16,0,.25,0,.34.29S224,102.63,223.84,102.73Z" />
                                </svg>
                              </div>
                              <span className="font-medium text-[10px] text-gray-700">
                                4.7/5 stars on G2
                              </span>
                            </div>
                          </a>
                        </div>
                      </div>
                    </div>

                    <div aria-hidden="true" className="grid grid-rows-4 gap-px">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i}>
                          <div data-grid-content="true" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Grid Bottom Rows */}
                  <div
                    aria-hidden="true"
                    className="col-span-full grid grid-cols-10 gap-px"
                  >
                    {Array.from({ length: 10 }).map((_, i) => (
                      <div key={i} className="aspect-square">
                        <div data-grid-content="true" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div aria-hidden="true" className="p-[0.5px]">
                <div className="h-full rounded bg-background/75 max-lg:w-2" />
              </div>
            </div>
          </div>
        </section>
        <div className="@container grid grid-cols-[auto_1fr_auto] lg:grid-cols-[1fr_minmax(0,69rem)_1fr]">
          <div aria-hidden="true" className="p-[0.5px]">
            <div className="h-full rounded bg-background/75 max-lg:w-2"></div>
          </div>
          <div className="mx-auto w-full max-w-276 lg:min-w-5xl xl:min-w-276 p-[0.5px]">
            <div
              className="h-full rounded bg-background/75 mx-auto hidden max-w-6xl sm:block"
              data-slot="content"
            >
              <div className="flex flex-wrap items-center justify-center gap-3 px-4 py-4">
                <button className="flex cursor-pointer items-center justify-center gap-2 rounded-full border px-4 py-2 transition-all duration-200 border-stone-300/90 bg-white text-foreground shadow-xs">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 256 256"
                    className="h-4 w-4"
                  >
                    <path
                      d="M104,168a40,40,0,1,1-40-40A40,40,0,0,1,104,168Zm88-40a40,40,0,1,0,40,40A40,40,0,0,0,192,128Z"
                      opacity="0.2"
                    ></path>
                    <path d="M237.2,151.87v0a47.1,47.1,0,0,0-2.35-5.45L193.26,51.8a7.82,7.82,0,0,0-1.66-2.44,32,32,0,0,0-45.26,0A8,8,0,0,0,144,55V80H112V55a8,8,0,0,0-2.34-5.66,32,32,0,0,0-45.26,0,7.82,7.82,0,0,0-1.66,2.44L21.15,146.4a47.1,47.1,0,0,0-2.35,5.45v0A48,48,0,1,0,112,168V96h32v72a48,48,0,1,0,93.2-16.13ZM76.71,59.75a16,16,0,0,1,19.29-1v73.51a47.9,47.9,0,0,0-46.79-9.92ZM64,200a32,32,0,1,1,32-32A32,32,0,0,1,64,200ZM160,58.74a16,16,0,0,1,19.29,1l27.5,62.58A47.9,47.9,0,0,0,160,132.25ZM192,200a32,32,0,1,1,32-32A32,32,0,0,1,192,200Z"></path>
                  </svg>
                  <span className="whitespace-nowrap font-medium text-sm">
                    AI Visibility
                  </span>
                </button>
                <button className="flex cursor-pointer items-center justify-center gap-2 rounded-full border px-4 py-2 transition-all duration-200 border-gray-200 bg-stone text-foreground hover:border-gray-300 hover:bg-gray-50">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 256 256"
                    className="h-4 w-4"
                  >
                    <path d="M132,24A100.11,100.11,0,0,0,32,124v84a16,16,0,0,0,16,16h84a100,100,0,0,0,0-200Zm0,184H48V124a84,84,0,1,1,84,84Zm12-80a12,12,0,1,1-12-12A12,12,0,0,1,144,128Zm-44,0a12,12,0,1,1-12-12A12,12,0,0,1,100,128Zm88,0a12,12,0,1,1-12-12A12,12,0,0,1,188,128Z"></path>
                  </svg>
                  <span className="whitespace-nowrap font-medium text-sm">
                    Agent Chat
                  </span>
                </button>
                <button className="flex cursor-pointer items-center justify-center gap-2 rounded-full border px-4 py-2 transition-all duration-200 border-gray-200 bg-stone text-foreground hover:border-gray-300 hover:bg-gray-50">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 256 256"
                    className="h-4 w-4"
                  >
                    <path d="M112,40a8,8,0,0,0-8,8V64H24A16,16,0,0,0,8,80v96a16,16,0,0,0,16,16h80v16a8,8,0,0,0,16,0V48A8,8,0,0,0,112,40ZM24,176V80h80v96ZM248,80v96a16,16,0,0,1-16,16H144a8,8,0,0,1,0-16h88V80H144a8,8,0,0,1,0-16h88A16,16,0,0,1,248,80ZM88,112a8,8,0,0,1-8,8H72v24a8,8,0,0,1-16,0V120H48a8,8,0,0,1,0-16H80A8,8,0,0,1,88,112Z"></path>
                  </svg>
                  <span className="whitespace-nowrap font-medium text-sm">
                    Prompt Tracking
                  </span>
                </button>
                <button className="flex cursor-pointer items-center justify-center gap-2 rounded-full border px-4 py-2 transition-all duration-200 border-gray-200 bg-stone text-foreground hover:border-gray-300 hover:bg-gray-50">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 256 256"
                    className="h-4 w-4"
                  >
                    <path d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,160H40V56H216V200ZM184,96a8,8,0,0,1-8,8H80a8,8,0,0,1,0-16h96A8,8,0,0,1,184,96Zm0,32a8,8,0,0,1-8,8H80a8,8,0,0,1,0-16h96A8,8,0,0,1,184,128Zm0,32a8,8,0,0,1-8,8H80a8,8,0,0,1,0-16h96A8,8,0,0,1,184,160Z"></path>
                  </svg>
                  <span className="whitespace-nowrap font-medium text-sm">
                    Content Agents
                  </span>
                </button>
                <button className="flex cursor-pointer items-center justify-center gap-2 rounded-full border px-4 py-2 transition-all duration-200 border-gray-200 bg-stone text-foreground hover:border-gray-300 hover:bg-gray-50">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 256 256"
                    className="h-4 w-4"
                  >
                    <path d="M238.64,33.36a32,32,0,0,0-45.26,0h0a32,32,0,0,0,0,45.26c.29.29.6.57.9.85l-26.63,49.46a32.19,32.19,0,0,0-23.9,3.5l-20.18-20.18a32,32,0,0,0-50.2-38.89h0a32,32,0,0,0,0,45.26c.29.29.59.57.89.85L47.63,168.94a32,32,0,0,0-30.27,8.44h0a32,32,0,1,0,45.26,0c-.29-.29-.6-.57-.9-.85l26.63-49.46A32.4,32.4,0,0,0,96,128a32,32,0,0,0,16.25-4.41l20.18,20.18a32,32,0,1,0,50.2-6.38c-.29-.29-.59-.57-.89-.85l26.63-49.46A32.33,32.33,0,0,0,216,88a32,32,0,0,0,22.63-54.62ZM51.3,211.33a16,16,0,0,1-22.63-22.64h0A16,16,0,1,1,51.3,211.33Zm33.38-104a16,16,0,0,1,0-22.63h0a16,16,0,1,1,0,22.63Zm86.64,64a16,16,0,0,1-22.63-22.63h0a16,16,0,0,1,22.63,22.63Zm56-104A16,16,0,1,1,204.7,44.67h0a16,16,0,0,1,22.63,22.64Z"></path>
                  </svg>
                  <span className="whitespace-nowrap font-medium text-sm">
                    Offsite citations
                  </span>
                </button>
              </div>
            </div>
          </div>
          <div aria-hidden="true" className="p-[0.5px]">
            <div className="h-full rounded bg-background/75 max-lg:w-2"></div>
          </div>
        </div>
        <div className="@container grid grid-cols-[auto_1fr_auto] lg:grid-cols-[1fr_minmax(0,69rem)_1fr]">
          <div aria-hidden="true" className="p-[0.5px]">
            <div className="h-full rounded bg-background/75 max-lg:w-2"></div>
          </div>
          <div className="mx-auto w-full max-w-276 lg:min-w-5xl xl:min-w-276 p-[0.5px]">
            <div
              className="h-full rounded bg-background/75"
              data-slot="content"
            >
              <div className="relative h-[316px] w-full overflow-hidden rounded-sm bg-white sm:h-[395px] md:h-[528px] lg:h-[556px] xl:h-[556px]">
                <div className="absolute inset-1 overflow-hidden rounded-sm before:pointer-events-none before:absolute before:inset-0 before:z-10 before:rounded before:border before:border-foreground/10">
                  <div className="dither absolute inset-0 opacity-75">
                    <Image
                      src="/assets/imageplaceholder.svg"
                      alt=""
                      fill
                      className="size-full object-cover opacity-50"
                    />
                  </div>
                  <Image
                    src="/assets/imageplaceholder.svg"
                    alt=""
                    fill
                    className="size-full object-cover opacity-75"
                  />
                </div>
                <div className="absolute inset-0 flex items-end px-3 pb-1 sm:px-4 md:px-5 lg:px-8">
                  <div
                    className="relative w-full"
                    style={{
                      transform: "translate3d(0px, 0px, 0px)",
                      transition:
                        "transform 700ms cubic-bezier(0.16, 1, 0.3, 1)",
                      willChange: "auto",
                    }}
                  >
                    <div className="relative w-[166.67%] origin-bottom-left scale-[0.6] sm:w-[133.33%] sm:scale-75 md:w-full md:scale-100 lg:scale-100 xl:scale-100">
                      <div className="flex h-[500px] flex-col overflow-hidden rounded-t-[10px] bg-white lg:h-[524px]">
                        <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-t-[10px] border border-zinc-500/60 border-b-0 bg-white shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
                          <div className="relative flex h-8 shrink-0 items-center border-zinc-500/40 border-b bg-[linear-gradient(to_bottom,var(--color-white)_0%,var(--color-zinc-100)_45%,var(--color-zinc-200)_100%)] px-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.95),inset_0_-1px_0_rgba(255,255,255,0.35)]">
                            <div
                              aria-hidden="true"
                              className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-linear-to-b from-white/80 to-white/10"
                            ></div>
                            <div
                              aria-hidden="true"
                              className="relative z-10 flex items-center gap-2"
                            >
                              <span className="relative size-2.5 rounded-full border border-red-900/55 bg-[linear-gradient(to_bottom,var(--color-red-200)_0%,var(--color-red-400)_42%,var(--color-red-600)_100%)] shadow-[0_1px_1px_rgba(0,0,0,0.2),inset_0_1px_1px_rgba(255,255,255,0.5)]">
                                <span className="absolute inset-x-0.5 top-px h-1 rounded-full bg-white/65 blur-[0.3px]"></span>
                              </span>
                              <span className="relative size-2.5 rounded-full border border-amber-900/55 bg-[linear-gradient(to_bottom,var(--color-amber-200)_0%,var(--color-amber-400)_42%,var(--color-amber-600)_100%)] shadow-[0_1px_1px_rgba(0,0,0,0.2),inset_0_1px_1px_rgba(255,255,255,0.5)]">
                                <span className="absolute inset-x-0.5 top-px h-1 rounded-full bg-white/65 blur-[0.3px]"></span>
                              </span>
                              <span className="relative size-2.5 rounded-full border border-green-900/55 bg-[linear-gradient(to_bottom,var(--color-green-200)_0%,var(--color-green-500)_42%,var(--color-green-700)_100%)] shadow-[0_1px_1px_rgba(0,0,0,0.2),inset_0_1px_1px_rgba(255,255,255,0.5)]">
                                <span className="absolute inset-x-0.5 top-px h-1 rounded-full bg-white/65 blur-[0.3px]"></span>
                              </span>
                            </div>
                            <span className="pointer-events-none absolute inset-x-20 top-1/2 -translate-y-1/2 truncate text-center font-medium text-[12px] text-zinc-600 [text-shadow:0_1px_0_rgba(255,255,255,0.95)]">
                              Promptwatch - Visibility
                            </span>
                          </div>
                          <div className="flex flex-1 overflow-hidden md:flex-row">
                            <div className="hidden flex-col border-stone-200 border-r bg-stone-50/60 p-3 md:flex md:w-[154px]">
                              <nav className="flex-1 space-y-4">
                                <div className="relative">
                                  <div className="flex w-full items-center justify-between rounded-md border border-gray-200 bg-white px-1 py-1 text-gray-700 text-xs">
                                    <div className="flex items-center space-x-0.5">
                                      <div
                                        className="flex items-center space-x-2"
                                        style={{
                                          opacity: "1",
                                          transform: "none",
                                        }}
                                      >
                                        <Image
                                          src="/assets/imageplaceholder.svg"
                                          alt="Yelp logo"
                                          width={20}
                                          height={20}
                                          className="rounded-sm border border-gray-200"
                                        />
                                        <span className="line-clamp-1 font-medium text-xs">
                                          Yelp
                                        </span>
                                      </div>
                                    </div>
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="currentColor"
                                      viewBox="0 0 256 256"
                                      className="h-3 w-3"
                                    >
                                      <path d="M181.66,170.34a8,8,0,0,1,0,11.32l-48,48a8,8,0,0,1-11.32,0l-48-48a8,8,0,0,1,11.32-11.32L128,212.69l42.34-42.35A8,8,0,0,1,181.66,170.34Zm-96-84.68L128,43.31l42.34,42.35a8,8,0,0,0,11.32-11.32l-48-48a8,8,0,0,0-11.32,0l-48,48A8,8,0,0,0,85.66,85.66Z"></path>
                                    </svg>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <button
                                    className="relative flex w-full cursor-pointer items-center rounded-md border-none px-3 py-2 text-left font-medium text-xs hover:bg-stone-100 bg-gray-100 text-foreground"
                                    type="button"
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="currentColor"
                                      viewBox="0 0 256 256"
                                      className="mr-2 size-3.5"
                                    >
                                      <path
                                        d="M104,168a40,40,0,1,1-40-40A40,40,0,0,1,104,168Zm88-40a40,40,0,1,0,40,40A40,40,0,0,0,192,128Z"
                                        opacity="0.2"
                                      ></path>
                                      <path d="M237.2,151.87v0a47.1,47.1,0,0,0-2.35-5.45L193.26,51.8a7.82,7.82,0,0,0-1.66-2.44,32,32,0,0,0-45.26,0A8,8,0,0,0,144,55V80H112V55a8,8,0,0,0-2.34-5.66,32,32,0,0,0-45.26,0,7.82,7.82,0,0,0-1.66,2.44L21.15,146.4a47.1,47.1,0,0,0-2.35,5.45v0A48,48,0,1,0,112,168V96h32v72a48,48,0,1,0,93.2-16.13ZM76.71,59.75a16,16,0,0,1,19.29-1v73.51a47.9,47.9,0,0,0-46.79-9.92ZM64,200a32,32,0,1,1,32-32A32,32,0,0,1,64,200ZM160,58.74a16,16,0,0,1,19.29,1l27.5,62.58A47.9,47.9,0,0,0,160,132.25ZM192,200a32,32,0,1,1,32-32A32,32,0,0,1,192,200Z"></path>
                                    </svg>
                                    Visibility
                                  </button>
                                  <button
                                    className="relative flex w-full cursor-pointer items-center rounded-md border-none bg-stone-50/60 px-3 py-2 text-left font-medium text-muted-foreground/80 text-xs hover:bg-stone-100"
                                    type="button"
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="currentColor"
                                      viewBox="0 0 256 256"
                                      className="mr-2 size-3.5"
                                    >
                                      <path d="M132,24A100.11,100.11,0,0,0,32,124v84a16,16,0,0,0,16,16h84a100,100,0,0,0,0-200Zm0,184H48V124a84,84,0,1,1,84,84Z"></path>
                                    </svg>
                                    Agent
                                  </button>
                                  <button
                                    className="relative flex w-full cursor-pointer items-center rounded-md border-none bg-stone-50/60 px-3 py-2 text-left font-medium text-muted-foreground/80 text-xs hover:bg-stone-100"
                                    type="button"
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="currentColor"
                                      viewBox="0 0 256 256"
                                      className="mr-2 size-3.5"
                                    >
                                      <path d="M112,40a8,8,0,0,0-8,8V64H24A16,16,0,0,0,8,80v96a16,16,0,0,0,16,16h80v16a8,8,0,0,0,16,0V48A8,8,0,0,0,112,40ZM24,176V80h80v96ZM248,80v96a16,16,0,0,1-16,16H144a8,8,0,0,1,0-16h88V80H144a8,8,0,0,1,0-16h88A16,16,0,0,1,248,80ZM88,112a8,8,0,0,1-8,8H72v24a8,8,0,0,1-16,0V120H48a8,8,0,0,1,0-16H80A8,8,0,0,1,88,112Z"></path>
                                    </svg>
                                    Prompts
                                  </button>
                                  <button
                                    className="relative flex w-full cursor-pointer items-center rounded-md border-none bg-stone-50/60 px-3 py-2 text-left font-medium text-muted-foreground/80 text-xs hover:bg-stone-100"
                                    type="button"
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="currentColor"
                                      viewBox="0 0 256 256"
                                      className="mr-2 size-3.5"
                                    >
                                      <path d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,160H40V56H216V200ZM184,96a8,8,0,0,1-8,8H80a8,8,0,0,1,0-16h96A8,8,0,0,1,184,96Zm0,32a8,8,0,0,1-8,8H80a8,8,0,0,1,0-16h96A8,8,0,0,1,184,128Zm0,32a8,8,0,0,1-8,8H80a8,8,0,0,1,0-16h96A8,8,0,0,1,184,160Z"></path>
                                    </svg>
                                    Content
                                  </button>
                                  <button
                                    className="relative flex w-full cursor-pointer items-center rounded-md border-none bg-stone-50/60 px-3 py-2 text-left font-medium text-muted-foreground/80 text-xs hover:bg-stone-100"
                                    type="button"
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="currentColor"
                                      viewBox="0 0 256 256"
                                      className="mr-2 size-3.5"
                                    >
                                      <path d="M200,48H136V16a8,8,0,0,0-16,0V48H56A32,32,0,0,0,24,80V192a32,32,0,0,0,32,32H200a32,32,0,0,0,32-32V80A32,32,0,0,0,200,48Zm16,144a16,16,0,0,1-16,16H56a16,16,0,0,1-16-16V80A16,16,0,0,1,56,64H200a16,16,0,0,1,16,16Zm-52-56H92a28,28,0,0,0,0,56h72a28,28,0,0,0,0-56Zm-24,16v24H116V152ZM80,164a12,12,0,0,1,12-12h8v24H92A12,12,0,0,1,80,164Zm84,12h-8V152h8a12,12,0,0,1,0,24ZM72,108a12,12,0,1,1,12,12A12,12,0,0,1,72,108Zm88,0a12,12,0,1,1,12,12A12,12,0,0,1,160,108Z"></path>
                                    </svg>
                                    Crawlers
                                  </button>
                                  <button
                                    className="relative flex w-full cursor-pointer items-center rounded-md border-none bg-stone-50/60 px-3 py-2 text-left font-medium text-muted-foreground/80 text-xs hover:bg-stone-100"
                                    type="button"
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="currentColor"
                                      viewBox="0 0 256 256"
                                      className="mr-2 size-3.5"
                                    >
                                      <path d="M238.64,33.36a32,32,0,0,0-45.26,0h0a32,32,0,0,0,0,45.26c.29.29.6.57.9.85l-26.63,49.46a32.19,32.19,0,0,0-23.9,3.5l-20.18-20.18a32,32,0,0,0-50.2-38.89h0a32,32,0,0,0,0,45.26c.29.29.59.57.89.85L47.63,168.94a32,32,0,0,0-30.27,8.44h0a32,32,0,1,0,45.26,0c-.29-.29-.6-.57-.9-.85l26.63-49.46A32.4,32.4,0,0,0,96,128a32,32,0,0,0,16.25-4.41l20.18,20.18a32,32,0,1,0,50.2-6.38c-.29-.29-.59-.57-.89-.85l26.63-49.46A32.33,32.33,0,0,0,216,88a32,32,0,0,0,22.63-54.62ZM51.3,211.33a16,16,0,0,1-22.63-22.64h0A16,16,0,1,1,51.3,211.33Zm33.38-104a16,16,0,0,1,0-22.63h0a16,16,0,1,1,0,22.63Zm86.64,64a16,16,0,0,1-22.63-22.63h0a16,16,0,0,1,22.63,22.63Zm56-104A16,16,0,1,1,204.7,44.67h0a16,16,0,0,1,22.63,22.64Z"></path>
                                    </svg>
                                    Citations
                                  </button>
                                  <button
                                    className="relative flex w-full cursor-pointer items-center rounded-md border-none bg-stone-50/60 px-3 py-2 text-left font-medium text-muted-foreground/80 text-xs hover:bg-stone-100"
                                    type="button"
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="currentColor"
                                      viewBox="0 0 256 256"
                                      className="mr-2 size-3.5"
                                    >
                                      <path d="M232,208a8,8,0,0,1-8,8H32a8,8,0,0,1-8-8V48a8,8,0,0,1,16,0v94.37L90.73,98a8,8,0,0,1,10.07-.38l58.81,44.11L218.73,90a8,8,0,1,1,10.54,12l-64,56a8,8,0,0,1-10.07.38L96.39,114.29,40,163.63V200H224A8,8,0,0,1,232,208Z"></path>
                                    </svg>
                                    Analytics
                                  </button>
                                </div>
                              </nav>
                              <nav>
                                <div className="flex items-center rounded-md px-3 py-2 text-gray-400 text-xs">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="currentColor"
                                    viewBox="0 0 256 256"
                                    className="mr-2 size-4"
                                  >
                                    <path d="M230.92,212c-15.23-26.33-38.7-45.21-66.09-54.16a72,72,0,1,0-73.66,0C63.78,166.78,40.31,185.66,25.08,212a8,8,0,1,0,13.85,8c18.84-32.56,52.14-52,89.07-52s70.23,19.44,89.07,52a8,8,0,1,0,13.85-8ZM72,96a56,56,0,1,1,56,56A56.06,56.06,0,0,1,72,96Z"></path>
                                  </svg>
                                  Team
                                </div>
                              </nav>
                            </div>
                            <div className="flex-1 overflow-hidden bg-stone-50">
                              <div className="h-full" style={{ opacity: "1" }}>
                                <div className="flex flex-1 flex-col">
                                  <div className="h-full flex-1 overflow-hidden p-3 bg-stone-50">
                                    <div className="flex h-full flex-col overflow-hidden rounded-lg border border-stone-200 bg-white">
                                      <div className="flex min-h-0 flex-1 flex-row divide-x divide-gray-200">
                                        <div className="flex min-h-0 w-2/3 flex-col">
                                          <div className="min-h-0 flex-1 pt-3 pr-6 pb-3 pl-0">
                                            <div
                                              className="recharts-responsive-container"
                                              style={{
                                                width: "100%",
                                                height: "100%",
                                                minWidth: "0px",
                                              }}
                                            >
                                              <div
                                                className="recharts-wrapper"
                                                style={{
                                                  position: "relative",
                                                  cursor: "default",
                                                  width: "100%",
                                                  height: "100%",
                                                  maxHeight: "457px",
                                                  maxWidth: "546px",
                                                }}
                                              >
                                                <svg
                                                  className="recharts-surface"
                                                  width="546"
                                                  height="457"
                                                  viewBox="0 0 546 457"
                                                  style={{
                                                    width: "100%",
                                                    height: "100%",
                                                  }}
                                                >
                                                  <title></title>
                                                  <desc></desc>
                                                  <defs>
                                                    <clipPath id="recharts104-clip">
                                                      <rect
                                                        x="57"
                                                        y="5"
                                                        height="437"
                                                        width="479"
                                                      ></rect>
                                                    </clipPath>
                                                  </defs>
                                                  <g className="recharts-cartesian-grid">
                                                    <g className="recharts-cartesian-grid-horizontal">
                                                      <line
                                                        stroke="#e5e7eb"
                                                        stroke-dasharray="3 3"
                                                        fill="none"
                                                        x="57"
                                                        y="5"
                                                        width="479"
                                                        height="437"
                                                        x1="57"
                                                        y1="442"
                                                        x2="536"
                                                        y2="442"
                                                      ></line>
                                                      <line
                                                        stroke="#e5e7eb"
                                                        stroke-dasharray="3 3"
                                                        fill="none"
                                                        x="57"
                                                        y="5"
                                                        width="479"
                                                        height="437"
                                                        x1="57"
                                                        y1="332.75"
                                                        x2="536"
                                                        y2="332.75"
                                                      ></line>
                                                      <line
                                                        stroke="#e5e7eb"
                                                        stroke-dasharray="3 3"
                                                        fill="none"
                                                        x="57"
                                                        y="5"
                                                        width="479"
                                                        height="437"
                                                        x1="57"
                                                        y1="223.5"
                                                        x2="536"
                                                        y2="223.5"
                                                      ></line>
                                                      <line
                                                        stroke="#e5e7eb"
                                                        stroke-dasharray="3 3"
                                                        fill="none"
                                                        x="57"
                                                        y="5"
                                                        width="479"
                                                        height="437"
                                                        x1="57"
                                                        y1="114.25"
                                                        x2="536"
                                                        y2="114.25"
                                                      ></line>
                                                      <line
                                                        stroke="#e5e7eb"
                                                        stroke-dasharray="3 3"
                                                        fill="none"
                                                        x="57"
                                                        y="5"
                                                        width="479"
                                                        height="437"
                                                        x1="57"
                                                        y1="5"
                                                        x2="536"
                                                        y2="5"
                                                      ></line>
                                                    </g>
                                                  </g>
                                                  <g className="recharts-layer recharts-cartesian-axis recharts-yAxis yAxis">
                                                    <g className="recharts-cartesian-axis-ticks">
                                                      <g className="recharts-layer recharts-cartesian-axis-tick">
                                                        <text
                                                          orientation="left"
                                                          width="57"
                                                          height="437"
                                                          stroke="none"
                                                          fontSize="10"
                                                          x="49"
                                                          y="442"
                                                          className="recharts-text recharts-cartesian-axis-tick-value"
                                                          textAnchor="end"
                                                          fill="#6b7280"
                                                        >
                                                          <tspan
                                                            x="49"
                                                            dy="0.355em"
                                                          >
                                                            0%
                                                          </tspan>
                                                        </text>
                                                      </g>
                                                      <g className="recharts-layer recharts-cartesian-axis-tick">
                                                        <text
                                                          orientation="left"
                                                          width="57"
                                                          height="437"
                                                          stroke="none"
                                                          fontSize="10"
                                                          x="49"
                                                          y="332.75"
                                                          className="recharts-text recharts-cartesian-axis-tick-value"
                                                          textAnchor="end"
                                                          fill="#6b7280"
                                                        >
                                                          <tspan
                                                            x="49"
                                                            dy="0.355em"
                                                          >
                                                            8%
                                                          </tspan>
                                                        </text>
                                                      </g>
                                                      <g className="recharts-layer recharts-cartesian-axis-tick">
                                                        <text
                                                          orientation="left"
                                                          width="57"
                                                          height="437"
                                                          stroke="none"
                                                          fontSize="10"
                                                          x="49"
                                                          y="223.5"
                                                          className="recharts-text recharts-cartesian-axis-tick-value"
                                                          textAnchor="end"
                                                          fill="#6b7280"
                                                        >
                                                          <tspan
                                                            x="49"
                                                            dy="0.355em"
                                                          >
                                                            16%
                                                          </tspan>
                                                        </text>
                                                      </g>
                                                      <g className="recharts-layer recharts-cartesian-axis-tick">
                                                        <text
                                                          orientation="left"
                                                          width="57"
                                                          height="437"
                                                          stroke="none"
                                                          fontSize="10"
                                                          x="49"
                                                          y="114.25"
                                                          className="recharts-text recharts-cartesian-axis-tick-value"
                                                          textAnchor="end"
                                                          fill="#6b7280"
                                                        >
                                                          <tspan
                                                            x="49"
                                                            dy="0.355em"
                                                          >
                                                            24%
                                                          </tspan>
                                                        </text>
                                                      </g>
                                                      <g className="recharts-layer recharts-cartesian-axis-tick">
                                                        <text
                                                          orientation="left"
                                                          width="57"
                                                          height="437"
                                                          stroke="none"
                                                          fontSize="10"
                                                          x="49"
                                                          y="7.5"
                                                          className="recharts-text recharts-cartesian-axis-tick-value"
                                                          textAnchor="end"
                                                          fill="#6b7280"
                                                        >
                                                          <tspan
                                                            x="49"
                                                            dy="0.355em"
                                                          >
                                                            32%
                                                          </tspan>
                                                        </text>
                                                      </g>
                                                    </g>
                                                  </g>
                                                  <g className="recharts-layer recharts-line">
                                                    <path
                                                      stroke="#117aca"
                                                      stroke-opacity="1"
                                                      strokeWidth="2"
                                                      width="479"
                                                      height="437"
                                                      fill="none"
                                                      className="recharts-curve recharts-line-curve"
                                                      stroke-dasharray="1438.6533203125px 0px"
                                                      d="M57,145.639L70.686,77.989L84.371,145.97L98.057,160.042L111.743,80.606L125.429,87.091L139.114,77.415L152.8,122.609L166.486,129.18L180.171,136.271L193.857,92.914L207.543,120.358L221.229,147.323L234.914,159.695L248.6,135.835L262.286,145.031L275.971,73.935L289.657,132.036L303.343,112.129L317.029,147.809L330.714,86.78L344.4,106.077L358.086,55.041L371.771,158.019L385.457,105.15L399.143,120.249L412.829,141.688L426.514,89.288L440.2,67.225L453.886,75.897L467.571,144.108L481.257,74.203L494.943,99.794L508.629,51.151L522.314,94.582L536,111.147"
                                                    ></path>
                                                    <g className="recharts-layer"></g>
                                                  </g>
                                                  <g className="recharts-layer recharts-line">
                                                    <path
                                                      stroke="#E31837"
                                                      stroke-opacity="0.15"
                                                      strokeWidth="2"
                                                      width="479"
                                                      height="437"
                                                      fill="none"
                                                      className="recharts-curve recharts-line-curve"
                                                      stroke-dasharray="1177.9202880859375px 0px"
                                                      d="M57,153.104L70.686,189.51L84.371,115.676L98.057,135.439L111.743,170.647L125.429,183.434L139.114,191.253L152.8,138.868L166.486,178.16L180.171,177.783L193.857,135.347L207.543,149.112L221.229,196.489L234.914,114.878L248.6,136.877L262.286,182.924L275.971,120.463L289.657,135.826L303.343,178.62L317.029,186.806L330.714,173.219L344.4,149.759L358.086,167.77L371.771,170.784L385.457,159.059L399.143,162.113L412.829,170.263L426.514,121.836L440.2,151.11L453.886,165.177L467.571,134.583L481.257,127.797L494.943,142.27L508.629,124.654L522.314,194.702L536,149.657"
                                                    ></path>
                                                    <g className="recharts-layer"></g>
                                                  </g>
                                                  <g className="recharts-layer recharts-line">
                                                    <path
                                                      stroke="#056DAE"
                                                      stroke-opacity="0.15"
                                                      strokeWidth="2"
                                                      width="479"
                                                      height="437"
                                                      fill="none"
                                                      className="recharts-curve recharts-line-curve"
                                                      stroke-dasharray="1083.695068359375px 0px"
                                                      d="M57,221.259L70.686,187.885L84.371,209.217L98.057,190.629L111.743,236.202L125.429,225.302L139.114,181.873L152.8,171.427L166.486,211.327L180.171,159.786L193.857,191.736L207.543,213.862L221.229,186.298L234.914,164.798L248.6,198.491L262.286,170.725L275.971,197.531L289.657,182.23L303.343,176.625L317.029,209.697L330.714,190.579L344.4,193.006L358.086,195.724L371.771,160.254L385.457,203.715L399.143,223.615L412.829,208.641L426.514,192.76L440.2,178.637L453.886,218.782L467.571,166.166L481.257,231.447L494.943,214.768L508.629,165.8L522.314,179.151L536,185.895"
                                                    ></path>
                                                    <g className="recharts-layer"></g>
                                                  </g>
                                                  <g className="recharts-layer recharts-line">
                                                    <path
                                                      stroke="#D71E28"
                                                      stroke-opacity="0.15"
                                                      strokeWidth="2"
                                                      width="479"
                                                      height="437"
                                                      fill="none"
                                                      className="recharts-curve recharts-line-curve"
                                                      stroke-dasharray="773.9362182617188px 0px"
                                                      d="M57,327.652L70.686,349.704L84.371,334.032L98.057,337.519L111.743,324.414L125.429,336.432L139.114,355.471L152.8,338.079L166.486,333.845L180.171,317.793L193.857,343.852L207.543,335.874L221.229,308.697L234.914,339.483L248.6,345.469L262.286,337.328L275.971,361.396L289.657,321.236L303.343,327.203L317.029,333.353L330.714,347.077L344.4,337.871L358.086,331.879L371.771,321.446L385.457,344.581L399.143,328.061L412.829,319.137L426.514,358.192L440.2,363.547L453.886,345.855L467.571,312.392L481.257,327.091L494.943,364.504L508.629,352.892L522.314,354.126L536,346.472"
                                                    ></path>
                                                    <g className="recharts-layer"></g>
                                                  </g>
                                                  <g className="recharts-layer recharts-line">
                                                    <path
                                                      stroke="#0C2340"
                                                      stroke-opacity="0.15"
                                                      strokeWidth="2"
                                                      width="479"
                                                      height="437"
                                                      fill="none"
                                                      className="recharts-curve recharts-line-curve"
                                                      stroke-dasharray="865.0980834960938px 0px"
                                                      d="M57,353.568L70.686,322.274L84.371,349.841L98.057,332.687L111.743,317.293L125.429,312.43L139.114,318.022L152.8,346.276L166.486,316.822L180.171,300.244L193.857,346.86L207.543,321.671L221.229,303.887L234.914,336.64L248.6,346.507L262.286,342.26L275.971,335.953L289.657,316.43L303.343,330.997L317.029,351.453L330.714,339.165L344.4,333.292L358.086,300.292L371.771,314.071L385.457,350.462L399.143,324.219L412.829,316.324L426.514,327.806L440.2,332.852L453.886,303.786L467.571,333.488L481.257,316.706L494.943,329.232L508.629,313.879L522.314,346.56L536,323.458"
                                                    ></path>
                                                    <g className="recharts-layer"></g>
                                                  </g>
                                                  <g className="recharts-layer recharts-line">
                                                    <path
                                                      stroke="#7399C6"
                                                      stroke-opacity="0.15"
                                                      strokeWidth="2"
                                                      width="479"
                                                      height="437"
                                                      fill="none"
                                                      className="recharts-curve recharts-line-curve"
                                                      stroke-dasharray="751.719970703125px 0px"
                                                      d="M57,348.782L70.686,358.807L84.371,341.638L98.057,351.857L111.743,343.936L125.429,331.882L139.114,368.352L152.8,358.787L166.486,340.865L180.171,367.732L193.857,359.106L207.543,352.586L221.229,342.67L234.914,360.927L248.6,343.248L262.286,328.727L275.971,370.125L289.657,360.318L303.343,352.648L317.029,327.057L330.714,346.712L344.4,339.941L358.086,372.283L371.771,361.147L385.457,354.306L399.143,335.395L412.829,341.127L426.514,363.451L440.2,356.87L453.886,341.186L467.571,363.035L481.257,360.838L494.943,332.825L508.629,351.697L522.314,341.718L536,350.168"
                                                    ></path>
                                                    <g className="recharts-layer"></g>
                                                  </g>
                                                  <g className="recharts-layer recharts-line">
                                                    <path
                                                      stroke="#F58025"
                                                      stroke-opacity="0.15"
                                                      strokeWidth="2"
                                                      width="479"
                                                      height="437"
                                                      fill="none"
                                                      className="recharts-curve recharts-line-curve"
                                                      stroke-dasharray="530.3676147460938px 0px"
                                                      d="M57,371.962L70.686,372.459L84.371,376.388L98.057,369.871L111.743,373.57L125.429,364.729L139.114,379.963L152.8,369.358L166.486,373.086L180.171,369.244L193.857,375.993L207.543,368.589L221.229,372.994L234.914,367.179L248.6,375.838L262.286,371.523L275.971,375.915L289.657,366.163L303.343,374.403L317.029,367.326L330.714,372.492L344.4,374.981L358.086,367.914L371.771,371.198L385.457,369.053L399.143,374.292L412.829,365.208L426.514,371.719L440.2,370.727L453.886,372.241L467.571,373.041L481.257,365.67L494.943,374.092L508.629,366.992L522.314,372.534L536,363.602"
                                                    ></path>
                                                    <g className="recharts-layer"></g>
                                                  </g>
                                                  <g className="recharts-layer recharts-line">
                                                    <path
                                                      stroke="#6A5ACD"
                                                      stroke-opacity="0.15"
                                                      strokeWidth="2"
                                                      width="479"
                                                      height="437"
                                                      fill="none"
                                                      className="recharts-curve recharts-line-curve"
                                                      stroke-dasharray="520.1978759765625px 0px"
                                                      d="M57,390.615L70.686,384.108L84.371,388.679L98.057,382.526L111.743,385.893L125.429,383.194L139.114,391.361L152.8,381.133L166.486,389.748L180.171,384.602L193.857,388.801L207.543,384.023L221.229,389.878L234.914,379.255L248.6,385.936L262.286,386.692L275.971,391.879L289.657,380.282L303.343,388.275L317.029,382.665L330.714,388.405L344.4,385.872L358.086,389.083L371.771,382.891L385.457,386.412L399.143,385.131L412.829,387.169L426.514,381.647L440.2,389.646L453.886,382.764L467.571,388.827L481.257,386.424L494.943,388.724L508.629,383.475L522.314,386.498L536,386.465"
                                                    ></path>
                                                    <g className="recharts-layer"></g>
                                                  </g>
                                                </svg>
                                                <div
                                                  className="recharts-tooltip-wrapper recharts-tooltip-wrapper-left recharts-tooltip-wrapper-top"
                                                  style={{
                                                    visibility: "hidden",
                                                    pointerEvents: "none",
                                                    position: "absolute",
                                                    top: "0px",
                                                    left: "0px",
                                                    zIndex: "50",
                                                    transform:
                                                      "translate(137.572px, 8px)",
                                                  }}
                                                ></div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="flex min-h-0 w-1/3 flex-col">
                                          <div className="flex h-[58px] flex-col justify-center border-b px-6 py-3">
                                            <p className="text-muted-foreground text-xs leading-tight">
                                              Top Brands by Visibility
                                            </p>
                                            <p className="mt-1 font-semibold text-gray-900 text-sm leading-tight">
                                              936 mentions
                                            </p>
                                          </div>
                                          <div className="flex-1 overflow-hidden">
                                            <div className="flex cursor-pointer items-center justify-between gap-4 border-b px-5 py-3 transition-colors last:border-b-0 hover:bg-muted/50 bg-primary/10">
                                              <div className="flex min-w-0 flex-1 items-center gap-3">
                                                <div className="flex shrink-0 items-center justify-center">
                                                  <div className="flex shrink-0 items-center justify-center overflow-hidden border bg-white size-7 rounded-sm">
                                                    <div className="flex h-full w-full items-center justify-center rounded font-medium text-muted-foreground text-sm">
                                                      C
                                                    </div>
                                                  </div>
                                                </div>
                                                <div className="flex min-w-0 flex-1 flex-col">
                                                  <div className="truncate font-medium text-xs">
                                                    JPMorgan Chase
                                                  </div>
                                                </div>
                                              </div>
                                              <div className="flex shrink-0 items-center gap-3">
                                                <div className="text-right">
                                                  <div className="font-medium font-mono text-muted-foreground text-xs">
                                                    32.0%
                                                  </div>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                  <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="currentColor"
                                                    viewBox="0 0 256 256"
                                                    className="h-3 w-3 text-green-600"
                                                  >
                                                    <path d="M215.39,163.06A8,8,0,0,1,208,168H48a8,8,0,0,1-5.66-13.66l80-80a8,8,0,0,1,11.32,0l80,80A8,8,0,0,1,215.39,163.06Z"></path>
                                                  </svg>
                                                  <span className="font-medium text-green-600 text-xs">
                                                    2
                                                  </span>
                                                </div>
                                              </div>
                                            </div>
                                            <div className="flex cursor-pointer items-center justify-between gap-4 border-b px-5 py-3 transition-colors last:border-b-0 hover:bg-muted/50 bg-white">
                                              <div className="flex min-w-0 flex-1 items-center gap-3">
                                                <div className="flex shrink-0 items-center justify-center">
                                                  <div className="flex shrink-0 items-center justify-center overflow-hidden border bg-white size-7 rounded-sm">
                                                    <div className="flex h-full w-full items-center justify-center rounded font-medium text-muted-foreground text-sm">
                                                      B
                                                    </div>
                                                  </div>
                                                </div>
                                                <div className="flex min-w-0 flex-1 flex-col">
                                                  <div className="truncate font-medium text-xs">
                                                    Bank of America
                                                  </div>
                                                </div>
                                              </div>
                                              <div className="flex shrink-0 items-center gap-3">
                                                <div className="text-right">
                                                  <div className="font-medium font-mono text-muted-foreground text-xs">
                                                    24.6%
                                                  </div>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                  <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="currentColor"
                                                    viewBox="0 0 256 256"
                                                    className="h-3 w-3 text-red-600"
                                                  >
                                                    <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,48,88H208a8,8,0,0,1,5.66,13.66Z"></path>
                                                  </svg>
                                                  <span className="font-medium text-red-600 text-xs">
                                                    1
                                                  </span>
                                                </div>
                                              </div>
                                            </div>
                                            <div className="flex cursor-pointer items-center justify-between gap-4 border-b px-5 py-3 transition-colors last:border-b-0 hover:bg-muted/50 bg-white">
                                              <div className="flex min-w-0 flex-1 items-center gap-3">
                                                <div className="flex shrink-0 items-center justify-center">
                                                  <div className="flex shrink-0 items-center justify-center overflow-hidden border bg-white size-7 rounded-sm">
                                                    <div className="flex h-full w-full items-center justify-center rounded font-medium text-muted-foreground text-sm">
                                                      C
                                                    </div>
                                                  </div>
                                                </div>
                                                <div className="flex min-w-0 flex-1 flex-col">
                                                  <div className="truncate font-medium text-xs">
                                                    Citigroup
                                                  </div>
                                                </div>
                                              </div>
                                              <div className="flex shrink-0 items-center gap-3">
                                                <div className="text-right">
                                                  <div className="font-medium font-mono text-muted-foreground text-xs">
                                                    22.1%
                                                  </div>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                  <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="currentColor"
                                                    viewBox="0 0 256 256"
                                                    className="h-3 w-3 text-green-600"
                                                  >
                                                    <path d="M215.39,163.06A8,8,0,0,1,208,168H48a8,8,0,0,1-5.66-13.66l80-80a8,8,0,0,1,11.32,0l80,80A8,8,0,0,1,215.39,163.06Z"></path>
                                                  </svg>
                                                  <span className="font-medium text-green-600 text-xs">
                                                    1
                                                  </span>
                                                </div>
                                              </div>
                                            </div>
                                            <div className="flex cursor-pointer items-center justify-between gap-4 border-b px-5 py-3 transition-colors last:border-b-0 hover:bg-muted/50 bg-white">
                                              <div className="flex min-w-0 flex-1 items-center gap-3">
                                                <div className="flex shrink-0 items-center justify-center">
                                                  <div className="flex shrink-0 items-center justify-center overflow-hidden border bg-white size-7 rounded-sm">
                                                    <div className="flex h-full w-full items-center justify-center rounded font-medium text-muted-foreground text-sm">
                                                      W
                                                    </div>
                                                  </div>
                                                </div>
                                                <div className="flex min-w-0 flex-1 flex-col">
                                                  <div className="truncate font-medium text-xs">
                                                    Wells Fargo
                                                  </div>
                                                </div>
                                              </div>
                                              <div className="flex shrink-0 items-center gap-3">
                                                <div className="text-right">
                                                  <div className="font-medium font-mono text-muted-foreground text-xs">
                                                    10.3%
                                                  </div>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                  <span className="font-medium text-gray-400 text-xs">
                                                    — 0
                                                  </span>
                                                </div>
                                              </div>
                                            </div>
                                            <div className="flex cursor-pointer items-center justify-between gap-4 border-b px-5 py-3 transition-colors last:border-b-0 hover:bg-muted/50 bg-white">
                                              <div className="flex min-w-0 flex-1 items-center gap-3">
                                                <div className="flex shrink-0 items-center justify-center">
                                                  <div className="flex shrink-0 items-center justify-center overflow-hidden border bg-white size-7 rounded-sm">
                                                    <div className="flex h-full w-full items-center justify-center rounded font-medium text-muted-foreground text-sm">
                                                      U
                                                    </div>
                                                  </div>
                                                </div>
                                                <div className="flex min-w-0 flex-1 flex-col">
                                                  <div className="truncate font-medium text-xs">
                                                    U.S. Bank
                                                  </div>
                                                </div>
                                              </div>
                                              <div className="flex shrink-0 items-center gap-3">
                                                <div className="text-right">
                                                  <div className="font-medium font-mono text-muted-foreground text-xs">
                                                    6.3%
                                                  </div>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                  <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="currentColor"
                                                    viewBox="0 0 256 256"
                                                    className="h-3 w-3 text-green-600"
                                                  >
                                                    <path d="M215.39,163.06A8,8,0,0,1,208,168H48a8,8,0,0,1-5.66-13.66l80-80a8,8,0,0,1,11.32,0l80,80A8,8,0,0,1,215.39,163.06Z"></path>
                                                  </svg>
                                                  <span className="font-medium text-green-600 text-xs">
                                                    3
                                                  </span>
                                                </div>
                                              </div>
                                            </div>
                                            <div className="flex cursor-pointer items-center justify-between gap-4 border-b px-5 py-3 transition-colors last:border-b-0 hover:bg-muted/50 bg-white">
                                              <div className="flex min-w-0 flex-1 items-center gap-3">
                                                <div className="flex shrink-0 items-center justify-center">
                                                  <div className="flex shrink-0 items-center justify-center overflow-hidden border bg-white size-7 rounded-sm">
                                                    <div className="flex h-full w-full items-center justify-center rounded font-medium text-muted-foreground text-sm">
                                                      G
                                                    </div>
                                                  </div>
                                                </div>
                                                <div className="flex min-w-0 flex-1 flex-col">
                                                  <div className="truncate font-medium text-xs">
                                                    Goldman Sachs
                                                  </div>
                                                </div>
                                              </div>
                                              <div className="flex shrink-0 items-center gap-3">
                                                <div className="text-right">
                                                  <div className="font-medium font-mono text-muted-foreground text-xs">
                                                    6.0%
                                                  </div>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                  <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="currentColor"
                                                    viewBox="0 0 256 256"
                                                    className="h-3 w-3 text-red-600"
                                                  >
                                                    <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,48,88H208a8,8,0,0,1,5.66,13.66Z"></path>
                                                  </svg>
                                                  <span className="font-medium text-red-600 text-xs">
                                                    2
                                                  </span>
                                                </div>
                                              </div>
                                            </div>
                                            <div className="flex cursor-pointer items-center justify-between gap-4 border-b px-5 py-3 transition-colors last:border-b-0 hover:bg-muted/50 bg-white">
                                              <div className="flex min-w-0 flex-1 items-center gap-3">
                                                <div className="flex shrink-0 items-center justify-center">
                                                  <div className="flex shrink-0 items-center justify-center overflow-hidden border bg-white size-7 rounded-sm">
                                                    <div className="flex h-full w-full items-center justify-center rounded font-medium text-muted-foreground text-sm">
                                                      P
                                                    </div>
                                                  </div>
                                                </div>
                                                <div className="flex min-w-0 flex-1 flex-col">
                                                  <div className="truncate font-medium text-xs">
                                                    PNC Financial
                                                  </div>
                                                </div>
                                              </div>
                                              <div className="flex shrink-0 items-center gap-3">
                                                <div className="text-right">
                                                  <div className="font-medium font-mono text-muted-foreground text-xs">
                                                    5.8%
                                                  </div>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                  <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="currentColor"
                                                    viewBox="0 0 256 256"
                                                    className="h-3 w-3 text-red-600"
                                                  >
                                                    <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,48,88H208a8,8,0,0,1,5.66,13.66Z"></path>
                                                  </svg>
                                                  <span className="font-medium text-red-600 text-xs">
                                                    1
                                                  </span>
                                                </div>
                                              </div>
                                            </div>
                                            <div className="flex cursor-pointer items-center justify-between gap-4 border-b px-5 py-3 transition-colors last:border-b-0 hover:bg-muted/50 bg-white">
                                              <div className="flex min-w-0 flex-1 items-center gap-3">
                                                <div className="flex shrink-0 items-center justify-center">
                                                  <div className="flex shrink-0 items-center justify-center overflow-hidden border bg-white size-7 rounded-sm">
                                                    <div className="flex h-full w-full items-center justify-center rounded font-medium text-muted-foreground text-sm">
                                                      M
                                                    </div>
                                                  </div>
                                                </div>
                                                <div className="flex min-w-0 flex-1 flex-col">
                                                  <div className="truncate font-medium text-xs">
                                                    Morgan Stanley
                                                  </div>
                                                </div>
                                              </div>
                                              <div className="flex shrink-0 items-center gap-3">
                                                <div className="text-right">
                                                  <div className="font-medium font-mono text-muted-foreground text-xs">
                                                    4.1%
                                                  </div>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                  <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="currentColor"
                                                    viewBox="0 0 256 256"
                                                    className="h-3 w-3 text-green-600"
                                                  >
                                                    <path d="M215.39,163.06A8,8,0,0,1,208,168H48a8,8,0,0,1-5.66-13.66l80-80a8,8,0,0,1,11.32,0l80,80A8,8,0,0,1,215.39,163.06Z"></path>
                                                  </svg>
                                                  <span className="font-medium text-green-600 text-xs">
                                                    1
                                                  </span>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className="absolute bottom-8 hidden shadow-xl md:block right-8"
                      style={{ opacity: "1", transform: "none" }}
                    >
                      <div className="group max-w-md cursor-pointer overflow-hidden rounded-lg border shadow-xs transition-all duration-200 hover:shadow-md border-white/10 bg-zinc-900/90">
                        <div className="flex items-center gap-4 py-1 pr-4 pl-1">
                          <div
                            className="relative h-14 w-24 shrink-0 overflow-hidden rounded-md bg-center bg-cover"
                            style={{
                              backgroundImage: "url(&quot",
                              //   https:
                              //     "//fast.wistia.com/embed/medias/j4xrknvpc4/swatch&quot",
                            }}
                          >
                            <div className="absolute inset-0 flex items-center justify-center bg-black/5 transition-colors group-hover:bg-black/10">
                              <div className="rounded-full bg-white/60 p-1 transition-transform group-hover:scale-110">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="currentColor"
                                  viewBox="0 0 256 256"
                                  className="h-3 w-3 fill-current text-gray-900"
                                >
                                  <path d="M240,128a15.74,15.74,0,0,1-7.6,13.51L88.32,229.65a16,16,0,0,1-16.2.3A15.86,15.86,0,0,1,64,216.13V39.87a15.86,15.86,0,0,1,8.12-13.82,16,16,0,0,1,16.2.3L232.4,114.49A15.74,15.74,0,0,1,240,128Z"></path>
                                </svg>
                              </div>
                            </div>
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-sm text-zinc-100">
                              See Promptwatch in action
                            </h3>
                            <p className="mt-0.5 text-xs text-zinc-400">
                              Watch a 1-minute demo
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div aria-hidden="true" className="p-[0.5px]">
            <div className="h-full rounded bg-background/75 max-lg:w-2"></div>
          </div>
        </div>
        <section>
          <div className="@container grid grid-cols-[auto_1fr_auto] lg:grid-cols-[1fr_minmax(0,69rem)_1fr]">
            <div aria-hidden="true" className="p-[0.5px]">
              <div className="h-full rounded bg-background/75 max-lg:w-2"></div>
            </div>
            <div className="mx-auto w-full max-w-276 lg:min-w-5xl xl:min-w-276">
              <div className="grid *:p-[0.5px] **:data-grid-content:h-full **:data-grid-content:rounded **:data-grid-content:bg-background/75 grid-cols-2 md:grid-cols-5">
                <div className="col-span-full">
                  <div className="py-4" data-grid-content="true">
                    <h4 className="mx-auto max-w-xl text-balance text-center font-normal text-muted-foreground md:text-base lg:text-lg">
                      Join <span>1,840+</span> <a href="/">brands</a> and{" "}
                      <a href="/solutions/agencies">agencies</a> using
                      Promptwatch
                    </h4>
                  </div>
                </div>
                <div className="">
                  <div
                    className="overflow-hidden bg-white!"
                    data-grid-content="true"
                  >
                    <div
                      className="flex h-24 items-center justify-center px-6"
                      style={{
                        opacity: "1",
                        filter: "blur(0px)",
                        transform: "none",
                      }}
                    >
                      <Image
                        src="/assets/imageplaceholder.svg"
                        alt="Promptwatch customer Brightdata Logo"
                        width={160}
                        height={64}
                        className="h-8 w-auto max-w-full overflow-hidden object-contain"
                      />
                    </div>
                  </div>
                </div>
                <div className="">
                  <div
                    className="overflow-hidden bg-white!"
                    data-grid-content="true"
                  >
                    <div
                      className="flex h-24 items-center justify-center px-6"
                      style={{
                        opacity: "1",
                        filter: "blur(0px)",
                        transform: "none",
                      }}
                    >
                      <Image
                        src="/assets/imageplaceholder.svg"
                        alt="Promptwatch customer Typeform"
                        width={160}
                        height={64}
                        className="h-6 w-auto max-w-full overflow-hidden object-contain"
                      />
                    </div>
                  </div>
                </div>
                <div className="">
                  <div
                    className="overflow-hidden bg-white!"
                    data-grid-content="true"
                  >
                    <div
                      className="flex h-24 items-center justify-center px-6"
                      style={{
                        opacity: "1",
                        filter: "blur(0px)",
                        transform: "none",
                      }}
                    >
                      <Image
                        src="/assets/imageplaceholder.svg"
                        alt="Promptwatch customer END. Clothing Logo"
                        width={160}
                        height={64}
                        className="h-8 w-auto max-w-full overflow-hidden object-contain"
                      />
                    </div>
                  </div>
                </div>
                <div className="">
                  <div
                    className="overflow-hidden bg-white!"
                    data-grid-content="true"
                  >
                    <div
                      className="flex h-24 items-center justify-center px-6"
                      style={{
                        opacity: "1",
                        filter: "blur(0px)",
                        transform: "none",
                      }}
                    >
                      <Image
                        src="/assets/imageplaceholder.svg"
                        alt="Promptwatch customer Yelp"
                        width={160}
                        height={64}
                        className="h-10 w-auto max-w-full overflow-hidden object-contain"
                      />
                    </div>
                  </div>
                </div>
                <div className="">
                  <div
                    className="overflow-hidden bg-white!"
                    data-grid-content="true"
                  >
                    <div
                      className="flex h-24 items-center justify-center px-6"
                      style={{
                        opacity: "1",
                        filter: "blur(0px)",
                        transform: "none",
                      }}
                    >
                      <Image
                        src="/assets/imageplaceholder.svg"
                        alt="Promptwatch customer Duolingo"
                        width={160}
                        height={64}
                        className="h-11 w-auto max-w-full overflow-hidden object-contain"
                      />
                    </div>
                  </div>
                </div>
                <div className="">
                  <div
                    className="overflow-hidden bg-white!"
                    data-grid-content="true"
                  >
                    <div
                      className="flex h-24 items-center justify-center px-6"
                      style={{
                        opacity: "1",
                        filter: "blur(0px)",
                        transform: "none",
                      }}
                    >
                      <Image
                        src="/assets/imageplaceholder.svg"
                        alt="Promptwatch customer Valley Logo"
                        width={160}
                        height={64}
                        className="h-8 w-auto max-w-full overflow-hidden object-contain"
                      />
                    </div>
                  </div>
                </div>
                <div className="">
                  <div
                    className="overflow-hidden bg-white!"
                    data-grid-content="true"
                  >
                    <div
                      className="flex h-24 items-center justify-center px-6"
                      style={{
                        opacity: "1",
                        filter: "blur(0px)",
                        transform: "none",
                      }}
                    >
                      <Image
                        src="/assets/imageplaceholder.svg"
                        alt="Promptwatch customer Shutterstock Logo"
                        width={160}
                        height={64}
                        className="h-6 w-auto max-w-full overflow-hidden object-contain"
                      />
                    </div>
                  </div>
                </div>
                <div className="">
                  <div
                    className="overflow-hidden bg-white!"
                    data-grid-content="true"
                  >
                    <div
                      className="flex h-24 items-center justify-center px-6"
                      style={{
                        opacity: "1",
                        filter: "blur(0px)",
                        transform: "none",
                      }}
                    >
                      <Image
                        src="/assets/imageplaceholder.svg"
                        alt="Promptwatch customer Bitvavo Logo"
                        width={160}
                        height={64}
                        className="h-6 w-auto max-w-full overflow-hidden object-contain"
                      />
                    </div>
                  </div>
                </div>
                <div className="">
                  <div
                    className="overflow-hidden bg-white!"
                    data-grid-content="true"
                  >
                    <div
                      className="flex h-24 items-center justify-center px-6"
                      style={{
                        opacity: "1",
                        filter: "blur(0px)",
                        transform: "none",
                      }}
                    >
                      <Image
                        src="/assets/imageplaceholder.svg"
                        alt="Promptwatch customer OpenUp Logo"
                        width={160}
                        height={64}
                        className="h-6 w-auto max-w-full overflow-hidden object-contain"
                      />
                    </div>
                  </div>
                </div>
                <div className="">
                  <div
                    className="overflow-hidden bg-white!"
                    data-grid-content="true"
                  >
                    <div
                      className="flex h-24 items-center justify-center px-6"
                      style={{
                        opacity: "1",
                        filter: "blur(0px)",
                        transform: "none",
                      }}
                    >
                      <Image
                        src="/assets/imageplaceholder.svg"
                        alt="Promptwatch customer Sharp Logo"
                        width={160}
                        height={64}
                        className="h-5 w-auto max-w-full overflow-hidden object-contain"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div aria-hidden="true" className="p-[0.5px]">
              <div className="h-full rounded bg-background/75 max-lg:w-2"></div>
            </div>
          </div>
        </section>

        <div className="@container  grid grid-cols-[auto_1fr_auto] lg:grid-cols-[1fr_minmax(0,69rem)_1fr] border border-border overflow-hidden">
          {" "}
          {/* FIX: added border + rounding + overflow-hidden */}
          <div aria-hidden="true" className="p-[0.5px]">
            <div className="h-full rounded bg-[#fff]/75 max-lg:w-2"></div>{" "}
            {/* FIX: bg-background/75 -> bg-muted/75 */}
          </div>
          <div className="mx-auto w-full max-w-276 lg:min-w-5xl xl:min-w-276">
            <div className="grid *:p-[0.5px] **:data-grid-content:h-full **:data-grid-content:rounded **:data-grid-content:bg-[#fff]/75 relative">
              {" "}
              {/* FIX: rounded -> rounded-xl, bg-background/75 -> bg-muted/75 */}
              <div className="grid gap-px">
                <div
                  className="p-6 @4xl:px-8 @4xl:pt-20 @4xl:pb-14"
                  data-grid-content="true"
                >
                  <p className="inline-flex items-center gap-px text-xs tracking-widest text-muted-foreground mb-4">
                    <span
                      aria-hidden="true"
                      className="font-mono text-muted-foreground/50"
                    >
                      [
                    </span>
                    platform
                    <span
                      aria-hidden="true"
                      className="font-mono text-muted-foreground/50"
                    >
                      ]
                    </span>
                  </p>
                  <h2 className="mb-4 max-w-3xl text-pretty font-medium text-2xl text-foreground leading-tight lg:text-4xl">
                    Everything you need to win in{" "}
                    <span className="text-primary underline decoration-primary/50 decoration-dashed">
                      AI search
                    </span>
                  </h2>
                  <p className="max-w-2xl text-pretty font-normal text-base text-muted-foreground lg:text-lg">
                    Track, analyze, and optimize your brand's presence across
                    ChatGPT, Claude, Gemini, Perplexity, and other AI search
                    engines.
                  </p>
                </div>
                <div className="grid @md:grid-cols-2 @xl:grid-cols-3 gap-px">
                  <a
                    aria-label="Prompt Tracking. Track real user prompts and see when AI mentions your brand in its responses."
                    className="cursor-pointer focus-visible:outline-none"
                    href="#"
                  >
                    <div
                      className="relative flex h-full flex-col bg-white! @4xl:p-8 p-5"
                      data-grid-content="true"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 256 256"
                        aria-hidden="true"
                        className="absolute @4xl:top-6 top-4 @4xl:right-6 right-4 size-4 text-primary transition-all duration-150 translate-x-[-2px] translate-y-[2px] opacity-0"
                      >
                        <path d="M204,64V168a12,12,0,0,1-24,0V93L72.49,200.49a12,12,0,0,1-17-17L163,76H88a12,12,0,0,1,0-24H192A12,12,0,0,1,204,64Z"></path>
                      </svg>
                      <div>
                        <h3 className="font-medium text-foreground text-lg">
                          <span className="transition-colors duration-100 ">
                            Prompt Tracking
                          </span>
                        </h3>
                        <p className="mt-1 text-muted-foreground text-sm">
                          Track real user prompts and see when AI mentions your
                          brand in its responses.
                        </p>
                      </div>
                      <div className="mt-6" inert>
                        <div className="relative overflow-hidden rounded-xl border border-zinc-950/6 bg-stone-50/80 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.6)] h-64 ">
                          <div className="">
                            <div className="mask-b-from-65% group relative -mx-4 px-4  ">
                              <Image
                                src="/assets/imageplaceholder.svg"
                                alt=""
                                width={500}
                                height={500}
                                className=""
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </a>
                  <div className="cursor-default">
                    <div
                      className="relative flex h-full flex-col bg-white! @4xl:p-8 p-5"
                      data-grid-content="true"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 256 256"
                        aria-hidden="true"
                        className="absolute @4xl:top-6 top-4 @4xl:right-6 right-4 size-4 text-primary transition-all duration-150 translate-x-[-2px] translate-y-[2px] opacity-0"
                      >
                        <path d="M204,64V168a12,12,0,0,1-24,0V93L72.49,200.49a12,12,0,0,1-17-17L163,76H88a12,12,0,0,1,0-24H192A12,12,0,0,1,204,64Z"></path>
                      </svg>
                      <div>
                        <h3 className="font-medium text-foreground text-lg">
                          <span className="transition-colors duration-100 ">
                            Citations Analysis
                          </span>
                        </h3>
                        <p className="mt-1 text-muted-foreground text-sm">
                          Understand which citations drive visibility and
                          discover what content gets recommended.
                        </p>
                      </div>
                      <div className="mt-6" inert>
                        <div className="relative overflow-hidden rounded-xl border border-zinc-950/6 bg-stone-50/80 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.6)] h-64  ">
                          <div className="">
                            <div className="mask-b-from-65% group relative -mx-4 px-4  ">
                              <Image
                                src="/assets/imageplaceholder.svg"
                                alt=""
                                width={500}
                                height={500}
                                className=""
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <a
                    aria-label="Agent Analytics. See in real time when AI crawlers from ChatGPT, Gemini, and others read your pages."
                    className="cursor-pointer focus-visible:outline-none"
                    href="#"
                  >
                    <div
                      className="relative flex h-full flex-col bg-white! @4xl:p-8 p-5"
                      data-grid-content="true"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 256 256"
                        aria-hidden="true"
                        className="absolute @4xl:top-6 top-4 @4xl:right-6 right-4 size-4 text-primary transition-all duration-150 translate-x-[-2px] translate-y-[2px] opacity-0"
                      >
                        <path d="M204,64V168a12,12,0,0,1-24,0V93L72.49,200.49a12,12,0,0,1-17-17L163,76H88a12,12,0,0,1,0-24H192A12,12,0,0,1,204,64Z"></path>
                      </svg>
                      <div>
                        <h3 className="font-medium text-foreground text-lg">
                          <span className="transition-colors duration-100 ">
                            Agent Analytics
                          </span>
                        </h3>
                        <p className="mt-1 text-muted-foreground text-sm">
                          See in real time when AI crawlers from ChatGPT,
                          Gemini, and others read your pages.
                        </p>
                      </div>
                      <div className="mt-6" inert>
                        <div className="relative overflow-hidden rounded-xl border border-zinc-950/6 bg-stone-50/80 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.6)] h-64 ">
                          <div className="">
                            <div className="mask-b-from-65% group relative -mx-4 px-4  ">
                              <Image
                                src="/assets/imageplaceholder.svg"
                                alt=""
                                width={500}
                                height={500}
                                className=""
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </a>
                  <a
                    aria-label="Content Agent. AI agents that create content based on real citation data — content that gets cited."
                    className="cursor-pointer focus-visible:outline-none"
                    href="#"
                  >
                    <div
                      className="relative flex h-full flex-col bg-white! @4xl:p-8 p-5"
                      data-grid-content="true"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 256 256"
                        aria-hidden="true"
                        className="absolute @4xl:top-6 top-4 @4xl:right-6 right-4 size-4 text-primary transition-all duration-150 translate-x-[-2px] translate-y-[2px] opacity-0"
                      >
                        <path d="M204,64V168a12,12,0,0,1-24,0V93L72.49,200.49a12,12,0,0,1-17-17L163,76H88a12,12,0,0,1,0-24H192A12,12,0,0,1,204,64Z"></path>
                      </svg>
                      <div>
                        <h3 className="font-medium text-foreground text-lg">
                          <span className="transition-colors duration-100 ">
                            Content Agent
                          </span>
                        </h3>
                        <p className="mt-1 text-muted-foreground text-sm">
                          AI agents that create content based on real citation
                          data — content that gets cited.
                        </p>
                      </div>
                      <div className="mt-6" inert>
                        <div className="relative overflow-hidden rounded-xl border border-zinc-950/6 bg-stone-50/80 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.6)] h-64  ">
                          <div className="">
                            <div className="mask-b-from-65% group relative -mx-4 px-4  ">
                              <Image
                                src="/assets/imageplaceholder.svg"
                                alt=""
                                width={500}
                                height={500}
                                className=""
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </a>
                  <div className="cursor-default">
                    <div
                      className="relative flex h-full flex-col bg-white! @4xl:p-8 p-5"
                      data-grid-content="true"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 256 256"
                        aria-hidden="true"
                        className="absolute @4xl:top-6 top-4 @4xl:right-6 right-4 size-4 text-primary transition-all duration-150 translate-x-[-2px] translate-y-[2px] opacity-0"
                      >
                        <path d="M204,64V168a12,12,0,0,1-24,0V93L72.49,200.49a12,12,0,0,1-17-17L163,76H88a12,12,0,0,1,0-24H192A12,12,0,0,1,204,64Z"></path>
                      </svg>
                      <div>
                        <h3 className="font-medium text-foreground text-lg">
                          <span className="transition-colors duration-100 ">
                            AI Visibility
                          </span>
                        </h3>
                        <p className="mt-1 text-muted-foreground text-sm">
                          Monitor your visibility score, sentiment, and share of
                          voice across all AI platforms.
                        </p>
                      </div>
                      <div className="mt-6" inert>
                        <div className="relative overflow-hidden rounded-xl border border-zinc-950/6 bg-stone-50/80 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.6)] h-64  ">
                          <div className="">
                            <div className="mask-b-from-65% group relative -mx-4 px-4  ">
                              <Image
                                src="/assets/imageplaceholder.svg"
                                alt=""
                                width={500}
                                height={500}
                                className=""
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="cursor-default">
                    <div
                      className="relative flex h-full flex-col bg-white! @4xl:p-8 p-5"
                      data-grid-content="true"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 256 256"
                        aria-hidden="true"
                        className="absolute @4xl:top-6 top-4 @4xl:right-6 right-4 size-4 text-primary transition-all duration-150 translate-x-[-2px] translate-y-[2px] opacity-0"
                      >
                        <path d="M204,64V168a12,12,0,0,1-24,0V93L72.49,200.49a12,12,0,0,1-17-17L163,76H88a12,12,0,0,1,0-24H192A12,12,0,0,1,204,64Z"></path>
                      </svg>
                      <div>
                        <h3 className="font-medium text-foreground text-lg">
                          <span className="transition-colors duration-100 ">
                            Real-time Tracking
                          </span>
                        </h3>
                        <p className="mt-1 text-muted-foreground text-sm">
                          Track your website's real-time mentions and visibility
                          in AI search engines.
                        </p>
                      </div>
                      <div className="mt-6" inert>
                        <div className="relative overflow-hidden rounded-xl border border-zinc-950/6 bg-stone-50/80 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.6)] h-64  ">
                          <div className="">
                            <div className="mask-b-from-65% group relative -mx-4 px-4  ">
                              <Image
                                src="/assets/imageplaceholder.svg"
                                alt=""
                                width={500}
                                height={500}
                                className=""
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div aria-hidden="true" className="p-[0.5px]">
            <div className="h-full rounded bg-[#fff]/75 max-lg:w-2"></div>{" "}
            {/* FIX: bg-background/75 -> bg-muted/75 */}
          </div>
        </div>
        <div className="@container grid grid-cols-[auto_1fr_auto] lg:grid-cols-[1fr_minmax(0,69rem)_1fr]">
          <div aria-hidden="true" className="p-[0.5px]">
            <div className="h-full rounded bg-background/75 max-lg:w-2"></div>
          </div>
          <div className="mx-auto w-full max-w-276 lg:min-w-5xl xl:min-w-276 p-[0.5px]">
            <div className="rounded bg-background/75 h-24" data-slot="content">
              <div className="h-24"></div>
            </div>
          </div>
          <div aria-hidden="true" className="p-[0.5px]">
            <div className="h-full rounded bg-background/75 max-lg:w-2"></div>
          </div>
        </div>
        <div className="@container grid grid-cols-[auto_1fr_auto] lg:grid-cols-[1fr_minmax(0,69rem)_1fr]">
          <div aria-hidden="true" className="p-[0.5px]">
            <div className="h-full rounded bg-background/75 max-lg:w-2"></div>
          </div>
          <div className="mx-auto w-full max-w-276 lg:min-w-5xl xl:min-w-276">
            <div className="grid *:p-[0.5px] **:data-grid-content:h-full **:data-grid-content:rounded **:data-grid-content:bg-background/75 @4xl:grid-cols-2">
              <div className="@4xl:col-span-2">
                <div
                  className="flex items-center justify-between gap-3 @4xl:px-8 px-6 py-3"
                  data-grid-content="true"
                >
                  <div className="space-y-2">
                    <p className="inline-flex items-center gap-px text-xs tracking-widest text-muted-foreground">
                      <span
                        aria-hidden="true"
                        className="font-mono text-muted-foreground/50"
                      >
                        [
                      </span>
                      Testimonials
                      <span
                        aria-hidden="true"
                        className="font-mono text-muted-foreground/50"
                      >
                        ]
                      </span>
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="hidden sm:block">
                      <div className="flex items-center gap-2">
                        <button
                          aria-label="Go to slide 1"
                          className="h-1.5 rounded-full transition-all duration-300 w-8 bg-primary"
                          type="button"
                        ></button>
                        <button
                          aria-label="Go to slide 2"
                          className="h-1.5 rounded-full transition-all duration-300 w-4 bg-gray-200 hover:bg-gray-300"
                          type="button"
                        ></button>
                        <button
                          aria-label="Go to slide 3"
                          className="h-1.5 rounded-full transition-all duration-300 w-4 bg-gray-200 hover:bg-gray-300"
                          type="button"
                        ></button>
                        <button
                          aria-label="Go to slide 4"
                          className="h-1.5 rounded-full transition-all duration-300 w-4 bg-gray-200 hover:bg-gray-300"
                          type="button"
                        ></button>
                        <button
                          aria-label="Go to slide 5"
                          className="h-1.5 rounded-full transition-all duration-300 w-4 bg-gray-200 hover:bg-gray-300"
                          type="button"
                        ></button>
                        <button
                          aria-label="Go to slide 6"
                          className="h-1.5 rounded-full transition-all duration-300 w-4 bg-gray-200 hover:bg-gray-300"
                          type="button"
                        ></button>
                        <button
                          aria-label="Go to slide 7"
                          className="h-1.5 rounded-full transition-all duration-300 w-4 bg-gray-200 hover:bg-gray-300"
                          type="button"
                        ></button>
                        <button
                          aria-label="Go to slide 8"
                          className="h-1.5 rounded-full transition-all duration-300 w-4 bg-gray-200 hover:bg-gray-300"
                          type="button"
                        ></button>
                        <button
                          aria-label="Go to slide 9"
                          className="h-1.5 rounded-full transition-all duration-300 w-4 bg-gray-200 hover:bg-gray-300"
                          type="button"
                        ></button>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        className="inline-flex cursor-pointer items-center justify-center whitespace-nowrap font-medium text-sm transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0 focus-visible:ring-1 focus-visible:ring-ring active:scale-[0.99] active:transition-none border border-transparent bg-background shadow-black/15 shadow-sm ring-1 ring-foreground/10 duration-200 hover:bg-muted/50 size-5 rounded-full"
                        aria-label="Previous testimonials"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 256 256"
                          className="size-2.5"
                        >
                          <path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"></path>
                        </svg>
                      </button>
                      <button
                        className="inline-flex cursor-pointer items-center justify-center whitespace-nowrap font-medium text-sm transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0 focus-visible:ring-1 focus-visible:ring-ring active:scale-[0.99] active:transition-none border border-transparent bg-background shadow-black/15 shadow-sm ring-1 ring-foreground/10 duration-200 hover:bg-muted/50 size-5 rounded-full"
                        aria-label="Next testimonials"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 256 256"
                          className="size-2.5"
                        >
                          <path d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="overflow-hidden p-0! @4xl:col-span-2">
                <div
                  className="flex transition-transform duration-500 ease-out will-change-transform motion-reduce:transition-none"
                  style={{ transform: "translate3d(0%, 0px, 0px)" }}
                >
                  <div className="min-w-0 shrink-0 @4xl:basis-1/2 basis-full p-[0.5px]">
                    <div className="h-full min-h-72">
                      <div
                        className="relative grid h-full grid-rows-[3.5rem_1fr_2.5rem] gap-3 overflow-hidden bg-background! p-5"
                        data-grid-content="true"
                      >
                        <div
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-1 rounded-lg"
                          style={{
                            backgroundImage:
                              "radial-gradient(circle at 50% 90%, #0E68A920 0%, transparent 60%)",
                          }}
                        ></div>
                        <div className="relative z-10 flex h-14 items-start">
                          <Image
                            src="/assets/imageplaceholder.svg"
                            alt={"NXT Pharma"}
                            width={140}
                            height={24}
                            className="w-auto object-contain max-h-10"
                          />
                        </div>
                        <div className="relative z-10">
                          <p className='line-clamp-5 text-balance font-semibold text-base text-foreground/80 before:mr-1 before:content-["\201C"] after:ml-1 after:content-["\201D"] md:text-base'>
                            Promptwatch stands out for its powerful features,
                            especially its earned media tracking for off-site
                            mentions, the 'Actions' feature, and its
                            well-documented API integrations. It overall helps
                            us take the right actions to improve our visibility
                            in AI Search engines.
                          </p>
                        </div>
                        <div className="relative z-10 flex items-center gap-3">
                          <div className="aspect-square size-10 overflow-hidden rounded-full border border-transparent shadow-black/15 shadow-md ring-1 ring-foreground/10">
                            <Image
                              src="/assets/imageplaceholder.svg"
                              alt={"Rutger van der Lee's avatar"}
                              width={80}
                              height={80}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="space-y-px">
                            <p className="font-medium text-sm">
                              Rutger van der Lee
                            </p>
                            <p className="text-xs">Founder, NXT Pharma</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="min-w-0 shrink-0 @4xl:basis-1/2 basis-full p-[0.5px]">
                    <div className="h-full min-h-72">
                      <div
                        className="relative grid h-full grid-rows-[3.5rem_1fr_2.5rem] gap-3 overflow-hidden bg-background! p-5"
                        data-grid-content="true"
                      >
                        <div
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-1 rounded-lg"
                          style={{
                            backgroundImage:
                              "radial-gradient(circle at 50% 90%, #E4231320 0%, transparent 60%)",
                          }}
                        ></div>
                        <div className="relative z-10 flex h-14 items-start">
                          <Image
                            src="/assets/imageplaceholder.svg"
                            alt={"Six Group"}
                            width={122}
                            height={45}
                            className="w-auto object-contain h-6"
                          />
                        </div>
                        <div className="relative z-10">
                          <p className='line-clamp-5 text-balance font-semibold text-base text-foreground/80 before:mr-1 before:content-["\201C"] after:ml-1 after:content-["\201D"] md:text-base'>
                            Promptwatch gives us a comprehensive way to explore
                            AI visibility data in depth, uncover patterns, and
                            better understand where our brand appears across
                            generative search experiences.
                          </p>
                        </div>
                        <div className="relative z-10 flex items-center gap-3">
                          <div className="aspect-square size-10 overflow-hidden rounded-full border border-transparent shadow-black/15 shadow-md ring-1 ring-foreground/10">
                            <Image
                              src="/assets/imageplaceholder.svg"
                              alt={"Susanna Marsiglia's avatar"}
                              width={80}
                              height={80}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="space-y-px">
                            <p className="font-medium text-sm">
                              Susanna Marsiglia
                            </p>
                            <p className="text-xs">
                              Senior SEO Consultant and UX Specialist, Six Group
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="min-w-0 shrink-0 @4xl:basis-1/2 basis-full p-[0.5px]">
                    <div className="h-full min-h-72">
                      <div
                        className="relative grid h-full grid-rows-[3.5rem_1fr_2.5rem] gap-3 overflow-hidden bg-background! p-5"
                        data-grid-content="true"
                      >
                        <div
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-1 rounded-lg"
                          style={{
                            backgroundImage:
                              "radial-gradient(circle at 50% 90%, #05604F20 0%, transparent 60%)",
                          }}
                        ></div>
                        <div className="relative z-10 flex h-14 items-start">
                          <Image
                            src="/assets/imageplaceholder.svg"
                            alt={"Center Parcs"}
                            width={112}
                            height={48}
                            className="w-auto object-contain max-h-10"
                          />
                        </div>
                        <div className="relative z-10">
                          <p className='line-clamp-5 text-balance font-semibold text-base text-foreground/80 before:mr-1 before:content-["\201C"] after:ml-1 after:content-["\201D"] md:text-base'>
                            Promptwatch stands out due to how practical it is. A
                            tool built for real business needs in the growing AI
                            Search space
                          </p>
                        </div>
                        <div className="relative z-10 flex items-center gap-3">
                          <div className="aspect-square size-10 overflow-hidden rounded-full border border-transparent shadow-black/15 shadow-md ring-1 ring-foreground/10">
                            <Image
                              src="/assets/imageplaceholder.svg"
                              alt={"Pim Broekstra's avatar"}
                              width={80}
                              height={80}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="space-y-px">
                            <p className="font-medium text-sm">Pim Broekstra</p>
                            <p className="text-xs">SEO manager, Center Parcs</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="min-w-0 shrink-0 @4xl:basis-1/2 basis-full p-[0.5px]">
                    <div className="h-full min-h-72">
                      <div
                        className="relative grid h-full grid-rows-[3.5rem_1fr_2.5rem] gap-3 overflow-hidden bg-background! p-5"
                        data-grid-content="true"
                      >
                        <div
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-1 rounded-lg"
                          style={{
                            backgroundImage:
                              "radial-gradient(circle at 50% 90%, #EE5A5420 0%, transparent 60%)",
                          }}
                        ></div>
                        <div className="relative z-10 flex h-14 items-start">
                          <Image
                            src="/assets/imageplaceholder.svg"
                            alt={"Elaboratum"}
                            width={84}
                            height={16}
                            className="w-auto object-contain h-6"
                          />
                        </div>
                        <div className="relative z-10">
                          <p className='line-clamp-5 text-balance font-semibold text-base text-foreground/80 before:mr-1 before:content-["\201C"] after:ml-1 after:content-["\201D"] md:text-base'>
                            Promptwatch is a game changer for us. It gives
                            brands actionable insights into AI visibility and
                            helps us quickly turn those insights into practical
                            next steps that actually improve performance.
                          </p>
                        </div>
                        <div className="relative z-10 flex items-center gap-3">
                          <div className="aspect-square size-10 overflow-hidden rounded-full border border-transparent shadow-black/15 shadow-md ring-1 ring-foreground/10">
                            <Image
                              src="/assets/imageplaceholder.svg"
                              alt={"Alessandro Di Vito's avatar"}
                              width={80}
                              height={80}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="space-y-px">
                            <p className="font-medium text-sm">
                              Alessandro Di Vito
                            </p>
                            <p className="text-xs">
                              Managing Consultant, Elaboratum
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="min-w-0 shrink-0 @4xl:basis-1/2 basis-full p-[0.5px]">
                    <div className="h-full min-h-72">
                      <div
                        className="relative grid h-full grid-rows-[3.5rem_1fr_2.5rem] gap-3 overflow-hidden bg-background! p-5"
                        data-grid-content="true"
                      >
                        <div
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-1 rounded-lg"
                          style={{
                            backgroundImage:
                              "radial-gradient(circle at 50% 90%, #550cff20 0%, transparent 60%)",
                          }}
                        ></div>
                        <div className="relative z-10 flex h-14 items-start">
                          <Image
                            src="/assets/imageplaceholder.svg"
                            alt={"MX2"}
                            width={180}
                            height={18}
                            className="w-auto object-contain max-h-10"
                          />
                        </div>
                        <div className="relative z-10">
                          <p className='line-clamp-5 text-balance font-semibold text-base text-foreground/80 before:mr-1 before:content-["\201C"] after:ml-1 after:content-["\201D"] md:text-base'>
                            Promptwatch makes it easy to monitor AI visibility
                            across multiple clients, with an intuitive
                            dashboard, rapid product improvements, and a highly
                            responsive customer success team.
                          </p>
                        </div>
                        <div className="relative z-10 flex items-center gap-3">
                          <div className="aspect-square size-10 overflow-hidden rounded-full border border-transparent shadow-black/15 shadow-md ring-1 ring-foreground/10">
                            <Image
                              src="/assets/imageplaceholder.svg"
                              alt={"Joep Meertens's avatar"}
                              width={80}
                              height={80}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="space-y-px">
                            <p className="font-medium text-sm">Joep Meertens</p>
                            <p className="text-xs">Co-Founder, MX2</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="min-w-0 shrink-0 @4xl:basis-1/2 basis-full p-[0.5px]">
                    <div className="h-full min-h-72">
                      <div
                        className="relative grid h-full grid-rows-[3.5rem_1fr_2.5rem] gap-3 overflow-hidden bg-background! p-5"
                        data-grid-content="true"
                      >
                        <div
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-1 rounded-lg"
                          style={{
                            backgroundImage:
                              "radial-gradient(circle at 50% 90%, #2F6BE620 0%, transparent 60%)",
                          }}
                        ></div>
                        <div className="relative z-10 flex h-14 items-start">
                          <Image
                            src="/assets/imageplaceholder.svg"
                            alt={"Scrolling"}
                            width={132}
                            height={28}
                            className="w-auto object-contain max-h-10 h-7"
                          />
                        </div>
                        <div className="relative z-10">
                          <p className='line-clamp-5 text-balance font-semibold text-base text-foreground/80 before:mr-1 before:content-["\201C"] after:ml-1 after:content-["\201D"] md:text-base'>
                            Promptwatch offers the best mix of value,
                            innovation, and features we've seen. They ship
                            meaningful improvements consistently, and their
                            outstanding, Spanish-speaking support team has been
                            a huge asset for us.
                          </p>
                        </div>
                        <div className="relative z-10 flex items-center gap-3">
                          <div className="aspect-square size-10 overflow-hidden rounded-full border border-transparent shadow-black/15 shadow-md ring-1 ring-foreground/10">
                            <Image
                              src="/assets/imageplaceholder.svg"
                              alt={"Manuel Montilla's avatar"}
                              width={80}
                              height={80}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="space-y-px">
                            <p className="font-medium text-sm">
                              Manuel Montilla
                            </p>
                            <p className="text-xs">Founder/CEO, Scrolling</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="min-w-0 shrink-0 @4xl:basis-1/2 basis-full p-[0.5px]">
                    <div className="h-full min-h-72">
                      <div
                        className="relative grid h-full grid-rows-[3.5rem_1fr_2.5rem] gap-3 overflow-hidden bg-background! p-5"
                        data-grid-content="true"
                      >
                        <div
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-1 rounded-lg"
                          style={{
                            backgroundImage:
                              "radial-gradient(circle at 50% 90%, #00604f20 0%, transparent 60%)",
                          }}
                        ></div>
                        <div className="relative z-10 flex h-14 items-start">
                          <Image
                            src="/assets/imageplaceholder.svg"
                            alt={"NoNonsense"}
                            width={42}
                            height={48}
                            className="w-auto object-contain max-h-10"
                          />
                        </div>
                        <div className="relative z-10">
                          <p className='line-clamp-5 text-balance font-semibold text-base text-foreground/80 before:mr-1 before:content-["\201C"] after:ml-1 after:content-["\201D"] md:text-base'>
                            Promptwatch combines powerful GEO insights with
                            content gap analysis to turn AI visibility
                            challenges into actionable opportunities. It helps
                            us understand what’s missing, prioritize
                            improvements, and optimize more effectively for
                            LLMs.
                          </p>
                        </div>
                        <div className="relative z-10 flex items-center gap-3">
                          <div className="aspect-square size-10 overflow-hidden rounded-full border border-transparent shadow-black/15 shadow-md ring-1 ring-foreground/10">
                            <Image
                              src="/assets/imageplaceholder.svg"
                              alt={"Stijn Visser's avatar"}
                              width={80}
                              height={80}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="space-y-px">
                            <p className="font-medium text-sm">Stijn Visser</p>
                            <p className="text-xs">
                              Marketing Innovation Lead, Bambuu
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="min-w-0 shrink-0 @4xl:basis-1/2 basis-full p-[0.5px]">
                    <div className="h-full min-h-72">
                      <div
                        className="relative grid h-full grid-rows-[3.5rem_1fr_2.5rem] gap-3 overflow-hidden bg-background! p-5"
                        data-grid-content="true"
                      >
                        <div
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-1 rounded-lg"
                          style={{
                            backgroundImage:
                              "radial-gradient(circle at 50% 90%, #94C22020 0%, transparent 60%)",
                          }}
                        ></div>
                        <div className="relative z-10 flex h-14 items-start">
                          <Image
                            src="/assets/imageplaceholder.svg"
                            alt={"Schoonenberg"}
                            width={80}
                            height={48}
                            className="w-auto object-contain max-h-10"
                          />
                        </div>
                        <div className="relative z-10">
                          <p className='line-clamp-5 text-balance font-semibold text-base text-foreground/80 before:mr-1 before:content-["\201C"] after:ml-1 after:content-["\201D"] md:text-base'>
                            Promptwatch delivers GEO insights you simply can't
                            find in legacy search tools, and shows you exactly
                            what content your website is missing to appear in AI
                            Search engines.
                          </p>
                        </div>
                        <div className="relative z-10 flex items-center gap-3">
                          <div className="aspect-square size-10 overflow-hidden rounded-full border border-transparent shadow-black/15 shadow-md ring-1 ring-foreground/10">
                            <Image
                              src="/assets/imageplaceholder.svg"
                              alt={"Remy da Thesta Jacobs de Bok's avatar"}
                              width={80}
                              height={80}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="space-y-px">
                            <p className="font-medium text-sm">
                              Remy da Thesta Jacobs de Bok
                            </p>
                            <p className="text-xs">
                              Digital Marketing Manager, Schoonenberg
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="min-w-0 shrink-0 @4xl:basis-1/2 basis-full p-[0.5px]">
                    <div className="h-full min-h-72">
                      <div
                        className="relative grid h-full grid-rows-[3.5rem_1fr_2.5rem] gap-3 overflow-hidden bg-background! p-5"
                        data-grid-content="true"
                      >
                        <div
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-1 rounded-lg"
                          style={{
                            backgroundImage:
                              "radial-gradient(circle at 50% 90%, #bf8aa220 0%, transparent 60%)",
                          }}
                        ></div>
                        <div className="relative z-10 flex h-14 items-start">
                          <Image
                            src="/assets/imageplaceholder.svg"
                            alt={"NoNonsense"}
                            width={175}
                            height={48}
                            className="w-auto object-contain h-10"
                          />
                        </div>
                        <div className="relative z-10">
                          <p className='line-clamp-5 text-balance font-semibold text-base text-foreground/80 before:mr-1 before:content-["\201C"] after:ml-1 after:content-["\201D"] md:text-base'>
                            Promptwatch gives our agency the GEO visibility
                            needed to make smarter content decisions. Its prompt
                            tracking and content gap insights help our clients
                            build a stronger presence across AI search
                            platforms.
                          </p>
                        </div>
                        <div className="relative z-10 flex items-center gap-3">
                          <div className="aspect-square size-10 overflow-hidden rounded-full border border-transparent shadow-black/15 shadow-md ring-1 ring-foreground/10">
                            <Image
                              src="/assets/imageplaceholder.svg"
                              alt={"Anna Zwettler's avatar"}
                              width={80}
                              height={80}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="space-y-px">
                            <p className="font-medium text-sm">Anna Zwettler</p>
                            <p className="text-xs">
                              Content Manager, NoNonsense
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="min-w-0 shrink-0 @4xl:basis-1/2 basis-full p-[0.5px]">
                    <div className="h-full min-h-72">
                      <div
                        className="relative grid h-full grid-rows-[3.5rem_1fr_2.5rem] gap-3 overflow-hidden bg-background! p-5"
                        data-grid-content="true"
                      >
                        <div
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-1 rounded-lg"
                          style={{
                            backgroundImage:
                              "radial-gradient(circle at 50% 90%, #00E3C020 0%, transparent 60%)",
                          }}
                        ></div>
                        <div className="relative z-10 flex h-14 items-start">
                          <Image
                            src="/assets/imageplaceholder.svg"
                            alt={"Octolize"}
                            width={80}
                            height={48}
                            className="w-auto object-contain max-h-10"
                          />
                        </div>
                        <div className="relative z-10">
                          <p className='line-clamp-5 text-balance font-semibold text-base text-foreground/80 before:mr-1 before:content-["\201C"] after:ml-1 after:content-["\201D"] md:text-base'>
                            I tested several tools to measure brand visibility
                            in LLMs, and Promptwatch was the only one that
                            ticked all our boxes. It keeps improving with new
                            features and has become essential for our marketing
                            team.
                          </p>
                        </div>
                        <div className="relative z-10 flex items-center gap-3">
                          <div className="aspect-square size-10 overflow-hidden rounded-full border border-transparent shadow-black/15 shadow-md ring-1 ring-foreground/10">
                            <Image
                              src="/assets/imageplaceholder.svg"
                              alt={"Lucyna Polok's avatar"}
                              width={80}
                              height={80}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="space-y-px">
                            <p className="font-medium text-sm">Lucyna Polok</p>
                            <p className="text-xs">
                              SEO Content Specialist, Octolize
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="min-w-0 shrink-0 @4xl:basis-1/2 basis-full p-[0.5px]">
                    <div className="h-full min-h-72">
                      <div
                        className="relative grid h-full grid-rows-[3.5rem_1fr_2.5rem] gap-3 overflow-hidden bg-background! p-5"
                        data-grid-content="true"
                      >
                        <div
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-1 rounded-lg"
                          style={{
                            backgroundImage:
                              "radial-gradient(circle at 50% 90%, #316aff20 0%, transparent 60%)",
                          }}
                        ></div>
                        <div className="relative z-10 flex h-14 items-start">
                          <Image
                            src="/assets/imageplaceholder.svg"
                            alt={"landytech"}
                            width={120}
                            height={48}
                            className="w-auto object-contain max-h-10"
                          />
                        </div>
                        <div className="relative z-10">
                          <p className='line-clamp-5 text-balance font-semibold text-base text-foreground/80 before:mr-1 before:content-["\201C"] after:ml-1 after:content-["\201D"] md:text-base'>
                            Since implementing Promptwatch, we’ve seen a
                            measurable increase in our LLM visibility. Its clear
                            insights into share of voice, content gaps, and AI
                            crawler activity have made it a core part of our
                            marketing reporting stack.
                          </p>
                        </div>
                        <div className="relative z-10 flex items-center gap-3">
                          <div className="aspect-square size-10 overflow-hidden rounded-full border border-transparent shadow-black/15 shadow-md ring-1 ring-foreground/10">
                            <Image
                              src="/assets/imageplaceholder.svg"
                              alt={"Sam Franklin's avatar"}
                              width={80}
                              height={80}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="space-y-px">
                            <p className="font-medium text-sm">Sam Franklin</p>
                            <p className="text-xs">VP Marketing, Landytech</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="min-w-0 shrink-0 @4xl:basis-1/2 basis-full p-[0.5px]">
                    <div className="h-full min-h-72">
                      <div
                        className="relative grid h-full grid-rows-[3.5rem_1fr_2.5rem] gap-3 overflow-hidden bg-background! p-5"
                        data-grid-content="true"
                      >
                        <div
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-1 rounded-lg"
                          style={{
                            backgroundImage:
                              "radial-gradient(circle at 50% 90%, #00386E20 0%, transparent 60%)",
                          }}
                        ></div>
                        <div className="relative z-10 flex h-14 items-start">
                          <Image
                            src="/assets/imageplaceholder.svg"
                            alt={"Marvia"}
                            width={108}
                            height={28}
                            className="w-auto object-contain max-h-10"
                          />
                        </div>
                        <div className="relative z-10">
                          <p className='line-clamp-5 text-balance font-semibold text-base text-foreground/80 before:mr-1 before:content-["\201C"] after:ml-1 after:content-["\201D"] md:text-base'>
                            Promptwatch gives me the ability to look at data
                            from several different angles, like diving deep into
                            specific visitors and understanding citations. Our
                            team cares about evolving the product.
                          </p>
                        </div>
                        <div className="relative z-10 flex items-center gap-3">
                          <div className="aspect-square size-10 overflow-hidden rounded-full border border-transparent shadow-black/15 shadow-md ring-1 ring-foreground/10">
                            <Image
                              src="/assets/imageplaceholder.svg"
                              alt={"Breno Spadotto's avatar"}
                              width={80}
                              height={80}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="space-y-px">
                            <p className="font-medium text-sm">
                              Breno Spadotto
                            </p>
                            <p className="text-xs">
                              Demand Generation Specialist, Marvia
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="min-w-0 shrink-0 @4xl:basis-1/2 basis-full p-[0.5px]">
                    <div className="h-full min-h-72">
                      <div
                        className="relative grid h-full grid-rows-[3.5rem_1fr_2.5rem] gap-3 overflow-hidden bg-background! p-5"
                        data-grid-content="true"
                      >
                        <div
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-1 rounded-lg"
                          style={{
                            backgroundImage:
                              "radial-gradient(circle at 50% 90%, #5900CF20 0%, transparent 60%)",
                          }}
                        ></div>
                        <div className="relative z-10 flex h-14 items-start">
                          <Image
                            src="/assets/imageplaceholder.svg"
                            alt={"Everflow"}
                            width={90}
                            height={48}
                            className="w-auto object-contain max-h-10"
                          />
                        </div>
                        <div className="relative z-10">
                          <p className='line-clamp-5 text-balance font-semibold text-base text-foreground/80 before:mr-1 before:content-["\201C"] after:ml-1 after:content-["\201D"] md:text-base'>
                            Promptwatch pulls all your competitors and gives you
                            an analysis of those prompt-versus-your competitors.
                            There are a lot of tools out there, but this one is
                            easier to see what matters and take action.
                          </p>
                        </div>
                        <div className="relative z-10 flex items-center gap-3">
                          <div className="aspect-square size-10 overflow-hidden rounded-full border border-transparent shadow-black/15 shadow-md ring-1 ring-foreground/10">
                            <Image
                              src="/assets/imageplaceholder.svg"
                              alt={"Michael Cole's avatar"}
                              width={80}
                              height={80}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="space-y-px">
                            <p className="font-medium text-sm">Michael Cole</p>
                            <p className="text-xs">CMO, Everflow</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="min-w-0 shrink-0 @4xl:basis-1/2 basis-full p-[0.5px]">
                    <div className="h-full min-h-72">
                      <div
                        className="relative grid h-full grid-rows-[3.5rem_1fr_2.5rem] gap-3 overflow-hidden bg-background! p-5"
                        data-grid-content="true"
                      >
                        <div
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-1 rounded-lg"
                          style={{
                            backgroundImage:
                              "radial-gradient(circle at 50% 90%, #0092d020 0%, transparent 60%)",
                          }}
                        ></div>
                        <div className="relative z-10 flex h-14 items-start">
                          <Image
                            src="/assets/imageplaceholder.svg"
                            alt={"Deepblue Digital"}
                            width={79}
                            height={48}
                            className="w-auto object-contain max-h-10"
                          />
                        </div>
                        <div className="relative z-10">
                          <p className='line-clamp-5 text-balance font-semibold text-base text-foreground/80 before:mr-1 before:content-["\201C"] after:ml-1 after:content-["\201D"] md:text-base'>
                            Promptwatch turns AI visibility data into a clear
                            project roadmap. Instead of just showing where you
                            stand, it provides actionable next steps to help you
                            prioritize what to optimize in AI Search
                          </p>
                        </div>
                        <div className="relative z-10 flex items-center gap-3">
                          <div className="aspect-square size-10 overflow-hidden rounded-full border border-transparent shadow-black/15 shadow-md ring-1 ring-foreground/10">
                            <Image
                              src="/assets/imageplaceholder.svg"
                              alt={"Ramon Labrie's avatar"}
                              width={80}
                              height={80}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="space-y-px">
                            <p className="font-medium text-sm">Ramon Labrie</p>
                            <p className="text-xs">
                              Digital Marketing Specialist, Deepblue Digital
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="min-w-0 shrink-0 @4xl:basis-1/2 basis-full p-[0.5px]">
                    <div className="h-full min-h-72">
                      <div
                        className="relative grid h-full grid-rows-[3.5rem_1fr_2.5rem] gap-3 overflow-hidden bg-background! p-5"
                        data-grid-content="true"
                      >
                        <div
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-1 rounded-lg"
                          style={{
                            backgroundImage:
                              "radial-gradient(circle at 50% 90%, #DF191320 0%, transparent 60%)",
                          }}
                        ></div>
                        <div className="relative z-10 flex h-14 items-start">
                          <Image
                            src="/assets/imageplaceholder.svg"
                            alt={"adwise"}
                            width={110}
                            height={24}
                            className="w-auto object-contain max-h-10"
                          />
                        </div>
                        <div className="relative z-10">
                          <p className='line-clamp-5 text-balance font-semibold text-base text-foreground/80 before:mr-1 before:content-["\201C"] after:ml-1 after:content-["\201D"] md:text-base'>
                            In Promptwatch we are able to see how active the
                            ChatGPT bot is on our client websites and exactly
                            how often our content is being used in responses of
                            LLMs.
                          </p>
                        </div>
                        <div className="relative z-10 flex items-center gap-3">
                          <div className="aspect-square size-10 overflow-hidden rounded-full border border-transparent shadow-black/15 shadow-md ring-1 ring-foreground/10">
                            <Image
                              src="/assets/imageplaceholder.svg"
                              alt={"Marijn ten Bulte's avatar"}
                              width={80}
                              height={80}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="space-y-px">
                            <p className="font-medium text-sm">
                              Marijn ten Bulte
                            </p>
                            <p className="text-xs">
                              Head of Organic Channels, Advise
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="min-w-0 shrink-0 @4xl:basis-1/2 basis-full p-[0.5px]">
                    <div className="h-full min-h-72">
                      <div
                        className="relative grid h-full grid-rows-[3.5rem_1fr_2.5rem] gap-3 overflow-hidden bg-background! p-5"
                        data-grid-content="true"
                      >
                        <div
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-1 rounded-lg"
                          style={{
                            backgroundImage:
                              "radial-gradient(circle at 50% 90%, #4CD17620 0%, transparent 60%)",
                          }}
                        ></div>
                        <div className="relative z-10 flex h-14 items-start">
                          <Image
                            src="/assets/imageplaceholder.svg"
                            alt={"Wortell"}
                            width={130}
                            height={48}
                            className="w-auto object-contain max-h-10"
                          />
                        </div>
                        <div className="relative z-10">
                          <p className='line-clamp-5 text-balance font-semibold text-base text-foreground/80 before:mr-1 before:content-["\201C"] after:ml-1 after:content-["\201D"] md:text-base'>
                            The regular updates and visibility monitoring from
                            Promptwatch are great. It helps us prioritize the
                            right opportunities, stay aligned as a team, and
                            keep our efforts focused.
                          </p>
                        </div>
                        <div className="relative z-10 flex items-center gap-3">
                          <div className="aspect-square size-10 overflow-hidden rounded-full border border-transparent shadow-black/15 shadow-md ring-1 ring-foreground/10">
                            <Image
                              src="/assets/imageplaceholder.svg"
                              alt={"Tom de Bakker's avatar"}
                              width={80}
                              height={80}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="space-y-px">
                            <p className="font-medium text-sm">Tom de Bakker</p>
                            <p className="text-xs">
                              Head of Marketing, Wortell
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="min-w-0 shrink-0 @4xl:basis-1/2 basis-full p-[0.5px]">
                    <div className="h-full min-h-72">
                      <div
                        className="relative grid h-full grid-rows-[3.5rem_1fr_2.5rem] gap-3 overflow-hidden bg-background! p-5"
                        data-grid-content="true"
                      >
                        <div
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-1 rounded-lg"
                          style={{
                            backgroundImage:
                              "radial-gradient(circle at 50% 90%, #0692B920 0%, transparent 60%)",
                          }}
                        ></div>
                        <div className="relative z-10 flex h-14 items-start">
                          <Image
                            src="/assets/imageplaceholder.svg"
                            alt={"Revisto"}
                            width={130}
                            height={48}
                            className="w-auto object-contain max-h-10"
                          />
                        </div>
                        <div className="relative z-10">
                          <p className='line-clamp-5 text-balance font-semibold text-base text-foreground/80 before:mr-1 before:content-["\201C"] after:ml-1 after:content-["\201D"] md:text-base'>
                            We get clients discovered on AI platforms like
                            ChatGPT by tracking AI-generated answers and
                            optimizing with real data
                          </p>
                        </div>
                        <div className="relative z-10 flex items-center gap-3">
                          <div className="aspect-square size-10 overflow-hidden rounded-full border border-transparent shadow-black/15 shadow-md ring-1 ring-foreground/10">
                            <Image
                              src="/assets/imageplaceholder.svg"
                              alt={"Rens de Jonge's avatar"}
                              width={80}
                              height={80}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="space-y-px">
                            <p className="font-medium text-sm">Rens de Jonge</p>
                            <p className="text-xs">Owner, Revisto Marketing</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="min-w-0 shrink-0 @4xl:basis-1/2 basis-full p-[0.5px]">
                    <div className="h-full min-h-72">
                      <div
                        className="relative grid h-full grid-rows-[3.5rem_1fr_2.5rem] gap-3 overflow-hidden bg-background! p-5"
                        data-grid-content="true"
                      >
                        <div
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-1 rounded-lg"
                          style={{
                            backgroundImage:
                              "radial-gradient(circle at 50% 90%, #0E68A920 0%, transparent 60%)",
                          }}
                        ></div>
                        <div className="relative z-10 flex h-14 items-start">
                          <Image
                            src="/assets/imageplaceholder.svg"
                            alt={"NXT Pharma"}
                            width={140}
                            height={24}
                            className="w-auto object-contain max-h-10"
                          />
                        </div>
                        <div className="relative z-10">
                          <p className='line-clamp-5 text-balance font-semibold text-base text-foreground/80 before:mr-1 before:content-["\201C"] after:ml-1 after:content-["\201D"] md:text-base'>
                            Promptwatch stands out for its powerful features,
                            especially its earned media tracking for off-site
                            mentions, the 'Actions' feature, and its
                            well-documented API integrations. It overall helps
                            us take the right actions to improve our visibility
                            in AI Search engines.
                          </p>
                        </div>
                        <div className="relative z-10 flex items-center gap-3">
                          <div className="aspect-square size-10 overflow-hidden rounded-full border border-transparent shadow-black/15 shadow-md ring-1 ring-foreground/10">
                            <Image
                              src="/assets/imageplaceholder.svg"
                              alt={"Rutger van der Lee's avatar"}
                              width={80}
                              height={80}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="space-y-px">
                            <p className="font-medium text-sm">
                              Rutger van der Lee
                            </p>
                            <p className="text-xs">Founder, NXT Pharma</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div aria-hidden="true" className="p-[0.5px]">
            <div className="h-full rounded bg-background/75 max-lg:w-2"></div>
          </div>
        </div>
        <div className="@container grid grid-cols-[auto_1fr_auto] lg:grid-cols-[1fr_minmax(0,69rem)_1fr]">
          <div aria-hidden="true" className="p-[0.5px]">
            <div className="h-full rounded bg-background/75 max-lg:w-2"></div>
          </div>
          <div className="mx-auto w-full max-w-276 lg:min-w-5xl xl:min-w-276 p-[0.5px]">
            <div className="rounded bg-background/75 h-8" data-slot="content">
              <div className="h-8"></div>
            </div>
          </div>
          <div aria-hidden="true" className="p-[0.5px]">
            <div className="h-full rounded bg-background/75 max-lg:w-2"></div>
          </div>
        </div>
        <section id="content-creation">
          <div className="@container grid grid-cols-[auto_1fr_auto] lg:grid-cols-[1fr_minmax(0,69rem)_1fr]">
            <div aria-hidden="true" className="p-[0.5px]">
              <div className="h-full rounded bg-background/75 max-lg:w-2"></div>
            </div>
            <div className="mx-auto w-full max-w-276 lg:min-w-5xl xl:min-w-276 p-[0.5px]">
              <div
                className="h-full rounded bg-background/75 relative"
                data-slot="content"
              >
                <div className="relative grid gap-px overflow-hidden">
                  <div
                    className="relative z-10 p-6 @4xl:px-8 @4xl:pt-20 @4xl:pb-14"
                    data-grid-content="true"
                  >
                    <p className="inline-flex items-center gap-px text-xs tracking-widest text-muted-foreground mb-4">
                      <span
                        aria-hidden="true"
                        className="font-mono text-muted-foreground/50"
                      >
                        [
                      </span>
                      content agents
                      <span
                        aria-hidden="true"
                        className="font-mono text-muted-foreground/50"
                      >
                        ]
                      </span>
                    </p>
                    <h2 className="mb-4 max-w-3xl text-pretty font-medium text-2xl text-foreground leading-tight lg:text-4xl ">
                      Create content that gets{" "}
                      <span className="text-primary underline decoration-primary/50 decoration-dashed">
                        cited
                      </span>{" "}
                      by AI
                    </h2>
                    <p className="max-w-3xl text-pretty font-normal text-base text-muted-foreground lg:text-lg ">
                      Create content that AI models actually cite. Analyze what
                      gets recommended by ChatGPT, Claude, Perplexity, and AI
                      Overviews — then produce content that wins.
                    </p>
                    <div className="mt-6 flex flex-row flex-wrap gap-4 justify-start">
                      <a
                        className="cursor-pointer justify-center whitespace-nowrap font-medium text-sm transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0 rounded-md focus-visible:ring-1 focus-visible:ring-ring active:scale-[0.99] active:transition-none h-8 px-3 py-1.5 border border-transparent bg-background shadow-black/15 shadow-sm ring-1 ring-foreground/10 duration-200 hover:bg-muted/50 flex items-center gap-2"
                        href="/features/content-agents"
                      >
                        Explore Content Agents
                      </a>
                      <button className="cursor-pointer justify-center whitespace-nowrap font-medium text-sm transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0 rounded-md duration-150 focus-visible:ring-1 focus-visible:ring-ring active:scale-[0.99] active:transition-none h-8 px-3 py-1.5 border-[0.5px] border-white/25 bg-primary text-primary-foreground ring-(--ring-color) ring-1 [--ring-color:color-mix(in_oklab,var(--color-foreground)15%,var(--color-primary))] hover:bg-primary/90 flex items-center gap-2">
                        Start Free Trial
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 256 256"
                          className="size-4"
                        >
                          <path d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div aria-hidden="true" className="p-[0.5px]">
              <div className="h-full rounded bg-background/75 max-lg:w-2"></div>
            </div>
          </div>
          <div className="@container grid grid-cols-[auto_1fr_auto] lg:grid-cols-[1fr_minmax(0,69rem)_1fr]">
            <div aria-hidden="true" className="p-[0.5px]">
              <div className="h-full rounded bg-background/75 max-lg:w-2"></div>
            </div>
            <div className="mx-auto w-full max-w-276 lg:min-w-5xl xl:min-w-276 p-[0.5px]">
              <div
                className="h-full rounded bg-background/75"
                data-slot="content"
              >
                <div className="relative h-[316px] w-full overflow-hidden rounded-sm bg-white sm:h-[395px] md:h-[528px] lg:h-[556px] xl:h-[556px]">
                  <div className="absolute inset-1 overflow-hidden rounded-sm before:pointer-events-none before:absolute before:inset-0 before:z-10 before:rounded before:border before:border-foreground/10">
                    <div className="dither absolute inset-0 opacity-75">
                      <Image
                        src="/assets/imageplaceholder.svg"
                        alt={""}
                        width={800}
                        height={500}
                        className="size-full object-cover opacity-50"
                      />
                    </div>
                    <Image
                      src="/assets/imageplaceholder.svg"
                      alt={""}
                      width={800}
                      height={500}
                      className="size-full object-cover opacity-75"
                    />
                  </div>
                  <div className="absolute inset-0 flex items-end px-3 pb-1 sm:px-4 md:px-5 lg:px-8">
                    <div
                      className="relative w-full"
                      style={{
                        transform: "translate3d(0px, 0px, 0px)",
                        transition:
                          "transform 700ms cubic-bezier(0.16, 1, 0.3, 1)",
                        willChange: "auto",
                      }}
                    >
                      <div className="relative w-[166.67%] origin-bottom-left scale-[0.6] sm:w-[133.33%] sm:scale-75 md:w-full md:scale-100 lg:scale-100 xl:scale-100">
                        <div className="flex h-[500px] flex-col overflow-hidden rounded-t-[10px] bg-white lg:h-[524px]">
                          <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-t-[10px] border border-zinc-500/60 border-b-0 bg-white shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
                            <div className="relative flex h-8 shrink-0 items-center border-zinc-500/40 border-b bg-[linear-gradient(to_bottom,var(--color-white)_0%,var(--color-zinc-100)_45%,var(--color-zinc-200)_100%)] px-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.95),inset_0_-1px_0_rgba(255,255,255,0.35)]">
                              <div
                                aria-hidden="true"
                                className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-linear-to-b from-white/80 to-white/10"
                              ></div>
                              <div
                                aria-hidden="true"
                                className="relative z-10 flex items-center gap-2"
                              >
                                <span className="relative size-2.5 rounded-full border border-red-900/55 bg-[linear-gradient(to_bottom,var(--color-red-200)_0%,var(--color-red-400)_42%,var(--color-red-600)_100%)] shadow-[0_1px_1px_rgba(0,0,0,0.2),inset_0_1px_1px_rgba(255,255,255,0.5)]">
                                  <span className="absolute inset-x-0.5 top-px h-1 rounded-full bg-white/65 blur-[0.3px]"></span>
                                </span>
                                <span className="relative size-2.5 rounded-full border border-amber-900/55 bg-[linear-gradient(to_bottom,var(--color-amber-200)_0%,var(--color-amber-400)_42%,var(--color-amber-600)_100%)] shadow-[0_1px_1px_rgba(0,0,0,0.2),inset_0_1px_1px_rgba(255,255,255,0.5)]">
                                  <span className="absolute inset-x-0.5 top-px h-1 rounded-full bg-white/65 blur-[0.3px]"></span>
                                </span>
                                <span className="relative size-2.5 rounded-full border border-green-900/55 bg-[linear-gradient(to_bottom,var(--color-green-200)_0%,var(--color-green-500)_42%,var(--color-green-700)_100%)] shadow-[0_1px_1px_rgba(0,0,0,0.2),inset_0_1px_1px_rgba(255,255,255,0.5)]">
                                  <span className="absolute inset-x-0.5 top-px h-1 rounded-full bg-white/65 blur-[0.3px]"></span>
                                </span>
                              </div>
                              <span className="pointer-events-none absolute inset-x-20 top-1/2 -translate-y-1/2 truncate text-center font-medium text-[12px] text-zinc-600 [text-shadow:0_1px_0_rgba(255,255,255,0.95)]">
                                Promptwatch - Content
                              </span>
                            </div>
                            <div className="flex flex-1 overflow-hidden md:flex-row">
                              <div className="hidden flex-col border-stone-200 border-r bg-stone-50/60 p-3 md:flex md:w-[154px]">
                                <nav className="flex-1 space-y-4">
                                  <div className="relative">
                                    <div className="flex w-full items-center justify-between rounded-md border border-gray-200 bg-white px-1 py-1 text-gray-700 text-xs">
                                      <div className="flex items-center space-x-0.5">
                                        <div
                                          className="flex items-center space-x-2"
                                          style={{
                                            opacity: 1,
                                            transform: "none",
                                          }}
                                        >
                                          <Image
                                            src="/assets/imageplaceholder.svg"
                                            alt={"Typeform logo"}
                                            width={20}
                                            height={20}
                                            className="rounded-sm border border-gray-200"
                                          />
                                          <span className="line-clamp-1 font-medium text-xs">
                                            Typeform
                                          </span>
                                        </div>
                                      </div>
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="currentColor"
                                        viewBox="0 0 256 256"
                                        className="h-3 w-3"
                                      >
                                        <path d="M181.66,170.34a8,8,0,0,1,0,11.32l-48,48a8,8,0,0,1-11.32,0l-48-48a8,8,0,0,1,11.32-11.32L128,212.69l42.34-42.35A8,8,0,0,1,181.66,170.34Zm-96-84.68L128,43.31l42.34,42.35a8,8,0,0,0,11.32-11.32l-48-48a8,8,0,0,0-11.32,0l-48,48A8,8,0,0,0,85.66,85.66Z"></path>
                                      </svg>
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <button
                                      className="relative flex w-full cursor-pointer items-center rounded-md border-none bg-stone-50/60 px-3 py-2 text-left font-medium text-muted-foreground/80 text-xs hover:bg-stone-100"
                                      type="button"
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="currentColor"
                                        viewBox="0 0 256 256"
                                        className="mr-2 size-3.5"
                                      >
                                        <path d="M237.2,151.87v0a47.1,47.1,0,0,0-2.35-5.45L193.26,51.8a7.82,7.82,0,0,0-1.66-2.44,32,32,0,0,0-45.26,0A8,8,0,0,0,144,55V80H112V55a8,8,0,0,0-2.34-5.66,32,32,0,0,0-45.26,0,7.82,7.82,0,0,0-1.66,2.44L21.15,146.4a47.1,47.1,0,0,0-2.35,5.45v0A48,48,0,1,0,112,168V96h32v72a48,48,0,1,0,93.2-16.13ZM76.71,59.75a16,16,0,0,1,19.29-1v73.51a47.9,47.9,0,0,0-46.79-9.92ZM64,200a32,32,0,1,1,32-32A32,32,0,0,1,64,200ZM160,58.74a16,16,0,0,1,19.29,1l27.5,62.58A47.9,47.9,0,0,0,160,132.25ZM192,200a32,32,0,1,1,32-32A32,32,0,0,1,192,200Z"></path>
                                      </svg>
                                      Visibility
                                    </button>
                                    <button
                                      className="relative flex w-full cursor-pointer items-center rounded-md border-none bg-stone-50/60 px-3 py-2 text-left font-medium text-muted-foreground/80 text-xs hover:bg-stone-100"
                                      type="button"
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="currentColor"
                                        viewBox="0 0 256 256"
                                        className="mr-2 size-3.5"
                                      >
                                        <path d="M132,24A100.11,100.11,0,0,0,32,124v84a16,16,0,0,0,16,16h84a100,100,0,0,0,0-200Zm0,184H48V124a84,84,0,1,1,84,84Z"></path>
                                      </svg>
                                      Agent
                                    </button>
                                    <button
                                      className="relative flex w-full cursor-pointer items-center rounded-md border-none bg-stone-50/60 px-3 py-2 text-left font-medium text-muted-foreground/80 text-xs hover:bg-stone-100"
                                      type="button"
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="currentColor"
                                        viewBox="0 0 256 256"
                                        className="mr-2 size-3.5"
                                      >
                                        <path d="M112,40a8,8,0,0,0-8,8V64H24A16,16,0,0,0,8,80v96a16,16,0,0,0,16,16h80v16a8,8,0,0,0,16,0V48A8,8,0,0,0,112,40ZM24,176V80h80v96ZM248,80v96a16,16,0,0,1-16,16H144a8,8,0,0,1,0-16h88V80H144a8,8,0,0,1,0-16h88A16,16,0,0,1,248,80ZM88,112a8,8,0,0,1-8,8H72v24a8,8,0,0,1-16,0V120H48a8,8,0,0,1,0-16H80A8,8,0,0,1,88,112Z"></path>
                                      </svg>
                                      Prompts
                                    </button>
                                    <button
                                      className="relative flex w-full cursor-pointer items-center rounded-md border-none px-3 py-2 text-left font-medium text-xs hover:bg-stone-100 bg-gray-100 text-foreground"
                                      type="button"
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="currentColor"
                                        viewBox="0 0 256 256"
                                        className="mr-2 size-3.5"
                                      >
                                        <path
                                          d="M224,56V200a8,8,0,0,1-8,8H40a8,8,0,0,1-8-8V56a8,8,0,0,1,8-8H216A8,8,0,0,1,224,56Z"
                                          opacity="0.2"
                                        ></path>
                                        <path d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,160H40V56H216V200ZM184,96a8,8,0,0,1-8,8H80a8,8,0,0,1,0-16h96A8,8,0,0,1,184,96Zm0,32a8,8,0,0,1-8,8H80a8,8,0,0,1,0-16h96A8,8,0,0,1,184,128Zm0,32a8,8,0,0,1-8,8H80a8,8,0,0,1,0-16h96A8,8,0,0,1,184,160Z"></path>
                                      </svg>
                                      Content
                                    </button>
                                    <button
                                      className="relative flex w-full cursor-pointer items-center rounded-md border-none bg-stone-50/60 px-3 py-2 text-left font-medium text-muted-foreground/80 text-xs hover:bg-stone-100"
                                      type="button"
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="currentColor"
                                        viewBox="0 0 256 256"
                                        className="mr-2 size-3.5"
                                      >
                                        <path d="M200,48H136V16a8,8,0,0,0-16,0V48H56A32,32,0,0,0,24,80V192a32,32,0,0,0,32,32H200a32,32,0,0,0,32-32V80A32,32,0,0,0,200,48Zm16,144a16,16,0,0,1-16,16H56a16,16,0,0,1-16-16V80A16,16,0,0,1,56,64H200a16,16,0,0,1,16,16Zm-52-56H92a28,28,0,0,0,0,56h72a28,28,0,0,0,0-56Zm-24,16v24H116V152ZM80,164a12,12,0,0,1,12-12h8v24H92A12,12,0,0,1,80,164Zm84,12h-8V152h8a12,12,0,0,1,0,24ZM72,108a12,12,0,1,1,12,12A12,12,0,0,1,72,108Zm88,0a12,12,0,1,1,12,12A12,12,0,0,1,160,108Z"></path>
                                      </svg>
                                      Crawlers
                                    </button>
                                    <button
                                      className="relative flex w-full cursor-pointer items-center rounded-md border-none bg-stone-50/60 px-3 py-2 text-left font-medium text-muted-foreground/80 text-xs hover:bg-stone-100"
                                      type="button"
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="currentColor"
                                        viewBox="0 0 256 256"
                                        className="mr-2 size-3.5"
                                      >
                                        <path d="M238.64,33.36a32,32,0,0,0-45.26,0h0a32,32,0,0,0,0,45.26c.29.29.6.57.9.85l-26.63,49.46a32.19,32.19,0,0,0-23.9,3.5l-20.18-20.18a32,32,0,0,0-50.2-38.89h0a32,32,0,0,0,0,45.26c.29.29.59.57.89.85L47.63,168.94a32,32,0,0,0-30.27,8.44h0a32,32,0,1,0,45.26,0c-.29-.29-.6-.57-.9-.85l26.63-49.46A32.4,32.4,0,0,0,96,128a32,32,0,0,0,16.25-4.41l20.18,20.18a32,32,0,1,0,50.2-6.38c-.29-.29-.59-.57-.89-.85l26.63-49.46A32.33,32.33,0,0,0,216,88a32,32,0,0,0,22.63-54.62ZM51.3,211.33a16,16,0,0,1-22.63-22.64h0A16,16,0,1,1,51.3,211.33Zm33.38-104a16,16,0,0,1,0-22.63h0a16,16,0,1,1,0,22.63Zm86.64,64a16,16,0,0,1-22.63-22.63h0a16,16,0,0,1,22.63,22.63Zm56-104A16,16,0,1,1,204.7,44.67h0a16,16,0,0,1,22.63,22.64Z"></path>
                                      </svg>
                                      Citations
                                    </button>
                                    <button
                                      className="relative flex w-full cursor-pointer items-center rounded-md border-none bg-stone-50/60 px-3 py-2 text-left font-medium text-muted-foreground/80 text-xs hover:bg-stone-100"
                                      type="button"
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="currentColor"
                                        viewBox="0 0 256 256"
                                        className="mr-2 size-3.5"
                                      >
                                        <path d="M232,208a8,8,0,0,1-8,8H32a8,8,0,0,1-8-8V48a8,8,0,0,1,16,0v94.37L90.73,98a8,8,0,0,1,10.07-.38l58.81,44.11L218.73,90a8,8,0,1,1,10.54,12l-64,56a8,8,0,0,1-10.07.38L96.39,114.29,40,163.63V200H224A8,8,0,0,1,232,208Z"></path>
                                      </svg>
                                      Analytics
                                    </button>
                                  </div>
                                </nav>
                                <nav>
                                  <div className="flex items-center rounded-md px-3 py-2 text-gray-400 text-xs">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="currentColor"
                                      viewBox="0 0 256 256"
                                      className="mr-2 size-4"
                                    >
                                      <path d="M230.92,212c-15.23-26.33-38.7-45.21-66.09-54.16a72,72,0,1,0-73.66,0C63.78,166.78,40.31,185.66,25.08,212a8,8,0,1,0,13.85,8c18.84-32.56,52.14-52,89.07-52s70.23,19.44,89.07,52a8,8,0,1,0,13.85-8ZM72,96a56,56,0,1,1,56,56A56.06,56.06,0,0,1,72,96Z"></path>
                                    </svg>
                                    Team
                                  </div>
                                </nav>
                              </div>
                              <div className="flex-1 overflow-hidden bg-stone-50">
                                <div className="h-full" style={{ opacity: 1 }}>
                                  <div className="flex flex-1 flex-col">
                                    <div className="h-full flex-1 overflow-hidden p-3 bg-stone-50">
                                      <div className="mb-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                                        <div className="rounded-lg border border-stone-200 bg-white px-2.5 py-2">
                                          <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-1.5">
                                              <div className="rounded p-1 bg-blue-100/50">
                                                <svg
                                                  xmlns="http://www.w3.org/2000/svg"
                                                  fill="currentColor"
                                                  viewBox="0 0 256 256"
                                                  className="h-3 w-3 text-blue-700"
                                                >
                                                  <path
                                                    d="M204,168a28,28,0,0,0,12-2.69V208a8,8,0,0,1-8,8H64a8,8,0,0,1-8-8V165.31a28,28,0,1,1,0-50.62V72a8,8,0,0,1,8-8h46.69a28,28,0,1,1,50.61,0H208a8,8,0,0,1,8,8v42.69A28,28,0,1,0,204,168Z"
                                                    opacity="0.2"
                                                  ></path>
                                                  <path d="M220.27,158.54a8,8,0,0,0-7.7-.46,20,20,0,1,1,0-36.16A8,8,0,0,0,224,114.69V72a16,16,0,0,0-16-16H171.78a35.36,35.36,0,0,0,.22-4,36.15,36.15,0,0,0-11.36-26.25,36,36,0,0,0-60.55,23.63,36.56,36.56,0,0,0,.14,6.62H64A16,16,0,0,0,48,72v32.22a35.36,35.36,0,0,0-4-.22,36.12,36.12,0,0,0-26.24,11.36,35.7,35.7,0,0,0-9.69,27,36.08,36.08,0,0,0,33.31,33.6,36.56,36.56,0,0,0,6.62-.14V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V165.31A8,8,0,0,0,220.27,158.54ZM208,208H64V165.31a8,8,0,0,0-11.43-7.23,20,20,0,1,1,0-36.16A8,8,0,0,0,64,114.69V72h46.69a8,8,0,0,0,7.23-11.43,20,20,0,1,1,36.16,0A8,8,0,0,0,161.31,72H208v32.23a35.68,35.68,0,0,0-6.62-.14A36,36,0,0,0,204,176a35.36,35.36,0,0,0,4-.22Z"></path>
                                                </svg>
                                              </div>
                                              <span className="font-semibold text-[10px] text-gray-700">
                                                Content Gap
                                              </span>
                                            </div>
                                            <span className="font-mono font-semibold text-[10px] text-gray-500">
                                              8
                                            </span>
                                          </div>
                                          <p className="mt-1 line-clamp-2 text-[9px] text-gray-500 leading-snug">
                                            Prompts where competitors are cited
                                            but you're missing
                                          </p>
                                        </div>
                                        <div className="rounded-lg border border-stone-200 bg-white px-2.5 py-2">
                                          <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-1.5">
                                              <div className="rounded p-1 bg-sky-100/50">
                                                <svg
                                                  xmlns="http://www.w3.org/2000/svg"
                                                  fill="currentColor"
                                                  viewBox="0 0 256 256"
                                                  className="h-3 w-3 text-sky-500"
                                                >
                                                  <path
                                                    d="M224,64V184a16,16,0,0,1-16,16H32a16,16,0,0,0,16-16V64a8,8,0,0,1,8-8H216A8,8,0,0,1,224,64Z"
                                                    opacity="0.2"
                                                  ></path>
                                                  <path d="M88,112a8,8,0,0,1,8-8h80a8,8,0,0,1,0,16H96A8,8,0,0,1,88,112Zm8,40h80a8,8,0,0,0,0-16H96a8,8,0,0,0,0,16ZM232,64V184a24,24,0,0,1-24,24H32A24,24,0,0,1,8,184.11V88a8,8,0,0,1,16,0v96a8,8,0,0,0,16,0V64A16,16,0,0,1,56,48H216A16,16,0,0,1,232,64Zm-16,0H56V184a23.84,23.84,0,0,1-1.37,8H208a8,8,0,0,0,8-8Z"></path>
                                                </svg>
                                              </div>
                                              <span className="font-semibold text-[10px] text-gray-700">
                                                News Sources
                                              </span>
                                            </div>
                                            <span className="font-mono font-semibold text-[10px] text-gray-500">
                                              5
                                            </span>
                                          </div>
                                          <p className="mt-1 line-clamp-2 text-[9px] text-gray-500 leading-snug">
                                            Trending topics from monitored news
                                            sources
                                          </p>
                                        </div>
                                        <div className="rounded-lg border border-stone-200 bg-white px-2.5 py-2">
                                          <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-1.5">
                                              <div className="rounded p-1 bg-orange-100/50">
                                                <svg
                                                  xmlns="http://www.w3.org/2000/svg"
                                                  fill="currentColor"
                                                  viewBox="0 0 256 256"
                                                  className="h-3 w-3 text-orange-500"
                                                >
                                                  <path
                                                    d="M141.66,201,129,213.66a8,8,0,0,1-11.32,0L92,188,58.35,221.66a8,8,0,0,1-11.32,0L34.34,209a8,8,0,0,1,0-11.31L68,164,42.34,138.36a8,8,0,0,1,0-11.32L55,114.34a8,8,0,0,1,11.32,0l75.3,75.3A8,8,0,0,1,141.66,201Z"
                                                    opacity="0.2"
                                                  ></path>
                                                  <path d="M216,32H152a8,8,0,0,0-6.34,3.12l-64,83.21L72,108.69a16,16,0,0,0-22.64,0l-12.69,12.7a16,16,0,0,0,0,22.63l20,20-28,28a16,16,0,0,0,0,22.63l12.69,12.68a16,16,0,0,0,22.62,0l28-28,20,20a16,16,0,0,0,22.64,0l12.69-12.7a16,16,0,0,0,0-22.63l-9.64-9.64,83.21-64A8,8,0,0,0,224,104V40A8,8,0,0,0,216,32ZM52.69,216,40,203.32l28-28L80.68,188Zm70.61-8L48,132.71,60.7,120,136,195.31ZM208,100.06l-81.74,62.88L115.32,152l50.34-50.34a8,8,0,0,0-11.32-11.31L104,140.68,93.07,129.74,155.94,48H208Z"></path>
                                                </svg>
                                              </div>
                                              <span className="font-semibold text-[10px] text-gray-700">
                                                Competitor Coverage
                                              </span>
                                            </div>
                                            <span className="font-mono font-semibold text-[10px] text-gray-500">
                                              4
                                            </span>
                                          </div>
                                          <p className="mt-1 line-clamp-2 text-[9px] text-gray-500 leading-snug">
                                            Topics competitors own in AI answers
                                          </p>
                                        </div>
                                        <div className="rounded-lg border border-stone-200 bg-white px-2.5 py-2">
                                          <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-1.5">
                                              <div className="rounded p-1 bg-emerald-100/50">
                                                <svg
                                                  xmlns="http://www.w3.org/2000/svg"
                                                  fill="currentColor"
                                                  viewBox="0 0 256 256"
                                                  className="h-3 w-3 text-emerald-600"
                                                >
                                                  <path
                                                    d="M128,56C48,56,16,128,16,128s32,72,112,72,112-72,112-72S208,56,128,56Zm0,112a40,40,0,1,1,40-40A40,40,0,0,1,128,168Z"
                                                    opacity="0.2"
                                                  ></path>
                                                  <path d="M53.92,34.62A8,8,0,1,0,42.08,45.38L61.32,66.55C25,88.84,9.38,123.2,8.69,124.76a8,8,0,0,0,0,6.5c.35.79,8.82,19.57,27.65,38.4C61.43,194.74,93.12,208,128,208a127.11,127.11,0,0,0,52.07-10.83l22,24.21a8,8,0,1,0,11.84-10.76Zm47.33,75.84,41.67,45.85a32,32,0,0,1-41.67-45.85ZM128,192c-30.78,0-57.67-11.19-79.93-33.25A133.16,133.16,0,0,1,25,128c4.69-8.79,19.66-33.39,47.35-49.38l18,19.75a48,48,0,0,0,63.66,70l14.73,16.2A112,112,0,0,1,128,192Zm6-95.43a8,8,0,0,1,3-15.72,48.16,48.16,0,0,1,38.77,42.64,8,8,0,0,1-7.22,8.71,6.39,6.39,0,0,1-.75,0,8,8,0,0,1-8-7.26A32.09,32.09,0,0,0,134,96.57Zm113.28,34.69c-.42.94-10.55,23.37-33.36,43.8a8,8,0,1,1-10.67-11.92A132.77,132.77,0,0,0,231.05,128a133.15,133.15,0,0,0-23.12-30.77C185.67,75.19,158.78,64,128,64a118.37,118.37,0,0,0-19.36,1.57A8,8,0,1,1,106,49.79,134,134,0,0,1,128,48c34.88,0,66.57,13.26,91.66,38.35,18.83,18.83,27.3,37.62,27.65,38.41A8,8,0,0,1,247.31,131.26Z"></path>
                                                </svg>
                                              </div>
                                              <span className="font-semibold text-[10px] text-gray-700">
                                                Low Visibility
                                              </span>
                                            </div>
                                            <span className="font-mono font-semibold text-[10px] text-gray-500">
                                              6
                                            </span>
                                          </div>
                                          <p className="mt-1 line-clamp-2 text-[9px] text-gray-500 leading-snug">
                                            Prompts where your brand rarely
                                            shows up
                                          </p>
                                        </div>
                                      </div>
                                      <div className="overflow-hidden rounded-lg border border-stone-200 bg-white">
                                        <div className="grid grid-cols-5 divide-x divide-stone-200 border-stone-200 border-b bg-gray-50/60">
                                          <div className="px-2 py-1 text-center font-medium text-[9px] text-gray-500 uppercase tracking-wider">
                                            Mon
                                          </div>
                                          <div className="px-2 py-1 text-center font-medium text-[9px] text-gray-500 uppercase tracking-wider">
                                            Tue
                                          </div>
                                          <div className="px-2 py-1 text-center font-medium text-[9px] text-gray-500 uppercase tracking-wider">
                                            Wed
                                          </div>
                                          <div className="px-2 py-1 text-center font-medium text-[9px] text-gray-500 uppercase tracking-wider">
                                            Thu
                                          </div>
                                          <div className="px-2 py-1 text-center font-medium text-[9px] text-gray-500 uppercase tracking-wider">
                                            Fri
                                          </div>
                                        </div>
                                        <div className="divide-y divide-stone-200">
                                          <div className="grid grid-cols-5 divide-x divide-stone-200">
                                            <div className="min-h-[96px] space-y-1 p-1 bg-stone-100/90">
                                              <div className="px-0.5 text-right font-medium text-[9px] text-gray-400">
                                                16
                                              </div>
                                              <div
                                                className="overflow-hidden rounded-md border border-stone-200 bg-white px-2 py-1.5"
                                                style={{
                                                  opacity: 1,
                                                  transform: "none",
                                                }}
                                              >
                                                <div className="line-clamp-2 pb-1 font-medium text-[10px] text-gray-700 leading-snug">
                                                  Best CRM for Small Businesses
                                                  in 2026
                                                </div>
                                                <div className="mt-1.5 flex items-center justify-between gap-1">
                                                  <span
                                                    className="inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden whitespace-nowrap border transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 [&&gt;svg]:pointer-events-none [&&gt;svg]:size-3 border-transparent [a&]:hover:bg-primary/90 rounded-full px-[6px] py-px font-medium text-[9px] bg-blue-100/50 text-blue-700"
                                                    data-slot="badge"
                                                  >
                                                    Comparison
                                                  </span>
                                                  <span
                                                    className="shrink-0"
                                                    title="Published"
                                                  >
                                                    <svg
                                                      xmlns="http://www.w3.org/2000/svg"
                                                      fill="currentColor"
                                                      viewBox="0 0 256 256"
                                                      className="h-3 w-3 text-emerald-500"
                                                    >
                                                      <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm45.66,85.66-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35a8,8,0,0,1,11.32,11.32Z"></path>
                                                    </svg>
                                                  </span>
                                                </div>
                                              </div>
                                            </div>
                                            <div className="min-h-[96px] space-y-1 p-1 bg-stone-100/90">
                                              <div className="px-0.5 text-right font-medium text-[9px] text-gray-400">
                                                17
                                              </div>
                                              <div
                                                className="overflow-hidden rounded-md border border-stone-200 bg-white px-2 py-1.5"
                                                style={{
                                                  opacity: 1,
                                                  transform: "none",
                                                }}
                                              >
                                                <div className="line-clamp-2 pb-1 font-medium text-[10px] text-gray-700 leading-snug">
                                                  Salesforce vs HubSpot: Which
                                                  Fits Your Team?
                                                </div>
                                                <div className="mt-1.5 flex items-center justify-between gap-1">
                                                  <span
                                                    className="inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden whitespace-nowrap border transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 [&&gt;svg]:pointer-events-none [&&gt;svg]:size-3 border-transparent [a&]:hover:bg-primary/90 rounded-full px-[6px] py-px font-medium text-[9px] bg-orange-100/50 text-orange-500"
                                                    data-slot="badge"
                                                  >
                                                    Comparison
                                                  </span>
                                                  <span
                                                    className="shrink-0"
                                                    title="Published"
                                                  >
                                                    <svg
                                                      xmlns="http://www.w3.org/2000/svg"
                                                      fill="currentColor"
                                                      viewBox="0 0 256 256"
                                                      className="h-3 w-3 text-emerald-500"
                                                    >
                                                      <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm45.66,85.66-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35a8,8,0,0,1,11.32,11.32Z"></path>
                                                    </svg>
                                                  </span>
                                                </div>
                                              </div>
                                            </div>
                                            <div className="min-h-[96px] space-y-1 bg-stone-50/80 p-1">
                                              <div className="px-0.5 text-right font-medium text-[9px] text-gray-400">
                                                18
                                              </div>
                                              <div
                                                className="overflow-hidden rounded-md border border-stone-200 bg-white px-2 py-1.5"
                                                style={{
                                                  opacity: 1,
                                                  transform: "none",
                                                }}
                                              >
                                                <div className="line-clamp-2 pb-1 font-medium text-[10px] text-gray-700 leading-snug">
                                                  What Is CRM Automation? A
                                                  Plain-English Guide
                                                </div>
                                                <div className="mt-1.5 flex items-center justify-between gap-1">
                                                  <span
                                                    className="inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden whitespace-nowrap border transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 [&&gt;svg]:pointer-events-none [&&gt;svg]:size-3 border-transparent [a&]:hover:bg-primary/90 rounded-full px-[6px] py-px font-medium text-[9px] bg-emerald-100/50 text-emerald-600"
                                                    data-slot="badge"
                                                  >
                                                    Guide
                                                  </span>
                                                  <span
                                                    className="shrink-0"
                                                    title="Publishes to WordPress"
                                                  >
                                                    <svg
                                                      className="h-3 w-3"
                                                      viewBox="0 0 122.52 122.523"
                                                      xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                      <g fill="#21759b">
                                                        <path d="m8.708 61.26c0 20.802 12.089 38.779 29.619 47.298l-25.069-68.686c-2.916 6.536-4.55 13.769-4.55 21.388z"></path>
                                                        <path d="m96.74 58.608c0-6.495-2.333-10.993-4.334-14.494-2.664-4.329-5.161-7.995-5.161-12.324 0-4.831 3.664-9.328 8.825-9.328.233 0 .454.029.681.042-9.35-8.566-21.807-13.796-35.489-13.796-18.36 0-34.513 9.42-43.91 23.688 1.233.037 2.395.063 3.382.063 5.497 0 14.006-.667 14.006-.667 2.833-.167 3.167 3.994.337 4.329 0 0-2.847.335-6.015.501l19.138 56.925 11.501-34.493-8.188-22.434c-2.83-.166-5.511-.501-5.511-.501-2.832-.166-2.5-4.496.332-4.329 0 0 8.679.667 13.843.667 5.496 0 14.006-.667 14.006-.667 2.835-.167 3.168 3.994.337 4.329 0 0-2.853.335-6.015.501l18.992 56.494 5.242-17.517c2.272-7.269 4.001-12.49 4.001-16.989z"></path>
                                                        <path d="m62.184 65.857-15.768 45.819c4.708 1.384 9.687 2.141 14.846 2.141 6.12 0 11.989-1.058 17.452-2.979-.141-.225-.269-.464-.374-.724z"></path>
                                                        <path d="m107.376 36.046c.226 1.674.354 3.471.354 5.404 0 5.333-.996 11.328-3.996 18.824l-16.053 46.413c15.624-9.111 26.133-26.038 26.133-45.426.001-9.137-2.333-17.729-6.438-25.215z"></path>
                                                        <path d="m61.262 0c-33.779 0-61.262 27.481-61.262 61.26 0 33.783 27.483 61.263 61.262 61.263 33.778 0 61.265-27.48 61.265-61.263-.001-33.779-27.487-61.26-61.265-61.26zm0 119.715c-32.23 0-58.453-26.223-58.453-58.455 0-32.23 26.222-58.451 58.453-58.451 32.229 0 58.45 26.221 58.45 58.451 0 32.232-26.221 58.455-58.45 58.455z"></path>
                                                      </g>
                                                    </svg>
                                                  </span>
                                                </div>
                                              </div>
                                              <div
                                                className="overflow-hidden rounded-md border border-stone-200 bg-white px-2 py-1.5"
                                                style={{
                                                  opacity: 1,
                                                  transform: "none",
                                                }}
                                              >
                                                <div className="line-clamp-2 pb-1 font-medium text-[10px] text-gray-700 leading-snug">
                                                  CRM Onboarding Mistakes to
                                                  Avoid
                                                </div>
                                                <div className="mt-1.5 flex items-center justify-between gap-1">
                                                  <span
                                                    className="inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden whitespace-nowrap border transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 [&&gt;svg]:pointer-events-none [&&gt;svg]:size-3 border-transparent [a&]:hover:bg-primary/90 rounded-full px-[6px] py-px font-medium text-[9px] bg-blue-100/50 text-blue-700"
                                                    data-slot="badge"
                                                  >
                                                    Listicle
                                                  </span>
                                                  <span
                                                    className="shrink-0"
                                                    title="Publishes to Framer"
                                                  >
                                                    <svg
                                                      className="h-3 w-3"
                                                      fill="none"
                                                      viewBox="0 0 192 288"
                                                      xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                      <path
                                                        d="M 96 192 L 96 288 L 0 192 L 0 96 L 96 96 L 0 0 L 192 0 L 192 96 L 96 96 L 192 192 Z"
                                                        fill="currentColor"
                                                      ></path>
                                                    </svg>
                                                  </span>
                                                </div>
                                              </div>
                                            </div>
                                            <div className="min-h-[96px] space-y-1 bg-stone-50/80 p-1">
                                              <div className="px-0.5 text-right font-medium text-[9px] text-gray-400">
                                                19
                                              </div>
                                              <div
                                                className="overflow-hidden rounded-md border border-stone-200 bg-white px-2 py-1.5"
                                                style={{
                                                  opacity: 1,
                                                  transform: "none",
                                                }}
                                              >
                                                <div className="line-clamp-2 pb-1 font-medium text-[10px] text-gray-700 leading-snug">
                                                  AI Agents in CRM: What the
                                                  Latest Releases Mean
                                                </div>
                                                <div className="mt-1.5 flex items-center justify-between gap-1">
                                                  <span
                                                    className="inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden whitespace-nowrap border transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 [&&gt;svg]:pointer-events-none [&&gt;svg]:size-3 border-transparent [a&]:hover:bg-primary/90 rounded-full px-[6px] py-px font-medium text-[9px] bg-sky-100/50 text-sky-500"
                                                    data-slot="badge"
                                                  >
                                                    News
                                                  </span>
                                                  <span
                                                    className="shrink-0"
                                                    title="Drafting"
                                                  >
                                                    <svg
                                                      xmlns="http://www.w3.org/2000/svg"
                                                      fill="currentColor"
                                                      viewBox="0 0 256 256"
                                                      className="h-3 w-3 text-amber-500"
                                                    >
                                                      <path
                                                        d="M221.66,90.34,192,120,136,64l29.66-29.66a8,8,0,0,1,11.31,0L221.66,79A8,8,0,0,1,221.66,90.34Z"
                                                        opacity="0.2"
                                                      ></path>
                                                      <path d="M227.31,73.37,182.63,28.68a16,16,0,0,0-22.63,0L36.69,152A15.86,15.86,0,0,0,32,163.31V208a16,16,0,0,0,16,16H92.69A15.86,15.86,0,0,0,104,219.31L227.31,96a16,16,0,0,0,0-22.63ZM92.69,208H48V163.31l88-88L180.69,120ZM192,108.68,147.31,64l24-24L216,84.68Z"></path>
                                                    </svg>
                                                  </span>
                                                </div>
                                              </div>
                                            </div>
                                            <div className="min-h-[96px] space-y-1 bg-stone-50/80 p-1">
                                              <div className="px-0.5 text-right font-medium text-[9px] text-gray-400">
                                                20
                                              </div>
                                              <div
                                                className="overflow-hidden rounded-md border border-stone-200 bg-white px-2 py-1.5"
                                                style={{
                                                  opacity: 1,
                                                  transform: "none",
                                                }}
                                              >
                                                <div className="line-clamp-2 pb-1 font-medium text-[10px] text-gray-700 leading-snug">
                                                  CRM Data Migration Checklist
                                                </div>
                                                <div className="mt-1.5 flex items-center justify-between gap-1">
                                                  <span
                                                    className="inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden whitespace-nowrap border transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 [&&gt;svg]:pointer-events-none [&&gt;svg]:size-3 border-transparent [a&]:hover:bg-primary/90 rounded-full px-[6px] py-px font-medium text-[9px] bg-blue-100/50 text-blue-700"
                                                    data-slot="badge"
                                                  >
                                                    How-To
                                                  </span>
                                                  <span
                                                    className="shrink-0"
                                                    title="In review"
                                                  >
                                                    <svg
                                                      xmlns="http://www.w3.org/2000/svg"
                                                      fill="currentColor"
                                                      viewBox="0 0 256 256"
                                                      className="h-3 w-3 text-emerald-500"
                                                    >
                                                      <path
                                                        d="M224,128a96,96,0,1,1-96-96A96,96,0,0,1,224,128Z"
                                                        opacity="0.2"
                                                      ></path>
                                                      <path d="M173.66,98.34a8,8,0,0,1,0,11.32l-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35A8,8,0,0,1,173.66,98.34ZM232,128A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z"></path>
                                                    </svg>
                                                  </span>
                                                </div>
                                              </div>
                                              <div
                                                className="overflow-hidden rounded-md border border-stone-200 bg-white px-2 py-1.5"
                                                style={{
                                                  opacity: 1,
                                                  transform: "none",
                                                }}
                                              >
                                                <div className="line-clamp-2 pb-1 font-medium text-[10px] text-gray-700 leading-snug">
                                                  HubSpot's New AI Features:
                                                  First Impressions
                                                </div>
                                                <div className="mt-1.5 flex items-center justify-between gap-1">
                                                  <span
                                                    className="inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden whitespace-nowrap border transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 [&&gt;svg]:pointer-events-none [&&gt;svg]:size-3 border-transparent [a&]:hover:bg-primary/90 rounded-full px-[6px] py-px font-medium text-[9px] bg-sky-100/50 text-sky-500"
                                                    data-slot="badge"
                                                  >
                                                    News
                                                  </span>
                                                  <span
                                                    className="shrink-0"
                                                    title="Publishes to Webflow"
                                                  >
                                                    <svg
                                                      className="h-3 w-3"
                                                      fill="none"
                                                      viewBox="225 337.5 673.312 420"
                                                      xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                      <path
                                                        clipRule="evenodd"
                                                        d="M898.312 337.5L683.467 757.5H481.667L571.579 583.434H567.545C493.368 679.726 382.694 743.115 225 757.5V585.843C225 585.843 325.88 579.884 385.185 517.534H225V337.503H405.031V485.576L409.072 485.559L482.639 337.503H618.791V484.637L622.832 484.631L699.159 337.5H898.312Z"
                                                        fill="#146EF5"
                                                        fillRule="evenodd"
                                                      ></path>
                                                    </svg>
                                                  </span>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                          <div className="grid grid-cols-5 divide-x divide-stone-200">
                                            <div className="min-h-[96px] space-y-1 bg-stone-50/80 p-1">
                                              <div className="px-0.5 text-right font-medium text-[9px] text-gray-400">
                                                23
                                              </div>
                                              <div
                                                className="overflow-hidden rounded-md border border-stone-200 bg-white px-2 py-1.5"
                                                style={{
                                                  opacity: 1,
                                                  transform: "none",
                                                }}
                                              >
                                                <div className="line-clamp-2 pb-1 font-medium text-[10px] text-gray-700 leading-snug">
                                                  CRM Pricing Explained: Hidden
                                                  Costs to Watch
                                                </div>
                                                <div className="mt-1.5 flex items-center justify-between gap-1">
                                                  <span
                                                    className="inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden whitespace-nowrap border transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 [&&gt;svg]:pointer-events-none [&&gt;svg]:size-3 border-transparent [a&]:hover:bg-primary/90 rounded-full px-[6px] py-px font-medium text-[9px] bg-emerald-100/50 text-emerald-600"
                                                    data-slot="badge"
                                                  >
                                                    Article
                                                  </span>
                                                  <span
                                                    className="shrink-0"
                                                    title="Publishes to WordPress"
                                                  >
                                                    <svg
                                                      className="h-3 w-3"
                                                      viewBox="0 0 122.52 122.523"
                                                      xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                      <g fill="#21759b">
                                                        <path d="m8.708 61.26c0 20.802 12.089 38.779 29.619 47.298l-25.069-68.686c-2.916 6.536-4.55 13.769-4.55 21.388z"></path>
                                                        <path d="m96.74 58.608c0-6.495-2.333-10.993-4.334-14.494-2.664-4.329-5.161-7.995-5.161-12.324 0-4.831 3.664-9.328 8.825-9.328.233 0 .454.029.681.042-9.35-8.566-21.807-13.796-35.489-13.796-18.36 0-34.513 9.42-43.91 23.688 1.233.037 2.395.063 3.382.063 5.497 0 14.006-.667 14.006-.667 2.833-.167 3.167 3.994.337 4.329 0 0-2.847.335-6.015.501l19.138 56.925 11.501-34.493-8.188-22.434c-2.83-.166-5.511-.501-5.511-.501-2.832-.166-2.5-4.496.332-4.329 0 0 8.679.667 13.843.667 5.496 0 14.006-.667 14.006-.667 2.835-.167 3.168 3.994.337 4.329 0 0-2.853.335-6.015.501l18.992 56.494 5.242-17.517c2.272-7.269 4.001-12.49 4.001-16.989z"></path>
                                                        <path d="m62.184 65.857-15.768 45.819c4.708 1.384 9.687 2.141 14.846 2.141 6.12 0 11.989-1.058 17.452-2.979-.141-.225-.269-.464-.374-.724z"></path>
                                                        <path d="m107.376 36.046c.226 1.674.354 3.471.354 5.404 0 5.333-.996 11.328-3.996 18.824l-16.053 46.413c15.624-9.111 26.133-26.038 26.133-45.426.001-9.137-2.333-17.729-6.438-25.215z"></path>
                                                        <path d="m61.262 0c-33.779 0-61.262 27.481-61.262 61.26 0 33.783 27.483 61.263 61.262 61.263 33.778 0 61.265-27.48 61.265-61.263-.001-33.779-27.487-61.26-61.265-61.26zm0 119.715c-32.23 0-58.453-26.223-58.453-58.455 0-32.23 26.222-58.451 58.453-58.451 32.229 0 58.45 26.221 58.45 58.451 0 32.232-26.221 58.455-58.45 58.455z"></path>
                                                      </g>
                                                    </svg>
                                                  </span>
                                                </div>
                                              </div>
                                            </div>
                                            <div className="min-h-[96px] space-y-1 bg-stone-50/80 p-1">
                                              <div className="px-0.5 text-right font-medium text-[9px] text-gray-400">
                                                24
                                              </div>
                                              <div
                                                className="overflow-hidden rounded-md border border-stone-200 bg-white px-2 py-1.5"
                                                style={{
                                                  opacity: 1,
                                                  transform: "none",
                                                }}
                                              >
                                                <div className="line-clamp-2 pb-1 font-medium text-[10px] text-gray-700 leading-snug">
                                                  Pipedrive Alternatives Worth
                                                  Considering
                                                </div>
                                                <div className="mt-1.5 flex items-center justify-between gap-1">
                                                  <span
                                                    className="inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden whitespace-nowrap border transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 [&&gt;svg]:pointer-events-none [&&gt;svg]:size-3 border-transparent [a&]:hover:bg-primary/90 rounded-full px-[6px] py-px font-medium text-[9px] bg-orange-100/50 text-orange-500"
                                                    data-slot="badge"
                                                  >
                                                    Listicle
                                                  </span>
                                                  <span
                                                    className="shrink-0"
                                                    title="Publishes to Framer"
                                                  >
                                                    <svg
                                                      className="h-3 w-3"
                                                      fill="none"
                                                      viewBox="0 0 192 288"
                                                      xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                      <path
                                                        d="M 96 192 L 96 288 L 0 192 L 0 96 L 96 96 L 0 0 L 192 0 L 192 96 L 96 96 L 192 192 Z"
                                                        fill="currentColor"
                                                      ></path>
                                                    </svg>
                                                  </span>
                                                </div>
                                              </div>
                                            </div>
                                            <div className="min-h-[96px] space-y-1 bg-stone-50/80 p-1">
                                              <div className="px-0.5 text-right font-medium text-[9px] text-gray-400">
                                                25
                                              </div>
                                              <div
                                                className="overflow-hidden rounded-md border border-stone-200 bg-white px-2 py-1.5"
                                                style={{
                                                  opacity: 1,
                                                  transform: "none",
                                                }}
                                              >
                                                <div className="line-clamp-2 pb-1 font-medium text-[10px] text-gray-700 leading-snug">
                                                  How to Choose a CRM: A
                                                  12-Point Framework
                                                </div>
                                                <div className="mt-1.5 flex items-center justify-between gap-1">
                                                  <span
                                                    className="inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden whitespace-nowrap border transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 [&&gt;svg]:pointer-events-none [&&gt;svg]:size-3 border-transparent [a&]:hover:bg-primary/90 rounded-full px-[6px] py-px font-medium text-[9px] bg-blue-100/50 text-blue-700"
                                                    data-slot="badge"
                                                  >
                                                    How-To
                                                  </span>
                                                  <span
                                                    className="shrink-0"
                                                    title="Publishes to Webflow"
                                                  >
                                                    <svg
                                                      className="h-3 w-3"
                                                      fill="none"
                                                      viewBox="225 337.5 673.312 420"
                                                      xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                      <path
                                                        clipRule="evenodd"
                                                        d="M898.312 337.5L683.467 757.5H481.667L571.579 583.434H567.545C493.368 679.726 382.694 743.115 225 757.5V585.843C225 585.843 325.88 579.884 385.185 517.534H225V337.503H405.031V485.576L409.072 485.559L482.639 337.503H618.791V484.637L622.832 484.631L699.159 337.5H898.312Z"
                                                        fill="#146EF5"
                                                        fillRule="evenodd"
                                                      ></path>
                                                    </svg>
                                                  </span>
                                                </div>
                                              </div>
                                            </div>
                                            <div className="min-h-[96px] space-y-1 bg-stone-50/80 p-1">
                                              <div className="px-0.5 text-right font-medium text-[9px] text-gray-400">
                                                26
                                              </div>
                                              <div
                                                className="overflow-hidden rounded-md border border-stone-200 bg-white px-2 py-1.5"
                                                style={{
                                                  opacity: 1,
                                                  transform: "none",
                                                }}
                                              >
                                                <div className="line-clamp-2 pb-1 font-medium text-[10px] text-gray-700 leading-snug">
                                                  EU AI Act & Customer Data:
                                                  What CRM Buyers Should Know
                                                </div>
                                                <div className="mt-1.5 flex items-center justify-between gap-1">
                                                  <span
                                                    className="inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden whitespace-nowrap border transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 [&&gt;svg]:pointer-events-none [&&gt;svg]:size-3 border-transparent [a&]:hover:bg-primary/90 rounded-full px-[6px] py-px font-medium text-[9px] bg-sky-100/50 text-sky-500"
                                                    data-slot="badge"
                                                  >
                                                    News
                                                  </span>
                                                  <span
                                                    className="shrink-0"
                                                    title="Publishes to WordPress"
                                                  >
                                                    <svg
                                                      className="h-3 w-3"
                                                      viewBox="0 0 122.52 122.523"
                                                      xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                      <g fill="#21759b">
                                                        <path d="m8.708 61.26c0 20.802 12.089 38.779 29.619 47.298l-25.069-68.686c-2.916 6.536-4.55 13.769-4.55 21.388z"></path>
                                                        <path d="m96.74 58.608c0-6.495-2.333-10.993-4.334-14.494-2.664-4.329-5.161-7.995-5.161-12.324 0-4.831 3.664-9.328 8.825-9.328.233 0 .454.029.681.042-9.35-8.566-21.807-13.796-35.489-13.796-18.36 0-34.513 9.42-43.91 23.688 1.233.037 2.395.063 3.382.063 5.497 0 14.006-.667 14.006-.667 2.833-.167 3.167 3.994.337 4.329 0 0-2.847.335-6.015.501l19.138 56.925 11.501-34.493-8.188-22.434c-2.83-.166-5.511-.501-5.511-.501-2.832-.166-2.5-4.496.332-4.329 0 0 8.679.667 13.843.667 5.496 0 14.006-.667 14.006-.667 2.835-.167 3.168 3.994.337 4.329 0 0-2.853.335-6.015.501l18.992 56.494 5.242-17.517c2.272-7.269 4.001-12.49 4.001-16.989z"></path>
                                                        <path d="m62.184 65.857-15.768 45.819c4.708 1.384 9.687 2.141 14.846 2.141 6.12 0 11.989-1.058 17.452-2.979-.141-.225-.269-.464-.374-.724z"></path>
                                                        <path d="m107.376 36.046c.226 1.674.354 3.471.354 5.404 0 5.333-.996 11.328-3.996 18.824l-16.053 46.413c15.624-9.111 26.133-26.038 26.133-45.426.001-9.137-2.333-17.729-6.438-25.215z"></path>
                                                        <path d="m61.262 0c-33.779 0-61.262 27.481-61.262 61.26 0 33.783 27.483 61.263 61.262 61.263 33.778 0 61.265-27.48 61.265-61.263-.001-33.779-27.487-61.26-61.265-61.26zm0 119.715c-32.23 0-58.453-26.223-58.453-58.455 0-32.23 26.222-58.451 58.453-58.451 32.229 0 58.45 26.221 58.45 58.451 0 32.232-26.221 58.455-58.45 58.455z"></path>
                                                      </g>
                                                    </svg>
                                                  </span>
                                                </div>
                                              </div>
                                            </div>
                                            <div className="min-h-[96px] space-y-1 bg-stone-50/80 p-1">
                                              <div className="px-0.5 text-right font-medium text-[9px] text-gray-400">
                                                27
                                              </div>
                                              <div
                                                className="overflow-hidden rounded-md border border-stone-200 bg-white px-2 py-1.5"
                                                style={{
                                                  opacity: 1,
                                                  transform: "none",
                                                }}
                                              >
                                                <div className="line-clamp-2 pb-1 font-medium text-[10px] text-gray-700 leading-snug">
                                                  Connecting Your Sales Stack:
                                                  CRM Integrations 101
                                                </div>
                                                <div className="mt-1.5 flex items-center justify-between gap-1">
                                                  <span
                                                    className="inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden whitespace-nowrap border transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 [&&gt;svg]:pointer-events-none [&&gt;svg]:size-3 border-transparent [a&]:hover:bg-primary/90 rounded-full px-[6px] py-px font-medium text-[9px] bg-emerald-100/50 text-emerald-600"
                                                    data-slot="badge"
                                                  >
                                                    Guide
                                                  </span>
                                                  <span
                                                    className="shrink-0"
                                                    title="Publishes to Framer"
                                                  >
                                                    <svg
                                                      className="h-3 w-3"
                                                      fill="none"
                                                      viewBox="0 0 192 288"
                                                      xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                      <path
                                                        d="M 96 192 L 96 288 L 0 192 L 0 96 L 96 96 L 0 0 L 192 0 L 192 96 L 96 96 L 192 192 Z"
                                                        fill="currentColor"
                                                      ></path>
                                                    </svg>
                                                  </span>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                          <div className="grid grid-cols-5 divide-x divide-stone-200">
                                            <div className="min-h-[96px] space-y-1 bg-stone-50/80 p-1">
                                              <div className="px-0.5 text-right font-medium text-[9px] text-gray-400">
                                                30
                                              </div>
                                              <div
                                                className="overflow-hidden rounded-md border border-stone-200 bg-white px-2 py-1.5"
                                                style={{
                                                  opacity: 1,
                                                  transform: "none",
                                                }}
                                              >
                                                <div className="line-clamp-2 pb-1 font-medium text-[10px] text-gray-700 leading-snug">
                                                  CRM Security & Compliance: A
                                                  Buyer's Checklist
                                                </div>
                                                <div className="mt-1.5 flex items-center justify-between gap-1">
                                                  <span
                                                    className="inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden whitespace-nowrap border transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 [&&gt;svg]:pointer-events-none [&&gt;svg]:size-3 border-transparent [a&]:hover:bg-primary/90 rounded-full px-[6px] py-px font-medium text-[9px] bg-blue-100/50 text-blue-700"
                                                    data-slot="badge"
                                                  >
                                                    How-To
                                                  </span>
                                                  <span
                                                    className="shrink-0"
                                                    title="Publishes to WordPress"
                                                  >
                                                    <svg
                                                      className="h-3 w-3"
                                                      viewBox="0 0 122.52 122.523"
                                                      xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                      <g fill="#21759b">
                                                        <path d="m8.708 61.26c0 20.802 12.089 38.779 29.619 47.298l-25.069-68.686c-2.916 6.536-4.55 13.769-4.55 21.388z"></path>
                                                        <path d="m96.74 58.608c0-6.495-2.333-10.993-4.334-14.494-2.664-4.329-5.161-7.995-5.161-12.324 0-4.831 3.664-9.328 8.825-9.328.233 0 .454.029.681.042-9.35-8.566-21.807-13.796-35.489-13.796-18.36 0-34.513 9.42-43.91 23.688 1.233.037 2.395.063 3.382.063 5.497 0 14.006-.667 14.006-.667 2.833-.167 3.167 3.994.337 4.329 0 0-2.847.335-6.015.501l19.138 56.925 11.501-34.493-8.188-22.434c-2.83-.166-5.511-.501-5.511-.501-2.832-.166-2.5-4.496.332-4.329 0 0 8.679.667 13.843.667 5.496 0 14.006-.667 14.006-.667 2.835-.167 3.168 3.994.337 4.329 0 0-2.853.335-6.015.501l18.992 56.494 5.242-17.517c2.272-7.269 4.001-12.49 4.001-16.989z"></path>
                                                        <path d="m62.184 65.857-15.768 45.819c4.708 1.384 9.687 2.141 14.846 2.141 6.12 0 11.989-1.058 17.452-2.979-.141-.225-.269-.464-.374-.724z"></path>
                                                        <path d="m107.376 36.046c.226 1.674.354 3.471.354 5.404 0 5.333-.996 11.328-3.996 18.824l-16.053 46.413c15.624-9.111 26.133-26.038 26.133-45.426.001-9.137-2.333-17.729-6.438-25.215z"></path>
                                                        <path d="m61.262 0c-33.779 0-61.262 27.481-61.262 61.26 0 33.783 27.483 61.263 61.262 61.263 33.778 0 61.265-27.48 61.265-61.263-.001-33.779-27.487-61.26-61.265-61.26zm0 119.715c-32.23 0-58.453-26.223-58.453-58.455 0-32.23 26.222-58.451 58.453-58.451 32.229 0 58.45 26.221 58.45 58.451 0 32.232-26.221 58.455-58.45 58.455z"></path>
                                                      </g>
                                                    </svg>
                                                  </span>
                                                </div>
                                              </div>
                                            </div>
                                            <div className="min-h-[96px] space-y-1 bg-stone-50/80 p-1">
                                              <div className="px-0.5 text-right font-medium text-[9px] text-gray-400">
                                                1
                                              </div>
                                              <div
                                                className="overflow-hidden rounded-md border border-stone-200 bg-white px-2 py-1.5"
                                                style={{
                                                  opacity: 1,
                                                  transform: "none",
                                                }}
                                              >
                                                <div className="line-clamp-2 pb-1 font-medium text-[10px] text-gray-700 leading-snug">
                                                  Zoho vs monday.com for Growing
                                                  Teams
                                                </div>
                                                <div className="mt-1.5 flex items-center justify-between gap-1">
                                                  <span
                                                    className="inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden whitespace-nowrap border transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 [&&gt;svg]:pointer-events-none [&&gt;svg]:size-3 border-transparent [a&]:hover:bg-primary/90 rounded-full px-[6px] py-px font-medium text-[9px] bg-orange-100/50 text-orange-500"
                                                    data-slot="badge"
                                                  >
                                                    Comparison
                                                  </span>
                                                  <span
                                                    className="shrink-0"
                                                    title="Publishes to Framer"
                                                  >
                                                    <svg
                                                      className="h-3 w-3"
                                                      fill="none"
                                                      viewBox="0 0 192 288"
                                                      xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                      <path
                                                        d="M 96 192 L 96 288 L 0 192 L 0 96 L 96 96 L 0 0 L 192 0 L 192 96 L 96 96 L 192 192 Z"
                                                        fill="currentColor"
                                                      ></path>
                                                    </svg>
                                                  </span>
                                                </div>
                                              </div>
                                            </div>
                                            <div className="min-h-[96px] space-y-1 bg-stone-50/80 p-1">
                                              <div className="px-0.5 text-right font-medium text-[9px] text-gray-400">
                                                2
                                              </div>
                                              <div
                                                className="overflow-hidden rounded-md border border-stone-200 bg-white px-2 py-1.5"
                                                style={{
                                                  opacity: 1,
                                                  transform: "none",
                                                }}
                                              >
                                                <div className="line-clamp-2 pb-1 font-medium text-[10px] text-gray-700 leading-snug">
                                                  Why AI Assistants Recommend
                                                  Some CRMs Over Others
                                                </div>
                                                <div className="mt-1.5 flex items-center justify-between gap-1">
                                                  <span
                                                    className="inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden whitespace-nowrap border transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 [&&gt;svg]:pointer-events-none [&&gt;svg]:size-3 border-transparent [a&]:hover:bg-primary/90 rounded-full px-[6px] py-px font-medium text-[9px] bg-emerald-100/50 text-emerald-600"
                                                    data-slot="badge"
                                                  >
                                                    Article
                                                  </span>
                                                  <span
                                                    className="shrink-0"
                                                    title="Publishes to Webflow"
                                                  >
                                                    <svg
                                                      className="h-3 w-3"
                                                      fill="none"
                                                      viewBox="225 337.5 673.312 420"
                                                      xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                      <path
                                                        clipRule="evenodd"
                                                        d="M898.312 337.5L683.467 757.5H481.667L571.579 583.434H567.545C493.368 679.726 382.694 743.115 225 757.5V585.843C225 585.843 325.88 579.884 385.185 517.534H225V337.503H405.031V485.576L409.072 485.559L482.639 337.503H618.791V484.637L622.832 484.631L699.159 337.5H898.312Z"
                                                        fill="#146EF5"
                                                        fillRule="evenodd"
                                                      ></path>
                                                    </svg>
                                                  </span>
                                                </div>
                                              </div>
                                            </div>
                                            <div className="min-h-[96px] space-y-1 bg-stone-50/80 p-1">
                                              <div className="px-0.5 text-right font-medium text-[9px] text-gray-400">
                                                3
                                              </div>
                                              <div
                                                className="overflow-hidden rounded-md border border-stone-200 bg-white px-2 py-1.5"
                                                style={{
                                                  opacity: 1,
                                                  transform: "none",
                                                }}
                                              >
                                                <div className="line-clamp-2 pb-1 font-medium text-[10px] text-gray-700 leading-snug">
                                                  Gartner's Latest CRM Market
                                                  Report: Key Takeaways
                                                </div>
                                                <div className="mt-1.5 flex items-center justify-between gap-1">
                                                  <span
                                                    className="inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden whitespace-nowrap border transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 [&&gt;svg]:pointer-events-none [&&gt;svg]:size-3 border-transparent [a&]:hover:bg-primary/90 rounded-full px-[6px] py-px font-medium text-[9px] bg-sky-100/50 text-sky-500"
                                                    data-slot="badge"
                                                  >
                                                    News
                                                  </span>
                                                  <span
                                                    className="shrink-0"
                                                    title="Publishes to WordPress"
                                                  >
                                                    <svg
                                                      className="h-3 w-3"
                                                      viewBox="0 0 122.52 122.523"
                                                      xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                      <g fill="#21759b">
                                                        <path d="m8.708 61.26c0 20.802 12.089 38.779 29.619 47.298l-25.069-68.686c-2.916 6.536-4.55 13.769-4.55 21.388z"></path>
                                                        <path d="m96.74 58.608c0-6.495-2.333-10.993-4.334-14.494-2.664-4.329-5.161-7.995-5.161-12.324 0-4.831 3.664-9.328 8.825-9.328.233 0 .454.029.681.042-9.35-8.566-21.807-13.796-35.489-13.796-18.36 0-34.513 9.42-43.91 23.688 1.233.037 2.395.063 3.382.063 5.497 0 14.006-.667 14.006-.667 2.833-.167 3.167 3.994.337 4.329 0 0-2.847.335-6.015.501l19.138 56.925 11.501-34.493-8.188-22.434c-2.83-.166-5.511-.501-5.511-.501-2.832-.166-2.5-4.496.332-4.329 0 0 8.679.667 13.843.667 5.496 0 14.006-.667 14.006-.667 2.835-.167 3.168 3.994.337 4.329 0 0-2.853.335-6.015.501l18.992 56.494 5.242-17.517c2.272-7.269 4.001-12.49 4.001-16.989z"></path>
                                                        <path d="m62.184 65.857-15.768 45.819c4.708 1.384 9.687 2.141 14.846 2.141 6.12 0 11.989-1.058 17.452-2.979-.141-.225-.269-.464-.374-.724z"></path>
                                                        <path d="m107.376 36.046c.226 1.674.354 3.471.354 5.404 0 5.333-.996 11.328-3.996 18.824l-16.053 46.413c15.624-9.111 26.133-26.038 26.133-45.426.001-9.137-2.333-17.729-6.438-25.215z"></path>
                                                        <path d="m61.262 0c-33.779 0-61.262 27.481-61.262 61.26 0 33.783 27.483 61.263 61.262 61.263 33.778 0 61.265-27.48 61.265-61.263-.001-33.779-27.487-61.26-61.265-61.26zm0 119.715c-32.23 0-58.453-26.223-58.453-58.455 0-32.23 26.222-58.451 58.453-58.451 32.229 0 58.45 26.221 58.45 58.451 0 32.232-26.221 58.455-58.45 58.455z"></path>
                                                      </g>
                                                    </svg>
                                                  </span>
                                                </div>
                                              </div>
                                            </div>
                                            <div className="min-h-[96px] space-y-1 bg-stone-50/80 p-1">
                                              <div className="px-0.5 text-right font-medium text-[9px] text-gray-400">
                                                4
                                              </div>
                                              <div
                                                className="overflow-hidden rounded-md border border-stone-200 bg-white px-2 py-1.5"
                                                style={{
                                                  opacity: 1,
                                                  transform: "none",
                                                }}
                                              >
                                                <div className="line-clamp-2 pb-1 font-medium text-[10px] text-gray-700 leading-snug">
                                                  CRM Reporting Templates Your
                                                  Team Will Use
                                                </div>
                                                <div className="mt-1.5 flex items-center justify-between gap-1">
                                                  <span
                                                    className="inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden whitespace-nowrap border transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 [&&gt;svg]:pointer-events-none [&&gt;svg]:size-3 border-transparent [a&]:hover:bg-primary/90 rounded-full px-[6px] py-px font-medium text-[9px] bg-blue-100/50 text-blue-700"
                                                    data-slot="badge"
                                                  >
                                                    Guide
                                                  </span>
                                                  <span
                                                    className="shrink-0"
                                                    title="Publishes to Framer"
                                                  >
                                                    <svg
                                                      className="h-3 w-3"
                                                      fill="none"
                                                      viewBox="0 0 192 288"
                                                      xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                      <path
                                                        d="M 96 192 L 96 288 L 0 192 L 0 96 L 96 96 L 0 0 L 192 0 L 192 96 L 96 96 L 192 192 Z"
                                                        fill="currentColor"
                                                      ></path>
                                                    </svg>
                                                  </span>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div aria-hidden="true" className="p-[0.5px]">
              <div className="h-full rounded bg-background/75 max-lg:w-2"></div>
            </div>
          </div>
          <div className="@container grid grid-cols-[auto_1fr_auto] lg:grid-cols-[1fr_minmax(0,69rem)_1fr]">
            <div aria-hidden="true" className="p-[0.5px]">
              <div className="h-full rounded bg-background/75 max-lg:w-2"></div>
            </div>
            <div className="mx-auto w-full max-w-276 lg:min-w-5xl xl:min-w-276 p-[0.5px]">
              <div className="rounded bg-background/75 h-8" data-slot="content">
                <div className="h-8"></div>
              </div>
            </div>
            <div aria-hidden="true" className="p-[0.5px]">
              <div className="h-full rounded bg-background/75 max-lg:w-2"></div>
            </div>
          </div>
          <div className="@container grid grid-cols-[auto_1fr_auto] lg:grid-cols-[1fr_minmax(0,69rem)_1fr]">
            <div aria-hidden="true" className="p-[0.5px]">
              <div className="h-full rounded bg-background/75 max-lg:w-2"></div>
            </div>
            <div className="mx-auto w-full max-w-276 lg:min-w-5xl xl:min-w-276">
              <div className="grid *:p-[0.5px] **:data-grid-content:h-full **:data-grid-content:rounded **:data-grid-content:bg-background/75 relative">
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
                        <h3 className="font-medium text-sm">
                          Content Gap Analysis
                        </h3>
                      </div>
                      <p className="text-muted-foreground text-sm">
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
                        <h3 className="font-medium text-sm">
                          Content Calendar
                        </h3>
                      </div>
                      <p className="text-muted-foreground text-sm">
                        Automatically schedule your content to be published at
                        the best time.
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
                        See the full timeline from publish to citation so you
                        know what's working and how fast.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div aria-hidden="true" className="p-[0.5px]">
              <div className="h-full rounded bg-background/75 max-lg:w-2"></div>
            </div>
          </div>
        </section>
        <div className="@container grid grid-cols-[auto_1fr_auto] lg:grid-cols-[1fr_minmax(0,69rem)_1fr]">
          <div aria-hidden="true" className="p-[0.5px]">
            <div className="h-full rounded bg-background/75 max-lg:w-2"></div>
          </div>
          <div className="mx-auto w-full max-w-276 lg:min-w-5xl xl:min-w-276 p-[0.5px]">
            <div className="rounded bg-background/75 h-24" data-slot="content">
              <div className="h-24"></div>
            </div>
          </div>
          <div aria-hidden="true" className="p-[0.5px]">
            <div className="h-full rounded bg-background/75 max-lg:w-2"></div>
          </div>
        </div>
        <section>
          <div className="@container grid grid-cols-[auto_1fr_auto] lg:grid-cols-[1fr_minmax(0,69rem)_1fr]">
            <div aria-hidden="true" className="p-[0.5px]">
              <div className="h-full rounded bg-background/75 max-lg:w-2"></div>
            </div>
            <div className="mx-auto w-full max-w-276 lg:min-w-5xl xl:min-w-276">
              <div className="grid *:p-[0.5px] **:data-grid-content:h-full **:data-grid-content:rounded **:data-grid-content:bg-background/75 relative">
                <div className="grid gap-px">
                  <div
                    className="relative overflow-hidden"
                    data-grid-content="true"
                  >
                    <div className="relative z-10 @4xl:px-8 px-6 @4xl:pt-14 pt-8 @4xl:pb-40 pb-28">
                      <p className="inline-flex items-center gap-px text-xs tracking-widest text-muted-foreground mb-4">
                        <span
                          aria-hidden="true"
                          className="font-mono text-muted-foreground/50"
                        >
                          [
                        </span>
                        insights at scale
                        <span
                          aria-hidden="true"
                          className="font-mono text-muted-foreground/50"
                        >
                          ]
                        </span>
                      </p>
                      <h2 className="mb-4 max-w-3xl text-pretty font-medium text-2xl text-foreground leading-tight lg:text-4xl">
                        Our data tells the story with <br />{" "}
                        <span>26,520,900,000</span>{" "}
                        <span className="text-primary underline decoration-primary/50 decoration-dashed">
                          citations
                        </span>
                        , clicks, and prompts
                      </h2>
                      <p className="max-w-xl text-pretty font-normal text-base text-muted-foreground lg:text-lg">
                        As one of the first AI SEO/GEO platforms collecting real
                        prompt data and crawler logs, our{" "}
                        <a className="text-primary hover:underline" href="#">
                          insights
                        </a>{" "}
                        are featured in leading newspapers and research firms
                        worldwide.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div aria-hidden="true" className="p-[0.5px]">
              <div className="h-full rounded bg-background/75 max-lg:w-2"></div>
            </div>
          </div>
        </section>
        <div
          id="chatgpt-shopping"
          className="@container grid grid-cols-[auto_1fr_auto] lg:grid-cols-[1fr_minmax(0,69rem)_1fr]"
        >
          <div aria-hidden="true" className="p-[0.5px]">
            <div className="h-full rounded bg-background/75 max-lg:w-2"></div>
          </div>
          <div className="mx-auto w-full max-w-276 lg:min-w-5xl xl:min-w-276">
            <div className="grid *:p-[0.5px] **:data-grid-content:h-full **:data-grid-content:rounded **:data-grid-content:bg-background/75 relative">
              <div className="relative grid gap-px overflow-hidden">
                <div
                  className="relative z-10 p-6 @4xl:px-8 @4xl:pt-20 @4xl:pb-14"
                  data-grid-content="true"
                >
                  <p className="inline-flex items-center gap-px text-xs tracking-widest text-muted-foreground mb-4">
                    <span
                      aria-hidden="true"
                      className="font-mono text-muted-foreground/50"
                    >
                      [
                    </span>
                    agentic shopping
                    <span
                      aria-hidden="true"
                      className="font-mono text-muted-foreground/50"
                    >
                      ]
                    </span>
                  </p>
                  <h2 className="mb-4 max-w-3xl text-pretty font-medium text-2xl text-foreground leading-tight lg:text-4xl ">
                    Get{" "}
                    <span className="text-primary underline decoration-primary/50 decoration-dashed">
                      real insights
                    </span>{" "}
                    from real prompts
                  </h2>
                  <p className="max-w-3xl text-pretty font-normal text-base text-muted-foreground lg:text-lg ">
                    Access the only source of{" "}
                    <span className="font-medium text-black">
                      real AI responses
                    </span>
                    . See actual recommendations and citations of what AI is
                    showing to users.
                  </p>
                </div>
              </div>
              <div className="grid @2xl:grid-cols-2 @4xl:grid-cols-10 gap-px [--color-primary:var(--color-indigo-500)]">
                <div className="@4xl:col-span-6">
                  <div
                    className="h-full bg-white! @4xl:p-6 p-4"
                    data-grid-content="true"
                  >
                    <Image
                      src="/assets/imageplaceholder.svg"
                      alt={"imageplaceholder"}
                      width={800}
                      height={800}
                      className="h-auto max-w-full object-contain"
                    />
                  </div>
                </div>
                <div className="@4xl:col-span-4">
                  <div className="grid h-full gap-px">
                    <div
                      className="bg-white! @4xl:p-6 p-4"
                      data-grid-content="true"
                    >
                      <div className="flex items-start gap-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 256 256"
                          className="mt-0.5 size-5 text-gray-600"
                        >
                          <path
                            d="M104,168a40,40,0,1,1-40-40A40,40,0,0,1,104,168Zm88-40a40,40,0,1,0,40,40A40,40,0,0,0,192,128Z"
                            opacity="0.2"
                          ></path>
                          <path d="M237.2,151.87v0a47.1,47.1,0,0,0-2.35-5.45L193.26,51.8a7.82,7.82,0,0,0-1.66-2.44,32,32,0,0,0-45.26,0A8,8,0,0,0,144,55V80H112V55a8,8,0,0,0-2.34-5.66,32,32,0,0,0-45.26,0,7.82,7.82,0,0,0-1.66,2.44L21.15,146.4a47.1,47.1,0,0,0-2.35,5.45v0A48,48,0,1,0,112,168V96h32v72a48,48,0,1,0,93.2-16.13ZM76.71,59.75a16,16,0,0,1,19.29-1v73.51a47.9,47.9,0,0,0-46.79-9.92ZM64,200a32,32,0,1,1,32-32A32,32,0,0,1,64,200ZM160,58.74a16,16,0,0,1,19.29,1l27.5,62.58A47.9,47.9,0,0,0,160,132.25ZM192,200a32,32,0,1,1,32-32A32,32,0,0,1,192,200Z"></path>
                        </svg>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">
                            Visibility Score
                          </h4>
                          <p className="mt-1 text-gray-600 text-sm">
                            Track responses and ensure your AI outputs are
                            easily understood.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div
                      className="bg-white! @4xl:p-6 p-4"
                      data-grid-content="true"
                    >
                      <div className="flex items-start gap-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 256 256"
                          className="mt-0.5 size-5 text-gray-600"
                        >
                          <path
                            d="M216,48v55.77C216,174.6,176.6,232,128,232S40,174.6,40,103.79V48a8,8,0,0,1,10.89-7.47C66,46.41,95.11,55.71,128,55.71s62-9.3,77.11-15.16A8,8,0,0,1,216,48Z"
                            opacity="0.2"
                          ></path>
                          <path d="M217,34.8a15.94,15.94,0,0,0-14.82-1.71C188.15,38.55,159.82,47.71,128,47.71S67.84,38.55,53.79,33.09A16,16,0,0,0,32,48v55.77c0,35.84,9.65,69.65,27.18,95.18,18.16,26.46,42.6,41,68.82,41s50.66-14.57,68.82-41C214.35,173.44,224,139.63,224,103.79V48A16,16,0,0,0,217,34.8Zm-9,69c0,32.64-8.66,63.23-24.37,86.13C168.54,211.9,148.79,224,128,224s-40.54-12.1-55.63-34.08C56.66,167,48,136.43,48,103.79V48c15.11,5.87,45.58,15.71,80,15.71S192.9,53.87,208,48v55.81Zm-18,18.87A8,8,0,1,1,178,133.33c-2.68-3-8.85-5.33-14-5.33s-11.36,2.34-14,5.33A8,8,0,1,1,138,122.66c5.71-6.38,16.14-10.66,26-10.66S184.25,116.28,190,122.66ZM92,128c-5.19,0-11.36,2.34-14,5.33A8,8,0,1,1,66,122.66C71.75,116.28,82.18,112,92,112s20.25,4.28,26,10.66A8,8,0,1,1,106,133.33C103.36,130.34,97.19,128,92,128Zm76.45,45.19a52.9,52.9,0,0,1-80.9,0A8,8,0,1,1,99.72,162.8a36.89,36.89,0,0,0,56.56,0,8,8,0,0,1,12.17,10.39Z"></path>
                        </svg>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">
                            Sentiment Analysis
                          </h4>
                          <p className="mt-1 text-gray-600 text-sm">
                            Monitor how responses resonate through emotional
                            tone and user satisfaction.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div
                      className="bg-white! @4xl:p-6 p-4"
                      data-grid-content="true"
                    >
                      <div className="flex items-start gap-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 256 256"
                          className="mt-0.5 size-5 text-gray-600"
                        >
                          <path
                            d="M224,64l-12.16,66.86A16,16,0,0,1,196.1,144H70.55L56,64Z"
                            opacity="0.2"
                          ></path>
                          <path d="M230.14,58.87A8,8,0,0,0,224,56H62.68L56.6,22.57A8,8,0,0,0,48.73,16H24a8,8,0,0,0,0,16h18L67.56,172.29a24,24,0,0,0,5.33,11.27,28,28,0,1,0,44.4,8.44h45.42A27.75,27.75,0,0,0,160,204a28,28,0,1,0,28-28H91.17a8,8,0,0,1-7.87-6.57L80.13,152h116a24,24,0,0,0,23.61-19.71l12.16-66.86A8,8,0,0,0,230.14,58.87ZM104,204a12,12,0,1,1-12-12A12,12,0,0,1,104,204Zm96,0a12,12,0,1,1-12-12A12,12,0,0,1,200,204Zm4-74.57A8,8,0,0,1,196.1,136H77.22L65.59,72H214.41Z"></path>
                        </svg>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">
                            Shopping Data
                          </h4>
                          <p className="mt-1 text-gray-600 text-sm">
                            See when ChatGPT is recommending your brand in the
                            future of shopping.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div
                      className="bg-white! @4xl:p-6 p-4"
                      data-grid-content="true"
                    >
                      <div className="flex items-start gap-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 256 256"
                          className="mt-0.5 size-5 text-gray-600"
                        >
                          <path
                            d="M224,80l-96,56L32,80l96-56Z"
                            opacity="0.2"
                          ></path>
                          <path d="M230.91,172A8,8,0,0,1,228,182.91l-96,56a8,8,0,0,1-8.06,0l-96-56A8,8,0,0,1,36,169.09l92,53.65,92-53.65A8,8,0,0,1,230.91,172ZM220,121.09l-92,53.65L36,121.09A8,8,0,0,0,28,134.91l96,56a8,8,0,0,0,8.06,0l96-56A8,8,0,1,0,220,121.09ZM24,80a8,8,0,0,1,4-6.91l96-56a8,8,0,0,1,8.06,0l96,56a8,8,0,0,1,0,13.82l-96,56a8,8,0,0,1-8.06,0l-96-56A8,8,0,0,1,24,80Zm23.88,0L128,126.74,208.12,80,128,33.26Z"></path>
                        </svg>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">
                            Entity Tracker
                          </h4>
                          <p className="mt-1 text-gray-600 text-sm">
                            Identify and track brands, products, and competitors
                            mentioned in AI responses.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div aria-hidden="true" className="p-[0.5px]">
            <div className="h-full rounded bg-background/75 max-lg:w-2"></div>
          </div>
        </div>
        <div className="@container grid grid-cols-[auto_1fr_auto] lg:grid-cols-[1fr_minmax(0,69rem)_1fr]">
          <div aria-hidden="true" className="p-[0.5px]">
            <div className="h-full rounded bg-background/75 max-lg:w-2"></div>
          </div>
          <div className="mx-auto w-full max-w-276 lg:min-w-5xl xl:min-w-276 p-[0.5px]">
            <div className="rounded bg-background/75 h-24" data-slot="content">
              <div className="h-24"></div>
            </div>
          </div>
          <div aria-hidden="true" className="p-[0.5px]">
            <div className="h-full rounded bg-background/75 max-lg:w-2"></div>
          </div>
        </div>

        <div className="@container grid grid-cols-[auto_1fr_auto] lg:grid-cols-[1fr_minmax(0,69rem)_1fr]">
          <div aria-hidden="true" className="p-[0.5px]">
            <div className="h-full rounded bg-background/75 max-lg:w-2"></div>
          </div>
          <div className="mx-auto w-full max-w-276 lg:min-w-5xl xl:min-w-276 p-[0.5px]">
            <div className="rounded bg-background/75 h-8" data-slot="content">
              <div className="h-8"></div>
            </div>
          </div>
          <div aria-hidden="true" className="p-[0.5px]">
            <div className="h-full rounded bg-background/75 max-lg:w-2"></div>
          </div>
        </div>
        <div className="@container grid grid-cols-[auto_1fr_auto] lg:grid-cols-[1fr_minmax(0,69rem)_1fr]">
          <div aria-hidden="true" className="p-[0.5px]">
            <div className="h-full rounded bg-background/75 max-lg:w-2"></div>
          </div>
          <div className="mx-auto w-full max-w-276 lg:min-w-5xl xl:min-w-276 p-[0.5px]">
            <div className="rounded bg-background/75 h-24" data-slot="content">
              <div className="h-24"></div>
            </div>
          </div>
          <div aria-hidden="true" className="p-[0.5px]">
            <div className="h-full rounded bg-background/75 max-lg:w-2"></div>
          </div>
        </div>
        <section>
          <div className="relative">
            <div className="@container grid grid-cols-[auto_1fr_auto] lg:grid-cols-[1fr_minmax(0,69rem)_1fr]">
              <div aria-hidden="true" className="p-[0.5px]">
                <div className="h-full rounded bg-background/75 max-lg:w-2"></div>
              </div>
              <div className="mx-auto w-full max-w-276 lg:min-w-5xl xl:min-w-276 p-[0.5px]">
                <div
                  className="h-full rounded bg-background/75"
                  data-slot="content"
                >
                  <div className="relative rounded-sm bg-white">
                    <div className="p-1">
                      <div className="relative overflow-hidden rounded-sm bg-[linear-gradient(to_top_in_oklab,color-mix(in_oklab,var(--color-primary)_82%,white)_0%,color-mix(in_oklab,var(--color-primary)_74%,white)_3%,color-mix(in_oklab,var(--color-primary)_66%,white)_5%,color-mix(in_oklab,var(--color-primary)_58%,white)_8%,color-mix(in_oklab,var(--color-primary)_51%,white)_10%,color-mix(in_oklab,var(--color-primary)_44%,white)_13%,color-mix(in_oklab,var(--color-primary)_37%,white)_16%,color-mix(in_oklab,var(--color-primary)_31%,white)_20%,color-mix(in_oklab,var(--color-primary)_25%,white)_23%,color-mix(in_oklab,var(--color-primary)_20%,white)_27%,color-mix(in_oklab,var(--color-primary)_16%,white)_31%,color-mix(in_oklab,var(--color-primary)_12%,white)_35%,color-mix(in_oklab,var(--color-primary)_9%,white)_39%,color-mix(in_oklab,var(--color-primary)_6.5%,white)_44%,color-mix(in_oklab,var(--color-primary)_4.5%,white)_49%,color-mix(in_oklab,var(--color-primary)_2.8%,white)_54%,color-mix(in_oklab,var(--color-primary)_1.2%,white)_59%,white_63%)] p-12">
                        <div
                          aria-hidden="true"
                          className="dither-xs pointer-events-none absolute inset-0 overflow-hidden opacity-15"
                        >
                          <div className="size-full">
                            <div className="relative h-full w-full overflow-hidden ">
                              <canvas
                                data-engine="three.js r184"
                                width="1095"
                                height="426"
                                style={{ width: "100%", height: "100%" }}
                              ></canvas>
                            </div>
                          </div>
                        </div>
                        <div className="relative inset-0 z-10 m-auto flex h-fit w-full max-w-2xl flex-col items-center justify-center space-y-4 text-center md:absolute">
                          <p className="inline-flex items-center gap-px text-xs tracking-widest text-muted-foreground">
                            <span
                              aria-hidden="true"
                              className="font-mono text-muted-foreground/50"
                            >
                              [
                            </span>
                            get started
                            <span
                              aria-hidden="true"
                              className="font-mono text-muted-foreground/50"
                            >
                              ]
                            </span>
                          </p>
                          <h2 className="text-balance font-medium text-3xl text-foreground md:text-5xl">
                            Make AI Search your next{" "}
                            <span className="text-primary underline decoration-primary/50 decoration-dashed">
                              revenue
                            </span>{" "}
                            channel
                          </h2>
                          <p className="text-balance text-lg text-muted-foreground">
                            Track and optimize visibility in ChatGPT, Gemini and
                            other AI Search engines to drive traffic to your
                            website that converts.
                          </p>
                          <div className="flex flex-row flex-wrap items-center justify-center gap-4">
                            <a
                              className="cursor-pointer justify-center whitespace-nowrap font-medium text-sm transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0 rounded-md focus-visible:ring-1 focus-visible:ring-ring active:scale-[0.99] active:transition-none h-8 px-3 py-1.5 border border-transparent bg-background shadow-black/15 shadow-sm ring-1 ring-foreground/10 duration-200 hover:bg-muted/50 mt-8 inline-flex flex-1 items-center gap-2 md:flex-initial"
                              href="/book-a-demo?cta_source=homepage"
                            >
                              Book a demo
                            </a>
                            <button className="cursor-pointer justify-center whitespace-nowrap font-medium text-sm transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0 rounded-md duration-150 focus-visible:ring-1 focus-visible:ring-ring active:scale-[0.99] active:transition-none h-8 px-3 py-1.5 border-[0.5px] border-white/25 bg-primary text-primary-foreground ring-(--ring-color) ring-1 [--ring-color:color-mix(in_oklab,var(--color-foreground)15%,var(--color-primary))] hover:bg-primary/90 mt-8 inline-flex flex-1 items-center gap-2 md:flex-initial">
                              Start Free Trial{" "}
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor"
                                viewBox="0 0 256 256"
                                className="size-4"
                              >
                                <path d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z"></path>
                              </svg>
                            </button>
                          </div>
                        </div>
                        <div className="pointer-events-none relative z-10 grid gap-1 *:aspect-square max-md:mt-12 max-md:hidden md:grid-cols-18 md:grid-rows-6">
                          <div className="relative z-20 m-auto flex size-full rounded-full border border-transparent bg-background shadow-md ring-1 ring-foreground/10 *:m-auto *:size-5 col-start-3">
                            <svg
                              height="23"
                              style={{ flex: "none", lineHeight: 1 }}
                              viewBox="0 0 24 24"
                              width="23"
                              xmlns="http://www.w3.org/2000/svg"
                              type="color"
                            >
                              <title>Gemini</title>
                              <path
                                d="M20.616 10.835a14.147 14.147 0 01-4.45-3.001 14.111 14.111 0 01-3.678-6.452.503.503 0 00-.975 0 14.134 14.134 0 01-3.679 6.452 14.155 14.155 0 01-4.45 3.001c-.65.28-1.318.505-2.002.678a.502.502 0 000 .975c.684.172 1.35.397 2.002.677a14.147 14.147 0 014.45 3.001 14.112 14.112 0 013.679 6.453.502.502 0 00.975 0c.172-.685.397-1.351.677-2.003a14.145 14.145 0 013.001-4.45 14.113 14.113 0 016.453-3.678.503.503 0 000-.975 13.245 13.245 0 01-2.003-.678z"
                                fill="#3186FF"
                              ></path>
                              <path
                                d="M20.616 10.835a14.147 14.147 0 01-4.45-3.001 14.111 14.111 0 01-3.678-6.452.503.503 0 00-.975 0 14.134 14.134 0 01-3.679 6.452 14.155 14.155 0 01-4.45 3.001c-.65.28-1.318.505-2.002.678a.502.502 0 000 .975c.684.172 1.35.397 2.002.677a14.147 14.147 0 014.45 3.001 14.112 14.112 0 013.679 6.453.502.502 0 00.975 0c.172-.685.397-1.351.677-2.003a14.145 14.145 0 013.001-4.45 14.113 14.113 0 016.453-3.678.503.503 0 000-.975 13.245 13.245 0 01-2.003-.678z"
                                fill="url(#lobe-icons-gemini-fill-0)"
                              ></path>
                              <path
                                d="M20.616 10.835a14.147 14.147 0 01-4.45-3.001 14.111 14.111 0 01-3.678-6.452.503.503 0 00-.975 0 14.134 14.134 0 01-3.679 6.452 14.155 14.155 0 01-4.45 3.001c-.65.28-1.318.505-2.002.678a.502.502 0 000 .975c.684.172 1.35.397 2.002.677a14.147 14.147 0 014.45 3.001 14.112 14.112 0 013.679 6.453.502.502 0 00.975 0c.172-.685.397-1.351.677-2.003a14.145 14.145 0 013.001-4.45 14.113 14.113 0 016.453-3.678.503.503 0 000-.975 13.245 13.245 0 01-2.003-.678z"
                                fill="url(#lobe-icons-gemini-fill-1)"
                              ></path>
                              <path
                                d="M20.616 10.835a14.147 14.147 0 01-4.45-3.001 14.111 14.111 0 01-3.678-6.452.503.503 0 00-.975 0 14.134 14.134 0 01-3.679 6.452 14.155 14.155 0 01-4.45 3.001c-.65.28-1.318.505-2.002.678a.502.502 0 000 .975c.684.172 1.35.397 2.002.677a14.147 14.147 0 014.45 3.001 14.112 14.112 0 013.679 6.453.502.502 0 00.975 0c.172-.685.397-1.351.677-2.003a14.145 14.145 0 013.001-4.45 14.113 14.113 0 016.453-3.678.503.503 0 000-.975 13.245 13.245 0 01-2.003-.678z"
                                fill="url(#lobe-icons-gemini-fill-2)"
                              ></path>
                              <defs>
                                <linearGradient
                                  gradientUnits="userSpaceOnUse"
                                  id="lobe-icons-gemini-fill-0"
                                  x1="7"
                                  x2="11"
                                  y1="15.5"
                                  y2="12"
                                >
                                  <stop stopColor="#08B962"></stop>
                                  <stop
                                    offset="1"
                                    stopColor="#08B962"
                                    stopOpacity="0"
                                  ></stop>
                                </linearGradient>
                                <linearGradient
                                  gradientUnits="userSpaceOnUse"
                                  id="lobe-icons-gemini-fill-1"
                                  x1="8"
                                  x2="11.5"
                                  y1="5.5"
                                  y2="11"
                                >
                                  <stop stopColor="#F94543"></stop>
                                  <stop
                                    offset="1"
                                    stopColor="#F94543"
                                    stopOpacity="0"
                                  ></stop>
                                </linearGradient>
                                <linearGradient
                                  gradientUnits="userSpaceOnUse"
                                  id="lobe-icons-gemini-fill-2"
                                  x1="3.5"
                                  x2="17.5"
                                  y1="13.5"
                                  y2="12"
                                >
                                  <stop stopColor="#FABC12"></stop>
                                  <stop
                                    offset=".46"
                                    stopColor="#FABC12"
                                    stopOpacity="0"
                                  ></stop>
                                </linearGradient>
                              </defs>
                            </svg>
                          </div>
                          <div className="relative z-20 m-auto flex size-full rounded-full border border-transparent bg-background shadow-md ring-1 ring-foreground/10 *:m-auto *:size-5 md:row-start-3">
                            <svg
                              height="23"
                              style={{ flex: "none", lineHeight: 1 }}
                              viewBox="0 0 24 24"
                              width="23"
                              xmlns="http://www.w3.org/2000/svg"
                              type="color"
                            >
                              <title>Perplexity</title>
                              <path
                                d="M19.785 0v7.272H22.5V17.62h-2.935V24l-7.037-6.194v6.145h-1.091v-6.152L4.392 24v-6.465H1.5V7.188h2.884V0l7.053 6.494V.19h1.09v6.49L19.786 0zm-7.257 9.044v7.319l5.946 5.234V14.44l-5.946-5.397zm-1.099-.08l-5.946 5.398v7.235l5.946-5.234V8.965zm8.136 7.58h1.844V8.349H13.46l6.105 5.54v2.655zm-8.982-8.28H2.59v8.195h1.8v-2.576l6.192-5.62zM5.475 2.476v4.71h5.115l-5.115-4.71zm13.219 0l-5.115 4.71h5.115v-4.71z"
                                fill="#22B8CD"
                                fillRule="nonzero"
                              ></path>
                            </svg>
                          </div>
                          <div className="relative z-20 m-auto flex size-full rounded-full border border-transparent bg-background shadow-md ring-1 ring-foreground/10 *:m-auto *:size-5 col-start-3 md:row-start-5">
                            <svg
                              fill="currentColor"
                              fillRule="evenodd"
                              height="23"
                              style={{ flex: "none", lineHeight: 1 }}
                              viewBox="0 0 24 24"
                              width="23"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <title>Grok</title>
                              <path d="M9.27 15.29l7.978-5.897c.391-.29.95-.177 1.137.272.98 2.369.542 5.215-1.41 7.169-1.951 1.954-4.667 2.382-7.149 1.406l-2.711 1.257c3.889 2.661 8.611 2.003 11.562-.953 2.341-2.344 3.066-5.539 2.388-8.42l.006.007c-.983-4.232.242-5.924 2.75-9.383.06-.082.12-.164.179-.248l-3.301 3.305v-.01L9.267 15.292M7.623 16.723c-2.792-2.67-2.31-6.801.071-9.184 1.761-1.763 4.647-2.483 7.166-1.425l2.705-1.25a7.808 7.808 0 00-1.829-1A8.975 8.975 0 005.984 5.83c-2.533 2.536-3.33 6.436-1.962 9.764 1.022 2.487-.653 4.246-2.34 6.022-.599.63-1.199 1.259-1.682 1.925l7.62-6.815"></path>
                            </svg>
                          </div>
                          <div className="relative z-20 m-auto flex size-full rounded-full border border-transparent bg-background shadow-md ring-1 ring-foreground/10 *:m-auto *:size-5 col-start-16">
                            <svg
                              fill="currentColor"
                              fillRule="evenodd"
                              height="23"
                              style={{ flex: "none", lineHeight: 1 }}
                              viewBox="0 0 24 24"
                              width="23"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <title>OpenAI</title>
                              <path d="M21.55 10.004a5.416 5.416 0 00-.478-4.501c-1.217-2.09-3.662-3.166-6.05-2.66A5.59 5.59 0 0010.831 1C8.39.995 6.224 2.546 5.473 4.838A5.553 5.553 0 001.76 7.496a5.487 5.487 0 00.691 6.5 5.416 5.416 0 00.477 4.502c1.217 2.09 3.662 3.165 6.05 2.66A5.586 5.586 0 0013.168 23c2.443.006 4.61-1.546 5.361-3.84a5.553 5.553 0 003.715-2.66 5.488 5.488 0 00-.693-6.497v.001zm-8.381 11.558a4.199 4.199 0 01-2.675-.954c.034-.018.093-.05.132-.074l4.44-2.53a.71.71 0 00.364-.623v-6.176l1.877 1.069c.02.01.033.029.036.05v5.115c-.003 2.274-1.87 4.118-4.174 4.123zM4.192 17.78a4.059 4.059 0 01-.498-2.763c.032.02.09.055.131.078l4.44 2.53c.225.13.504.13.73 0l5.42-3.088v2.138a.068.068 0 01-.027.057L9.9 19.288c-1.999 1.136-4.552.46-5.707-1.51h-.001zM3.023 8.216A4.15 4.15 0 015.198 6.41l-.002.151v5.06a.711.711 0 00.364.624l5.42 3.087-1.876 1.07a.067.067 0 01-.063.005l-4.489-2.559c-1.995-1.14-2.679-3.658-1.53-5.63h.001zm15.417 3.54l-5.42-3.088L14.896 7.6a.067.067 0 01.063-.006l4.489 2.557c1.998 1.14 2.683 3.662 1.529 5.633a4.163 4.163 0 01-2.174 1.807V12.38a.71.71 0 00-.363-.623zm1.867-2.773a6.04 6.04 0 00-.132-.078l-4.44-2.53a.731.731 0 00-.729 0l-5.42 3.088V7.325a.068.068 0 01.027-.057L14.1 4.713c2-1.137 4.555-.46 5.707 1.513.487.833.664 1.809.499 2.757h.001zm-11.741 3.81l-1.877-1.068a.065.065 0 01-.036-.051V6.559c.001-2.277 1.873-4.122 4.181-4.12.976 0 1.92.338 2.671.954-.034.018-.092.05-.131.073l-4.44 2.53a.71.71 0 00-.365.623l-.003 6.173v.002zm1.02-2.168L12 9.25l2.414 1.375v2.75L12 14.75l-2.415-1.375v-2.75z"></path>
                            </svg>
                          </div>
                          <div className="relative z-20 m-auto flex size-full rounded-full border border-transparent bg-background shadow-md ring-1 ring-foreground/10 *:m-auto *:size-5 col-start-18 md:row-start-3">
                            <svg
                              height="23"
                              style={{ flex: "none", lineHeight: 1 }}
                              viewBox="0 0 24 24"
                              width="23"
                              xmlns="http://www.w3.org/2000/svg"
                              type="color"
                            >
                              <title>DeepSeek</title>
                              <path
                                d="M23.748 4.482c-.254-.124-.364.113-.512.234-.051.039-.094.09-.137.136-.372.397-.806.657-1.373.626-.829-.046-1.537.214-2.163.848-.133-.782-.575-1.248-1.247-1.548-.352-.156-.708-.311-.955-.65-.172-.241-.219-.51-.305-.774-.055-.16-.11-.323-.293-.35-.2-.031-.278.136-.356.276-.313.572-.434 1.202-.422 1.84.027 1.436.633 2.58 1.838 3.393.137.093.172.187.129.323-.082.28-.18.552-.266.833-.055.179-.137.217-.329.14a5.526 5.526 0 01-1.736-1.18c-.857-.828-1.631-1.742-2.597-2.458a11.365 11.365 0 00-.689-.471c-.985-.957.13-1.743.388-1.836.27-.098.093-.432-.779-.428-.872.004-1.67.295-2.687.684a3.055 3.055 0 01-.465.137 9.597 9.597 0 00-2.883-.102c-1.885.21-3.39 1.102-4.497 2.623C.082 8.606-.231 10.684.152 12.85c.403 2.284 1.569 4.175 3.36 5.653 1.858 1.533 3.997 2.284 6.438 2.14 1.482-.085 3.133-.284 4.994-1.86.47.234.962.327 1.78.397.63.059 1.236-.03 1.705-.128.735-.156.684-.837.419-.961-2.155-1.004-1.682-.595-2.113-.926 1.096-1.296 2.746-2.642 3.392-7.003.05-.347.007-.565 0-.845-.004-.17.035-.237.23-.256a4.173 4.173 0 001.545-.475c1.396-.763 1.96-2.015 2.093-3.517.02-.23-.004-.467-.247-.588zM11.581 18c-2.089-1.642-3.102-2.183-3.52-2.16-.392.024-.321.471-.235.763.09.288.207.486.371.739.114.167.192.416-.113.603-.673.416-1.842-.14-1.897-.167-1.361-.802-2.5-1.86-3.301-3.307-.774-1.393-1.224-2.887-1.298-4.482-.02-.386.093-.522.477-.592a4.696 4.696 0 011.529-.039c2.132.312 3.946 1.265 5.468 2.774.868.86 1.525 1.887 2.202 2.891.72 1.066 1.494 2.082 2.48 2.914.348.292.625.514.891.677-.802.09-2.14.11-3.054-.614zm1-6.44a.306.306 0 01.415-.287.302.302 0 01.2.288.306.306 0 01-.31.307.303.303 0 01-.304-.308zm3.11 1.596c-.2.081-.399.151-.59.16a1.245 1.245 0 01-.798-.254c-.274-.23-.47-.358-.552-.758a1.73 1.73 0 01.016-.588c.07-.327-.008-.537-.239-.727-.187-.156-.426-.199-.688-.199a.559.559 0 01-.254-.078c-.11-.054-.2-.19-.114-.358.028-.054.16-.186.192-.21.356-.202.767-.136 1.146.016.352.144.618.408 1.001.782.391.451.462.576.685.914.176.265.336.537.445.848.067.195-.019.354-.25.452z"
                                fill="#4D6BFE"
                              ></path>
                            </svg>
                          </div>
                          <div className="relative z-20 m-auto flex size-full rounded-full border border-transparent bg-background shadow-md ring-1 ring-foreground/10 *:m-auto *:size-5 col-start-16 md:row-start-5">
                            <svg
                              height="23"
                              style={{ flex: "none", lineHeight: 1 }}
                              viewBox="0 0 24 24"
                              width="23"
                              xmlns="http://www.w3.org/2000/svg"
                              type="color"
                            >
                              <title>Claude</title>
                              <path
                                d="M4.709 15.955l4.72-2.647.08-.23-.08-.128H9.2l-.79-.048-2.698-.073-2.339-.097-2.266-.122-.571-.121L0 11.784l.055-.352.48-.321.686.06 1.52.103 2.278.158 1.652.097 2.449.255h.389l.055-.157-.134-.098-.103-.097-2.358-1.596-2.552-1.688-1.336-.972-.724-.491-.364-.462-.158-1.008.656-.722.881.06.225.061.893.686 1.908 1.476 2.491 1.833.365.304.145-.103.019-.073-.164-.274-1.355-2.446-1.446-2.49-.644-1.032-.17-.619a2.97 2.97 0 01-.104-.729L6.283.134 6.696 0l.996.134.42.364.62 1.414 1.002 2.229 1.555 3.03.456.898.243.832.091.255h.158V9.01l.128-1.706.237-2.095.23-2.695.08-.76.376-.91.747-.492.584.28.48.685-.067.444-.286 1.851-.559 2.903-.364 1.942h.212l.243-.242.985-1.306 1.652-2.064.73-.82.85-.904.547-.431h1.033l.76 1.129-.34 1.166-1.064 1.347-.881 1.142-1.264 1.7-.79 1.36.073.11.188-.02 2.856-.606 1.543-.28 1.841-.315.833.388.091.395-.328.807-1.969.486-2.309.462-3.439.813-.042.03.049.061 1.549.146.662.036h1.622l3.02.225.79.522.474.638-.079.485-1.215.62-1.64-.389-3.829-.91-1.312-.329h-.182v.11l1.093 1.068 2.006 1.81 2.509 2.33.127.578-.322.455-.34-.049-2.205-1.657-.851-.747-1.926-1.62h-.128v.17l.444.649 2.345 3.521.122 1.08-.17.353-.608.213-.668-.122-1.374-1.925-1.415-2.167-1.143-1.943-.14.08-.674 7.254-.316.37-.729.28-.607-.461-.322-.747.322-1.476.389-1.924.315-1.53.286-1.9.17-.632-.012-.042-.14.018-1.434 1.967-2.18 2.945-1.726 1.845-.414.164-.717-.37.067-.662.401-.589 2.388-3.036 1.44-1.882.93-1.086-.006-.158h-.055L4.132 18.56l-1.13.146-.487-.456.061-.746.231-.243 1.908-1.312-.006.006z"
                                fill="#D97757"
                                fillRule="nonzero"
                              ></path>
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div aria-hidden="true" className="p-[0.5px]">
                <div className="h-full rounded bg-background/75 max-lg:w-2"></div>
              </div>
            </div>
          </div>
        </section>
        <div className="@container grid grid-cols-[auto_1fr_auto] lg:grid-cols-[1fr_minmax(0,69rem)_1fr]">
          <div aria-hidden="true" className="p-[0.5px]">
            <div className="h-full rounded bg-background/75 max-lg:w-2"></div>
          </div>
          <div className="mx-auto w-full max-w-276 lg:min-w-5xl xl:min-w-276 p-[0.5px]">
            <div className="rounded bg-background/75 h-8" data-slot="content">
              <div className="h-8"></div>
            </div>
          </div>
          <div aria-hidden="true" className="p-[0.5px]">
            <div className="h-full rounded bg-background/75 max-lg:w-2"></div>
          </div>
        </div>
        <section id="faqs">
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html:
                '{"@context":"https://schema.org","@type":"FAQPage","name":"Promptwatch FAQ - AI Search Visibility","mainEntity":[{"@type":"Question","name":"What is Promptwatch?","acceptedAnswer":{"@type":"Answer","text":"Promptwatch helps marketers track & improve their brand visibility in AI responses to drive more high-intent traffic to their website."}},{"@type":"Question","name":"How do I get started with Promptwatch?","acceptedAnswer":{"@type":"Answer","text":"Getting started with Promptwatch is as simple as entering your brand\u2019s URL and selecting 5 prompts related to your category. Promptwatch will then start collecting your brand and your competitor\u2019s brand mentions in the AI responses."}},{"@type":"Question","name":"How does Promptwatch collect data?","acceptedAnswer":{"@type":"Answer","text":"Promptwatch collects data by scraping the UI interfaces of the LLMs used every day by hundreds of millions of people. This includes ChatGPT, Gemini, AI Overviews, Perplexity and others."}},{"@type":"Question","name":"Which LLMs does Promptwatch monitor?","acceptedAnswer":{"@type":"Answer","text":"Promptwatch monitors all AI models, ChatGPT, Gemini, AI Overviews, Claude, Grok, etc."}},{"@type":"Question","name":"Can Promptwatch track across ChatGPT, Claude, and Gemini all at once?","acceptedAnswer":{"@type":"Answer","text":"Yes. Promptwatch tracks your brand across ChatGPT, Claude, Gemini, AI Overviews, Perplexity and more from a single unified dashboard. Every prompt you monitor runs across all supported models at once, so you can compare your brand\u2019s visibility, citations, and sentiment model-by-model in one place \u2014 no need to check each AI engine separately."}},{"@type":"Question","name":"How does Promptwatch help brands get revenue from AI Search?","acceptedAnswer":{"@type":"Answer","text":"Promptwatch helps brands generate revenue from AI search by revealing what content AI prefers, tracking when AI agents access your site, and producing optimized content that boosts AI recommendations and drives high-intent traffic."}},{"@type":"Question","name":"Is Promptwatch suitable for agencies?","acceptedAnswer":{"@type":"Answer","text":"Yes, Promptwatch is the best solution for agencies managing AI Search for multiple brands. Easily onboard and manage any client and start optimizing for AI Search."}},{"@type":"Question","name":"Can I track my competitors with Promptwatch?","acceptedAnswer":{"@type":"Answer","text":"Yes, you can specify any competitor and Promptwatch will show your brand\u2019s visibility compared to theirs."}},{"@type":"Question","name":"How does Promptwatch write content for me?","acceptedAnswer":{"@type":"Answer","text":"Promptwatch analyzes which sources AI cites in responses and uses that data to create articles optimized to be referenced more often in AI responses."}}]}',
            }}
          />
          <div className="@container grid grid-cols-[auto_1fr_auto] lg:grid-cols-[1fr_minmax(0,69rem)_1fr]">
            <div aria-hidden="true" className="p-[0.5px]">
              <div className="h-full rounded bg-background/75 max-lg:w-2"></div>
            </div>
            <div className="mx-auto w-full max-w-276 lg:min-w-5xl xl:min-w-276 p-[0.5px]">
              <div
                className="h-full rounded bg-background/75"
                data-slot="content"
              >
                <div className="h-16"></div>
              </div>
            </div>
            <div aria-hidden="true" className="p-[0.5px]">
              <div className="h-full rounded bg-background/75 max-lg:w-2"></div>
            </div>
          </div>
          <div className="@container grid grid-cols-[auto_1fr_auto] lg:grid-cols-[1fr_minmax(0,69rem)_1fr]">
            <div aria-hidden="true" className="p-[0.5px]">
              <div className="h-full rounded bg-background/75 max-lg:w-2"></div>
            </div>
            <div className="mx-auto w-full max-w-276 lg:min-w-5xl xl:min-w-276">
              <div className="grid *:p-[0.5px] **:data-grid-content:h-full **:data-grid-content:rounded **:data-grid-content:bg-background/75 md:**:data-[slot=content]:py-0">
                <div className="grid gap-px md:grid-cols-5">
                  <div
                    className="py-6 max-md:px-6 md:col-span-2 md:p-10 lg:p-12"
                    data-grid-content="true"
                  >
                    <h2 className="font-medium text-3xl text-foreground">
                      Frequently Asked Questions
                    </h2>
                    <p className="mt-4 text-balance text-md text-muted-foreground">
                      Learn about AI visibility monitoring and how Promptwatch
                      helps your brand succeed in AI search.
                    </p>
                    <p className="mt-6 text-muted-foreground max-md:hidden">
                      Want a demo of Promptwatch?{" "}
                      <a
                        className="font-medium text-primary hover:underline"
                        href="/book-a-demo?cta_source=www_faq"
                      >
                        Book a demo
                      </a>
                    </p>
                  </div>
                  <div
                    className="space-y-4 pt-6 md:col-span-3 md:px-4 md:pt-10 md:pb-4 lg:pt-12"
                    data-grid-content="true"
                  >
                    <div
                      data-slot="accordion"
                      className="-space-y-1"
                      data-orientation="vertical"
                    >
                      <div
                        data-state="closed"
                        data-orientation="vertical"
                        className="border-b last:border-b-0 group peer rounded-lg border-none px-6 py-1 data-[state=open]:border-none data-[state=open]:bg-card data-[state=open]:shadow data-[state=open]:ring-1 data-[state=open]:ring-foreground/5"
                        data-slot="accordion-item"
                      >
                        <h3
                          data-orientation="vertical"
                          data-state="closed"
                          className="flex"
                        >
                          <button
                            type="button"
                            aria-expanded="false"
                            data-state="closed"
                            data-orientation="vertical"
                            id="radix-_R_6cvl8m_"
                            className="flex flex-1 items-start justify-between gap-4 py-4 text-left font-medium outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&[data-state=open]&gt;svg]:rotate-180 cursor-pointer rounded-none not-group-last:border-b text-base transition-none hover:no-underline data-[state=open]:border-transparent hover:[&&gt;svg]:translate-y-1 hover:data-[state=open]:[&&gt;svg]:translate-y-0"
                            data-slot="accordion-trigger"
                            data-radix-collection-item=""
                          >
                            What is Promptwatch?
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="currentColor"
                              viewBox="0 0 256 256"
                              className="pointer-events-none size-4 shrink-0 translate-y-0.5 text-muted-foreground transition-transform duration-200"
                            >
                              <path d="M216.49,104.49l-80,80a12,12,0,0,1-17,0l-80-80a12,12,0,0,1,17-17L128,159l71.51-71.52a12,12,0,0,1,17,17Z"></path>
                            </svg>
                          </button>
                        </h3>
                        <div
                          data-state="closed"
                          id="radix-_R_26cvl8m_"
                          role="region"
                          aria-labelledby="radix-_R_6cvl8m_"
                          data-orientation="vertical"
                          className="overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
                          data-slot="accordion-content"
                          style={{
                            "--radix-accordion-content-height":
                              "var(--radix-collapsible-content-height)",
                            "--radix-accordion-content-width":
                              "var(--radix-collapsible-content-width)",
                            "--radix-collapsible-content-width": "581.40625px",
                            "--radix-collapsible-content-height": "56px",
                          }}
                        >
                          <div className="pt-0 pb-4 group-data-[state=closed]:hidden">
                            <p className="text-muted-foreground text-sm">
                              Promptwatch helps marketers track & improve their
                              brand visibility in AI responses to drive more
                              high-intent traffic to their website.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div
                        data-state="closed"
                        data-orientation="vertical"
                        className="border-b last:border-b-0 group peer rounded-lg border-none px-6 py-1 data-[state=open]:border-none data-[state=open]:bg-card data-[state=open]:shadow data-[state=open]:ring-1 data-[state=open]:ring-foreground/5"
                        data-slot="accordion-item"
                      >
                        <h3
                          data-orientation="vertical"
                          data-state="closed"
                          className="flex"
                        >
                          <button
                            type="button"
                            aria-expanded="false"
                            data-state="closed"
                            data-orientation="vertical"
                            id="radix-_R_acvl8m_"
                            className="flex flex-1 items-start justify-between gap-4 py-4 text-left font-medium outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&[data-state=open]&gt;svg]:rotate-180 cursor-pointer rounded-none not-group-last:border-b text-base transition-none hover:no-underline data-[state=open]:border-transparent hover:[&&gt;svg]:translate-y-1 hover:data-[state=open]:[&&gt;svg]:translate-y-0"
                            data-slot="accordion-trigger"
                            data-radix-collection-item=""
                          >
                            How do I get started with Promptwatch?
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="currentColor"
                              viewBox="0 0 256 256"
                              className="pointer-events-none size-4 shrink-0 translate-y-0.5 text-muted-foreground transition-transform duration-200"
                            >
                              <path d="M216.49,104.49l-80,80a12,12,0,0,1-17,0l-80-80a12,12,0,0,1,17-17L128,159l71.51-71.52a12,12,0,0,1,17,17Z"></path>
                            </svg>
                          </button>
                        </h3>
                        <div
                          data-state="closed"
                          id="radix-_R_2acvl8m_"
                          role="region"
                          aria-labelledby="radix-_R_acvl8m_"
                          data-orientation="vertical"
                          className="overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
                          data-slot="accordion-content"
                          style={{
                            "--radix-accordion-content-height":
                              "var(--radix-collapsible-content-height)",
                            "--radix-accordion-content-width":
                              "var(--radix-collapsible-content-width)",
                            "--radix-collapsible-content-width": "581.40625px",
                            "--radix-collapsible-content-height": "76px",
                          }}
                        >
                          <div className="pt-0 pb-4 group-data-[state=closed]:hidden">
                            <p className="text-muted-foreground text-sm">
                              Getting started with Promptwatch is as simple as
                              entering your brand’s URL and selecting 5 prompts
                              related to your category. Promptwatch will then
                              start collecting your brand and your competitor’s
                              brand mentions in the AI responses.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div
                        data-state="closed"
                        data-orientation="vertical"
                        className="border-b last:border-b-0 group peer rounded-lg border-none px-6 py-1 data-[state=open]:border-none data-[state=open]:bg-card data-[state=open]:shadow data-[state=open]:ring-1 data-[state=open]:ring-foreground/5"
                        data-slot="accordion-item"
                      >
                        <h3
                          data-orientation="vertical"
                          data-state="closed"
                          className="flex"
                        >
                          <button
                            type="button"
                            aria-expanded="false"
                            data-state="closed"
                            data-orientation="vertical"
                            id="radix-_R_ecvl8m_"
                            className="flex flex-1 items-start justify-between gap-4 py-4 text-left font-medium outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&[data-state=open]&gt;svg]:rotate-180 cursor-pointer rounded-none not-group-last:border-b text-base transition-none hover:no-underline data-[state=open]:border-transparent hover:[&&gt;svg]:translate-y-1 hover:data-[state=open]:[&&gt;svg]:translate-y-0"
                            data-slot="accordion-trigger"
                            data-radix-collection-item=""
                          >
                            How does Promptwatch collect data?
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="currentColor"
                              viewBox="0 0 256 256"
                              className="pointer-events-none size-4 shrink-0 translate-y-0.5 text-muted-foreground transition-transform duration-200"
                            >
                              <path d="M216.49,104.49l-80,80a12,12,0,0,1-17,0l-80-80a12,12,0,0,1,17-17L128,159l71.51-71.52a12,12,0,0,1,17,17Z"></path>
                            </svg>
                          </button>
                        </h3>
                        <div
                          data-state="closed"
                          id="radix-_R_2ecvl8m_"
                          role="region"
                          aria-labelledby="radix-_R_ecvl8m_"
                          data-orientation="vertical"
                          className="overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
                          data-slot="accordion-content"
                          style={{
                            "--radix-accordion-content-height":
                              "var(--radix-collapsible-content-height)",
                            "--radix-accordion-content-width":
                              "var(--radix-collapsible-content-width)",
                            "--radix-collapsible-content-width": "581.40625px",
                            "--radix-collapsible-content-height": "76px",
                          }}
                        >
                          <div className="pt-0 pb-4 group-data-[state=closed]:hidden">
                            <p className="text-muted-foreground text-sm">
                              Promptwatch collects data by scraping the UI
                              interfaces of the LLMs used every day by hundreds
                              of millions of people. This includes ChatGPT,
                              Gemini, AI Overviews, Perplexity and others.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div
                        data-state="closed"
                        data-orientation="vertical"
                        className="border-b last:border-b-0 group peer rounded-lg border-none px-6 py-1 data-[state=open]:border-none data-[state=open]:bg-card data-[state=open]:shadow data-[state=open]:ring-1 data-[state=open]:ring-foreground/5"
                        data-slot="accordion-item"
                      >
                        <h3
                          data-orientation="vertical"
                          data-state="closed"
                          className="flex"
                        >
                          <button
                            type="button"
                            aria-expanded="false"
                            data-state="closed"
                            data-orientation="vertical"
                            id="radix-_R_icvl8m_"
                            className="flex flex-1 items-start justify-between gap-4 py-4 text-left font-medium outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&[data-state=open]&gt;svg]:rotate-180 cursor-pointer rounded-none not-group-last:border-b text-base transition-none hover:no-underline data-[state=open]:border-transparent hover:[&&gt;svg]:translate-y-1 hover:data-[state=open]:[&&gt;svg]:translate-y-0"
                            data-slot="accordion-trigger"
                            data-radix-collection-item=""
                          >
                            Which LLMs does Promptwatch monitor?
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="currentColor"
                              viewBox="0 0 256 256"
                              className="pointer-events-none size-4 shrink-0 translate-y-0.5 text-muted-foreground transition-transform duration-200"
                            >
                              <path d="M216.49,104.49l-80,80a12,12,0,0,1-17,0l-80-80a12,12,0,0,1,17-17L128,159l71.51-71.52a12,12,0,0,1,17,17Z"></path>
                            </svg>
                          </button>
                        </h3>
                        <div
                          data-state="closed"
                          id="radix-_R_2icvl8m_"
                          role="region"
                          aria-labelledby="radix-_R_icvl8m_"
                          data-orientation="vertical"
                          className="overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
                          data-slot="accordion-content"
                          style={{
                            "--radix-accordion-content-height":
                              "var(--radix-collapsible-content-height)",
                            "--radix-accordion-content-width":
                              "var(--radix-collapsible-content-width)",
                            "--radix-collapsible-content-width": "581.40625px",
                            "--radix-collapsible-content-height": "36px",
                          }}
                        >
                          <div className="pt-0 pb-4 group-data-[state=closed]:hidden">
                            <p className="text-muted-foreground text-sm">
                              Promptwatch monitors all AI models, ChatGPT,
                              Gemini, AI Overviews, Claude, Grok, etc.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div
                        data-state="closed"
                        data-orientation="vertical"
                        className="border-b last:border-b-0 group peer rounded-lg border-none px-6 py-1 data-[state=open]:border-none data-[state=open]:bg-card data-[state=open]:shadow data-[state=open]:ring-1 data-[state=open]:ring-foreground/5"
                        data-slot="accordion-item"
                      >
                        <h3
                          data-orientation="vertical"
                          data-state="closed"
                          className="flex"
                        >
                          <button
                            type="button"
                            aria-expanded="false"
                            data-state="closed"
                            data-orientation="vertical"
                            id="radix-_R_mcvl8m_"
                            className="flex flex-1 items-start justify-between gap-4 py-4 text-left font-medium outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&[data-state=open]&gt;svg]:rotate-180 cursor-pointer rounded-none not-group-last:border-b text-base transition-none hover:no-underline data-[state=open]:border-transparent hover:[&&gt;svg]:translate-y-1 hover:data-[state=open]:[&&gt;svg]:translate-y-0"
                            data-slot="accordion-trigger"
                            data-radix-collection-item=""
                          >
                            Can Promptwatch track across ChatGPT, Claude, and
                            Gemini all at once?
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="currentColor"
                              viewBox="0 0 256 256"
                              className="pointer-events-none size-4 shrink-0 translate-y-0.5 text-muted-foreground transition-transform duration-200"
                            >
                              <path d="M216.49,104.49l-80,80a12,12,0,0,1-17,0l-80-80a12,12,0,0,1,17-17L128,159l71.51-71.52a12,12,0,0,1,17,17Z"></path>
                            </svg>
                          </button>
                        </h3>
                        <div
                          data-state="closed"
                          id="radix-_R_2mcvl8m_"
                          role="region"
                          aria-labelledby="radix-_R_mcvl8m_"
                          data-orientation="vertical"
                          className="overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
                          data-slot="accordion-content"
                          style={{
                            "--radix-accordion-content-height":
                              "var(--radix-collapsible-content-height)",
                            "--radix-accordion-content-width":
                              "var(--radix-collapsible-content-width)",
                            "--radix-collapsible-content-width": "581.40625px",
                            "--radix-collapsible-content-height": "96px",
                          }}
                        >
                          <div className="pt-0 pb-4 group-data-[state=closed]:hidden">
                            <p className="text-muted-foreground text-sm">
                              Yes. Promptwatch tracks your brand across ChatGPT,
                              Claude, Gemini, AI Overviews, Perplexity and more
                              from a single unified dashboard. Every prompt you
                              monitor runs across all supported models at once,
                              so you can compare your brand’s visibility,
                              citations, and sentiment model-by-model in one
                              place — no need to check each AI engine
                              separately.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div
                        data-state="closed"
                        data-orientation="vertical"
                        className="border-b last:border-b-0 group peer rounded-lg border-none px-6 py-1 data-[state=open]:border-none data-[state=open]:bg-card data-[state=open]:shadow data-[state=open]:ring-1 data-[state=open]:ring-foreground/5"
                        data-slot="accordion-item"
                      >
                        <h3
                          data-orientation="vertical"
                          data-state="closed"
                          className="flex"
                        >
                          <button
                            type="button"
                            aria-expanded="false"
                            data-state="closed"
                            data-orientation="vertical"
                            id="radix-_R_qcvl8m_"
                            className="flex flex-1 items-start justify-between gap-4 py-4 text-left font-medium outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&[data-state=open]&gt;svg]:rotate-180 cursor-pointer rounded-none not-group-last:border-b text-base transition-none hover:no-underline data-[state=open]:border-transparent hover:[&&gt;svg]:translate-y-1 hover:data-[state=open]:[&&gt;svg]:translate-y-0"
                            data-slot="accordion-trigger"
                            data-radix-collection-item=""
                          >
                            How does Promptwatch help brands get revenue from AI
                            Search?
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="currentColor"
                              viewBox="0 0 256 256"
                              className="pointer-events-none size-4 shrink-0 translate-y-0.5 text-muted-foreground transition-transform duration-200"
                            >
                              <path d="M216.49,104.49l-80,80a12,12,0,0,1-17,0l-80-80a12,12,0,0,1,17-17L128,159l71.51-71.52a12,12,0,0,1,17,17Z"></path>
                            </svg>
                          </button>
                        </h3>
                        <div
                          data-state="closed"
                          id="radix-_R_2qcvl8m_"
                          role="region"
                          aria-labelledby="radix-_R_qcvl8m_"
                          data-orientation="vertical"
                          className="overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
                          data-slot="accordion-content"
                          style={{
                            "--radix-accordion-content-height":
                              "var(--radix-collapsible-content-height)",
                            "--radix-accordion-content-width":
                              "var(--radix-collapsible-content-width)",
                            "--radix-collapsible-content-width": "581.40625px",
                            "--radix-collapsible-content-height": "76px",
                          }}
                        >
                          <div className="pt-0 pb-4 group-data-[state=closed]:hidden">
                            <p className="text-muted-foreground text-sm">
                              Promptwatch helps brands generate revenue from AI
                              search by revealing what content AI prefers,
                              tracking when AI agents access your site, and
                              producing optimized content that boosts AI
                              recommendations and drives high-intent traffic.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div
                        data-state="closed"
                        data-orientation="vertical"
                        className="border-b last:border-b-0 group peer rounded-lg border-none px-6 py-1 data-[state=open]:border-none data-[state=open]:bg-card data-[state=open]:shadow data-[state=open]:ring-1 data-[state=open]:ring-foreground/5"
                        data-slot="accordion-item"
                      >
                        <h3
                          data-orientation="vertical"
                          data-state="closed"
                          className="flex"
                        >
                          <button
                            type="button"
                            aria-expanded="false"
                            data-state="closed"
                            data-orientation="vertical"
                            id="radix-_R_ucvl8m_"
                            className="flex flex-1 items-start justify-between gap-4 py-4 text-left font-medium outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&[data-state=open]&gt;svg]:rotate-180 cursor-pointer rounded-none not-group-last:border-b text-base transition-none hover:no-underline data-[state=open]:border-transparent hover:[&&gt;svg]:translate-y-1 hover:data-[state=open]:[&&gt;svg]:translate-y-0"
                            data-slot="accordion-trigger"
                            data-radix-collection-item=""
                          >
                            Is Promptwatch suitable for agencies?
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="currentColor"
                              viewBox="0 0 256 256"
                              className="pointer-events-none size-4 shrink-0 translate-y-0.5 text-muted-foreground transition-transform duration-200"
                            >
                              <path d="M216.49,104.49l-80,80a12,12,0,0,1-17,0l-80-80a12,12,0,0,1,17-17L128,159l71.51-71.52a12,12,0,0,1,17,17Z"></path>
                            </svg>
                          </button>
                        </h3>
                        <div
                          data-state="closed"
                          id="radix-_R_2ucvl8m_"
                          role="region"
                          aria-labelledby="radix-_R_ucvl8m_"
                          data-orientation="vertical"
                          className="overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
                          data-slot="accordion-content"
                          style={{
                            "--radix-accordion-content-height":
                              "var(--radix-collapsible-content-height)",
                            "--radix-accordion-content-width":
                              "var(--radix-collapsible-content-width)",
                            "--radix-collapsible-content-width": "581.40625px",
                            "--radix-collapsible-content-height": "56px",
                          }}
                        >
                          <div className="pt-0 pb-4 group-data-[state=closed]:hidden">
                            <p className="text-muted-foreground text-sm">
                              Yes, Promptwatch is the best solution for agencies
                              managing AI Search for multiple brands. Easily
                              onboard and manage any client and start optimizing
                              for AI Search.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div
                        data-state="closed"
                        data-orientation="vertical"
                        className="border-b last:border-b-0 group peer rounded-lg border-none px-6 py-1 data-[state=open]:border-none data-[state=open]:bg-card data-[state=open]:shadow data-[state=open]:ring-1 data-[state=open]:ring-foreground/5"
                        data-slot="accordion-item"
                      >
                        <h3
                          data-orientation="vertical"
                          data-state="closed"
                          className="flex"
                        >
                          <button
                            type="button"
                            aria-expanded="false"
                            data-state="closed"
                            data-orientation="vertical"
                            id="radix-_R_12cvl8m_"
                            className="flex flex-1 items-start justify-between gap-4 py-4 text-left font-medium outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&[data-state=open]&gt;svg]:rotate-180 cursor-pointer rounded-none not-group-last:border-b text-base transition-none hover:no-underline data-[state=open]:border-transparent hover:[&&gt;svg]:translate-y-1 hover:data-[state=open]:[&&gt;svg]:translate-y-0"
                            data-slot="accordion-trigger"
                            data-radix-collection-item=""
                          >
                            Can I track my competitors with Promptwatch?
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="currentColor"
                              viewBox="0 0 256 256"
                              className="pointer-events-none size-4 shrink-0 translate-y-0.5 text-muted-foreground transition-transform duration-200"
                            >
                              <path d="M216.49,104.49l-80,80a12,12,0,0,1-17,0l-80-80a12,12,0,0,1,17-17L128,159l71.51-71.52a12,12,0,0,1,17,17Z"></path>
                            </svg>
                          </button>
                        </h3>
                        <div
                          data-state="closed"
                          id="radix-_R_32cvl8m_"
                          role="region"
                          aria-labelledby="radix-_R_12cvl8m_"
                          data-orientation="vertical"
                          className="overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
                          data-slot="accordion-content"
                          style={{
                            "--radix-accordion-content-height":
                              "var(--radix-collapsible-content-height)",
                            "--radix-accordion-content-width":
                              "var(--radix-collapsible-content-width)",
                            "--radix-collapsible-content-width": "581.40625px",
                            "--radix-collapsible-content-height": "56px",
                          }}
                        >
                          <div className="pt-0 pb-4 group-data-[state=closed]:hidden">
                            <p className="text-muted-foreground text-sm">
                              Yes, you can specify any competitor and
                              Promptwatch will show your brand’s visibility
                              compared to theirs.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div
                        data-state="closed"
                        data-orientation="vertical"
                        className="border-b last:border-b-0 group peer rounded-lg border-none px-6 py-1 data-[state=open]:border-none data-[state=open]:bg-card data-[state=open]:shadow data-[state=open]:ring-1 data-[state=open]:ring-foreground/5"
                        data-slot="accordion-item"
                      >
                        <h3
                          data-orientation="vertical"
                          data-state="closed"
                          className="flex"
                        >
                          <button
                            type="button"
                            aria-expanded="false"
                            data-state="closed"
                            data-orientation="vertical"
                            id="radix-_R_16cvl8m_"
                            className="flex flex-1 items-start justify-between gap-4 py-4 text-left font-medium outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&[data-state=open]&gt;svg]:rotate-180 cursor-pointer rounded-none not-group-last:border-b text-base transition-none hover:no-underline data-[state=open]:border-transparent hover:[&&gt;svg]:translate-y-1 hover:data-[state=open]:[&&gt;svg]:translate-y-0"
                            data-slot="accordion-trigger"
                            data-radix-collection-item=""
                          >
                            How does Promptwatch write content for me?
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="currentColor"
                              viewBox="0 0 256 256"
                              className="pointer-events-none size-4 shrink-0 translate-y-0.5 text-muted-foreground transition-transform duration-200"
                            >
                              <path d="M216.49,104.49l-80,80a12,12,0,0,1-17,0l-80-80a12,12,0,0,1,17-17L128,159l71.51-71.52a12,12,0,0,1,17,17Z"></path>
                            </svg>
                          </button>
                        </h3>
                        <div
                          data-state="closed"
                          id="radix-_R_36cvl8m_"
                          role="region"
                          aria-labelledby="radix-_R_16cvl8m_"
                          data-orientation="vertical"
                          className="overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
                          data-slot="accordion-content"
                          style={{
                            "--radix-accordion-content-height":
                              "var(--radix-collapsible-content-height)",
                            "--radix-accordion-content-width":
                              "var(--radix-collapsible-content-width)",
                            "--radix-collapsible-content-width": "581.40625px",
                            "--radix-collapsible-content-height": "56px",
                          }}
                        >
                          <div className="pt-0 pb-4 group-data-[state=closed]:hidden">
                            <p className="text-muted-foreground text-sm">
                              Promptwatch analyzes which sources AI cites in
                              responses and uses that data to create articles
                              optimized to be referenced more often in AI
                              responses.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="md:hidden" data-grid-content="true">
                  <p className="p-6 text-muted-foreground">
                    Want a demo of Promptwatch?{" "}
                    <a
                      className="font-medium text-primary hover:underline"
                      href="/book-a-demo?cta_source=www_faq"
                    >
                      Book a demo
                    </a>
                  </p>
                </div>
              </div>
            </div>
            <div aria-hidden="true" className="p-[0.5px]">
              <div className="h-full rounded bg-background/75 max-lg:w-2"></div>
            </div>
          </div>
          <div className="@container grid grid-cols-[auto_1fr_auto] lg:grid-cols-[1fr_minmax(0,69rem)_1fr]">
            <div aria-hidden="true" className="p-[0.5px]">
              <div className="h-full rounded bg-background/75 max-lg:w-2"></div>
            </div>
            <div className="mx-auto w-full max-w-276 lg:min-w-5xl xl:min-w-276 p-[0.5px]">
              <div
                className="h-full rounded bg-background/75"
                data-slot="content"
              >
                <div className="h-16"></div>
              </div>
            </div>
            <div aria-hidden="true" className="p-[0.5px]">
              <div className="h-full rounded bg-background/75 max-lg:w-2"></div>
            </div>
          </div>
        </section>
        <section>
          <div className="@container grid grid-cols-[auto_1fr_auto] lg:grid-cols-[1fr_minmax(0,69rem)_1fr]">
            <div aria-hidden="true" className="p-[0.5px]">
              <div className="h-full rounded bg-background/75 max-lg:w-2"></div>
            </div>
            <div className="mx-auto w-full max-w-276 lg:min-w-5xl xl:min-w-276 p-[0.5px]">
              <div
                className="h-full rounded bg-background/75"
                data-slot="content"
              >
                <div className="relative rounded-sm bg-white">
                  <div className="p-1">
                    <div className="relative overflow-hidden rounded-sm bg-gradient-to-b from-primary via-primary to-primary/30 p-8">
                      <div className="relative flex flex-col items-center justify-between gap-8 lg:flex-row">
                        <div className="text-white lg:flex-1">
                          <h3 className="mb-2 font-semibold text-xl">
                            Be the brand AI recommends
                          </h3>
                          <p className="max-w-lg text-sm text-white/80">
                            Monitor your brand's visibility across ChatGPT,
                            Claude, Perplexity, and Gemini. Get actionable
                            insights and create content that gets cited by AI
                            search engines.
                          </p>
                          <div className="mt-4 flex flex-row gap-4">
                            <button className="cursor-pointer justify-center whitespace-nowrap font-medium transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0 rounded-md duration-150 focus-visible:ring-1 focus-visible:ring-ring active:scale-[0.99] active:transition-none bg-secondary text-secondary-foreground hover:bg-secondary/80 h-7 px-3 text-xs flex items-center gap-2">
                              Book a Demo
                            </button>
                            <button className="inline-flex cursor-pointer items-center justify-center whitespace-nowrap font-medium transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0 rounded-md focus-visible:ring-1 focus-visible:ring-ring active:scale-[0.99] active:transition-none h-7 px-3 text-xs border border-transparent bg-background shadow-black/15 shadow-sm ring-1 ring-foreground/10 duration-200 hover:bg-muted/50 text-black">
                              Start Free Trial{" "}
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor"
                                viewBox="0 0 256 256"
                                className="h-4 w-4 pl-1"
                              >
                                <path d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z"></path>
                              </svg>
                            </button>
                          </div>
                        </div>
                        <div className="lg:perspective-[1000px] relative mx-auto -mb-12 w-full sm:-mb-12 lg:mx-0 lg:-mr-10 lg:-mb-10 lg:w-1/2 xl:w-3/5">
                          <div className="relative overflow-hidden rounded-lg shadow-xl lg:transform lg:rounded-tl-sm lg:[transform:rotateX(4deg)_rotateY(-12deg)_rotateZ(1deg)]">
                            <Image
                              src="/assets/imageplaceholder.svg"
                              alt={"Promptwatch Dashboard"}
                              width={800}
                              height={600}
                              className="h-auto w-full"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div aria-hidden="true" className="p-[0.5px]">
              <div className="h-full rounded bg-background/75 max-lg:w-2"></div>
            </div>
          </div>
        </section>
      </main>
      <footer className="" role="contentinfo">
        <div className="@container grid grid-cols-[auto_1fr_auto] lg:grid-cols-[1fr_minmax(0,69rem)_1fr]">
          <div aria-hidden="true" className="p-[0.5px]">
            <div className="h-full rounded bg-background/75 max-lg:w-2"></div>
          </div>
          <div className="mx-auto w-full max-w-276 lg:min-w-5xl xl:min-w-276">
            <div className="grid *:p-[0.5px] **:data-grid-content:h-full **:data-grid-content:rounded **:data-grid-content:bg-background/75">
              <div className="grid @4xl:grid-cols-10 gap-px">
                <div
                  className="@4xl:col-span-3 space-y-6 p-6 lg:p-8"
                  data-grid-content="true"
                >
                  <a aria-label="go home" className="block size-fit" href="/">
                    <span
                      data-state="closed"
                      data-slot="context-menu-trigger"
                      style={{ WebkitTouchCallout: "none" }}
                    >
                      <Image
                        src="/assets/imageplaceholder.svg"
                        alt={"Promptwatch Logo"}
                        width={194}
                        height={33}
                        className="size-5"
                      />
                    </span>
                  </a>
                  <p className="text-balance text-muted-foreground text-sm">
                    The AI visibility platform to monitor, rank, and grow your
                    brand in AI search.{" "}
                    <a
                      className="font-medium text-primary hover:underline"
                      href="/careers"
                    >
                      Join the team.
                    </a>
                  </p>
                  <div className="flex gap-3">
                    <a
                      aria-label="X/Twitter"
                      className="block text-muted-foreground hover:text-primary"
                      rel="noopener noreferrer"
                      target="_blank"
                      href="https://x.com/promptwatch"
                    >
                      <svg
                        className="size-5"
                        height="1em"
                        viewBox="0 0 24 24"
                        width="1em"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M10.488 14.651L15.25 21h7l-7.858-10.478L20.93 3h-2.65l-5.117 5.886L8.75 3h-7l7.51 10.015L2.32 21h2.65zM16.25 19L5.75 5h2l10.5 14z"
                          fill="currentColor"
                        ></path>
                      </svg>
                    </a>
                    <a
                      aria-label="LinkedIn"
                      className="block text-muted-foreground hover:text-primary"
                      rel="noopener noreferrer"
                      target="_blank"
                      href="https://www.linkedin.com/company/promptwatch"
                    >
                      <svg
                        className="size-5"
                        height="1em"
                        viewBox="0 0 24 24"
                        width="1em"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93zM6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37z"
                          fill="currentColor"
                        ></path>
                      </svg>
                    </a>
                    <a
                      aria-label="YouTube"
                      className="block text-muted-foreground hover:text-primary"
                      rel="noopener noreferrer"
                      target="_blank"
                      href="https://www.youtube.com/@Promptwatch"
                    >
                      <svg
                        className="size-5"
                        height="1em"
                        viewBox="0 0 24 24"
                        width="1em"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M10 15l5.19-3L10 9v6m11.56-7.83c.13.47.22 1.1.28 1.9c.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83c-.25.9-.83 1.48-1.73 1.73c-.47.13-1.33.22-2.65.28c-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-7.83-.44c-.9-.25-1.48-.83-1.73-1.73c-.13-.47-.22-1.10-.28-1.9c-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83c.25-.9.83-1.48 1.73-1.73c.47-.13 1.33-.22 2.65-.28c1.3-.07 2.49-.1 3.59.1L12 5c4.19 0 6.8.16 7.83.44c.9.25 1.48.83 1.73 1.73"
                          fill="currentColor"
                        ></path>
                      </svg>
                    </a>
                    <a
                      aria-label="GitHub"
                      className="block text-muted-foreground hover:text-primary"
                      rel="noopener noreferrer"
                      target="_blank"
                      href="https://github.com/promptwatch-com"
                    >
                      <svg
                        className="size-5"
                        height="1em"
                        viewBox="0 0 24 24"
                        width="1em"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33s1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2"
                          fill="currentColor"
                        ></path>
                      </svg>
                    </a>
                  </div>
                </div>
                <div className="@4xl:col-span-7 grid gap-px sm:grid-cols-2 lg:grid-cols-4">
                  <div
                    className="space-y-3 p-6 text-sm"
                    data-grid-content="true"
                  >
                    <span className="block font-medium">Platform</span>
                    <div className="flex flex-col flex-wrap gap-2">
                      <a
                        className="inline-flex items-center gap-1 text-muted-foreground duration-150 hover:text-primary"
                        href="/pricing"
                      >
                        <span className="line-clamp-1">Pricing</span>
                      </a>
                      <a
                        className="inline-flex items-center gap-1 text-muted-foreground duration-150 hover:text-primary"
                        href="/book-a-demo?cta_source=www_footer"
                      >
                        <span className="line-clamp-1">Book a demo</span>
                      </a>
                      <a
                        className="inline-flex items-center gap-1 text-muted-foreground duration-150 hover:text-primary"
                        target="_blank"
                        rel="noopener noreferrer"
                        href="https://promptwatch.tolt.io/"
                      >
                        <span className="line-clamp-1">Affiliate program</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 256 256"
                          className="size-3 shrink-0"
                        >
                          <path d="M224,104a8,8,0,0,1-16,0V59.32l-66.33,66.34a8,8,0,0,1-11.32-11.32L196.68,48H152a8,8,0,0,1,0-16h64a8,8,0,0,1,8,8Zm-40,24a8,8,0,0,0-8,8v72H48V80h72a8,8,0,0,0,0-16H48A16,16,0,0,0,32,80V208a16,16,0,0,0,16,16H176a16,16,0,0,0,16-16V136A8,8,0,0,0,184,128Z"></path>
                        </svg>
                      </a>
                      <a
                        className="inline-flex items-center gap-1 text-muted-foreground duration-150 hover:text-primary"
                        href="/creator-program"
                      >
                        <span className="line-clamp-1">Creator program</span>
                      </a>
                      <a
                        className="inline-flex items-center gap-1 text-muted-foreground duration-150 hover:text-primary"
                        href="/changelog"
                      >
                        <span className="line-clamp-1">Changelog</span>
                      </a>
                    </div>
                  </div>
                  <div
                    className="space-y-3 p-6 text-sm"
                    data-grid-content="true"
                  >
                    <span className="block font-medium">Solutions</span>
                    <div className="flex flex-col flex-wrap gap-2">
                      <a
                        className="inline-flex items-center gap-1 text-muted-foreground duration-150 hover:text-primary"
                        href="/solutions/agencies"
                      >
                        <span className="line-clamp-1">Agencies</span>
                      </a>
                      <a
                        className="inline-flex items-center gap-1 text-muted-foreground duration-150 hover:text-primary"
                        href="/solutions/brands"
                      >
                        <span className="line-clamp-1">Brands</span>
                      </a>
                      <a
                        className="inline-flex items-center gap-1 text-muted-foreground duration-150 hover:text-primary"
                        href="/solutions/seo-teams"
                      >
                        <span className="line-clamp-1">SEO Teams</span>
                      </a>
                      <a
                        className="inline-flex items-center gap-1 text-muted-foreground duration-150 hover:text-primary"
                        href="/case-studies"
                      >
                        <span className="line-clamp-1">Case Studies</span>
                      </a>
                      <a
                        className="inline-flex items-center gap-1 text-muted-foreground duration-150 hover:text-primary"
                        href="/docs"
                      >
                        <span className="line-clamp-1">API Documentation</span>
                      </a>
                    </div>
                  </div>
                  <div
                    className="space-y-3 p-6 text-sm"
                    data-grid-content="true"
                  >
                    <span className="block font-medium">Free Tools</span>
                    <div className="flex flex-col flex-wrap gap-2">
                      <a
                        className="inline-flex items-center gap-1 text-muted-foreground duration-150 hover:text-primary"
                        href="/free-tools"
                      >
                        <span className="line-clamp-1">All free tools</span>
                      </a>
                      <a
                        className="inline-flex items-center gap-1 text-muted-foreground duration-150 hover:text-primary"
                        href="/features/chrome-extension"
                      >
                        <span className="line-clamp-1">Chrome Extension</span>
                      </a>
                      <a
                        className="inline-flex items-center gap-1 text-muted-foreground duration-150 hover:text-primary"
                        href="/free-tools/ai-brand-visibility-report"
                      >
                        <span className="line-clamp-1">
                          AI Brand Visibility Report
                        </span>
                      </a>
                      <a
                        className="inline-flex items-center gap-1 text-muted-foreground duration-150 hover:text-primary"
                        href="/free-tools/llms-txt-generator"
                      >
                        <span className="line-clamp-1">LLMs.txt Generator</span>
                      </a>
                      <a
                        className="inline-flex items-center gap-1 text-muted-foreground duration-150 hover:text-primary"
                        href="/glossary"
                      >
                        <span className="line-clamp-1">
                          GEO & AI SEO Glossary
                        </span>
                      </a>
                    </div>
                  </div>
                  <div
                    className="space-y-3 p-6 text-sm"
                    data-grid-content="true"
                  >
                    <span className="block font-medium">Blog & Resources</span>
                    <div className="flex flex-col flex-wrap gap-2">
                      <a
                        className="inline-flex items-center gap-1 text-muted-foreground duration-150 hover:text-primary"
                        href="/best-geo-and-ai-visibility-platforms-compared-2026"
                      >
                        <span className="line-clamp-1">
                          Best GEO and ai visibility platforms compared 2026
                        </span>
                      </a>
                      <a
                        className="inline-flex items-center gap-1 text-muted-foreground duration-150 hover:text-primary"
                        href="/blog/track-brand-mentions-ai-models-real-time-guide"
                      >
                        <span className="line-clamp-1">
                          Track Brand Mentions in AI Models - Real Time Guide
                        </span>
                      </a>
                      <a
                        className="inline-flex items-center gap-1 text-muted-foreground duration-150 hover:text-primary"
                        href="/blog/why-youre-invisible-in-ai-search"
                      >
                        <span className="line-clamp-1">
                          Why You're Invisible in AI Search
                        </span>
                      </a>
                      <a
                        className="inline-flex items-center gap-1 text-muted-foreground duration-150 hover:text-primary"
                        href="/blog/llms-txt-has-no-impact-on-ai-search-and-geo"
                      >
                        <span className="line-clamp-1">
                          LLMs.txt has no impact on AI Search and GEO (yet)
                        </span>
                      </a>
                      <a
                        className="inline-flex items-center gap-1 text-muted-foreground duration-150 hover:text-primary"
                        href="/blog/what-is-generative-engine-optimization-geo"
                      >
                        <span className="line-clamp-1">
                          What is Generative Engine Optimization (GEO)?
                        </span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div className="space-y-4 p-4 lg:px-8" data-grid-content="true">
                  <div className="flex flex-col flex-wrap items-start justify-between gap-4 sm:items-center md:flex-row">
                    <span className="flex gap-2 text-muted-foreground text-xs sm:gap-0">
                      <a className="hover:text-primary" href="/privacy-policy">
                        Privacy Policy
                      </a>
                      <span className="mx-1.5 hidden sm:inline">·</span>
                      <a
                        className="hover:text-primary"
                        href="/terms-and-conditions"
                      >
                        Terms of Service
                      </a>
                      <span className="mx-1.5 hidden sm:inline">·</span>
                      <a
                        className="hover:text-primary"
                        href="/security-disclosure"
                      >
                        Disclosure
                      </a>
                      <span className="mx-1.5 hidden sm:inline">·</span>
                      <a className="hover:text-primary" href="/contact-us">
                        Contact Us
                      </a>
                      <span className="mx-1.5 hidden sm:inline">·</span>
                      <a className="hover:text-primary" href="/about">
                        About
                      </a>
                      <span className="mx-1.5 hidden sm:inline">·</span>
                      <a className="hover:text-primary" href="/press">
                        Press
                      </a>
                    </span>
                    <div className="flex items-center gap-2 rounded-full border border-transparent bg-card py-1 pr-4 pl-2 shadow ring-1 ring-foreground/5">
                      <div className="relative flex size-3">
                        <span className="absolute inset-0 block size-full animate-pulse rounded-full bg-emerald-100 duration-1500"></span>
                        <span className="relative m-auto block size-1 rounded-full bg-emerald-500"></span>
                      </div>
                      <span className="text-sm">All Systems Online</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div aria-hidden="true" className="p-[0.5px]">
            <div className="h-full rounded bg-background/75 max-lg:w-2"></div>
          </div>
        </div>
        <div className="@container grid grid-cols-[auto_1fr_auto] lg:grid-cols-[1fr_minmax(0,69rem)_1fr]">
          <div aria-hidden="true" className="p-[0.5px]">
            <div className="h-full rounded bg-background/75 max-lg:w-2"></div>
          </div>
          <div className="mx-auto w-full max-w-276 lg:min-w-5xl xl:min-w-276 p-[0.5px]">
            <div
              className="h-full rounded bg-background/75 px-2 py-2 lg:px-8"
              data-slot="content"
            >
              <p className="w-full text-right text-muted-foreground/50 text-xs">
                © 2026 Promptwatch B.V. KVK: 97074756 All rights reserved
              </p>
            </div>
          </div>
          <div aria-hidden="true" className="p-[0.5px]">
            <div className="h-full rounded bg-background/75 max-lg:w-2"></div>
          </div>
        </div>
        <div className="@container grid grid-cols-[auto_1fr_auto] lg:grid-cols-[1fr_minmax(0,69rem)_1fr]">
          <div aria-hidden="true" className="p-[0.5px]">
            <div className="h-full rounded bg-background/75 max-lg:w-2"></div>
          </div>
          <div className="mx-auto w-full max-w-276 lg:min-w-5xl xl:min-w-276 p-[0.5px]">
            <div
              className="h-full rounded bg-background/75"
              data-slot="content"
            >
              <div className="h-12"></div>
            </div>
          </div>
          <div aria-hidden="true" className="p-[0.5px]">
            <div className="h-full rounded bg-background/75 max-lg:w-2"></div>
          </div>
        </div>
      </footer>
    </div>
  );
}
