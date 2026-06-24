import Image from "next/image";
import Navbar from "./_components/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowRight,
  Star,
  LayoutGrid,
  Link as LinkIcon,
  Users,
  Lock,
  Hexagon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";
import Link from "next/link";
// --- Constants & Data ---

const NAV_LINKS = [
  { label: "Home", href: "#" },
  { label: "Product", href: "#" },
  { label: "Solution", href: "#" },
  { label: "Pricing", href: "#" },
  { label: "About us", href: "#" },
  { label: "Contact", href: "#" },
];

const STATS_DATA = [
  { value: "100k+", label: "Trusted by professionals and teams worldwide." },
  { value: "5k+", label: "Empowering businesses with seamless collaboration." },
  { value: "10M+", label: "Helping users stay organized and productive." },
  {
    value: "4.8/5",
    label: "Loved by users for its simplicity and efficiency.",
  },
];

const FEATURES_DATA = [
  {
    icon: <LayoutGrid className="w-5 h-5 text-white" />,
    title: "User-Friendly Experience",
    desc: "Designed for simplicity, so you can focus on work, not the tool.",
  },
  {
    icon: <LinkIcon className="w-5 h-5 text-white" />,
    title: "Flexible & Customizable",
    desc: "Adapts to your workflow with Kanban, List, and Calendar views.",
  },
  {
    icon: <Users className="w-5 h-5 text-white" />,
    title: "Seamless Collaboration",
    desc: "Keep your team aligned with shared tasks, real-time updates, and integrations.",
  },
  {
    icon: <Lock className="w-5 h-5 text-white" />,
    title: "Secure & Reliable",
    desc: "Data encryption and cloud storage ensure your information is always protected.",
  },
];

// --- Sub-Components ---

const StarRating = () => (
  <div className="inline-flex items-center gap-2 bg-gray-50 border border-gray-100 px-4 py-2 rounded-full mb-6">
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((_, i) => (
        <Star key={i} className="w-4 h-4 fill-orange-400 text-orange-400" />
      ))}
    </div>
    <span className="text-sm font-medium text-gray-700">4.97/5 reviews</span>
  </div>
);

const StarIcon = () => (
  <svg className="w-4 h-4 text-[#bf9b78] fill-current" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const FeatureIcon = () => (
  <svg
    className="w-5 h-5 text-white"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
    />
  </svg>
);

// --- Data ---

const stats = [
  {
    value: "95%",
    label: "Customer satisfaction rate, reflecting our dedication",
  },
  {
    value: "10+",
    label: "Innovation and insight to users' financial journeys",
  },
  {
    value: "$10m",
    label: "Platform has ensuring secure and efficient financial",
  },
  {
    value: "50m",
    label: "Users worldwide, providing them with financial solutions",
  },
];

const features = [
  {
    title: "Acquisitions Advisory",
    description:
      "Our Acquisitions Advisory service provides expert guidance throughout the entire acquisition process, from initial strategy.",
    gridClass: "col-span-1 md:col-span-2",
  },
  {
    title: "Risk Mitigation",
    description:
      "Protect your financial assets and investments with our risk mitigation solutions. We identify potential risks, and safeguard your financial future.",
    gridClass: "col-span-1 md:col-span-2",
  },
  {
    title: "Financial Forecasting",
    description:
      "Plan for a secure financial future with Akaunt's financial planning service. Our expert advisors offer personalized financial plans to your goals.",
    gridClass: "col-span-1 md:col-span-2",
  },
  {
    title: "Tax Planning",
    description:
      "Our platform helps you track deductible expenses, generate tax reports, and stay compliant with the latest tax regulations.",
    gridClass: "col-span-1 md:col-span-2",
  },
  {
    title: "Investment Strategies",
    description:
      "We analyze your financial goals, risk tolerance, and market conditions to develop a personalized investment plan.",
    gridClass: "col-span-1 md:col-span-2",
  },
];

const faqData = [
  {
    id: "item-1",
    question: "Is my data safe with your platform?",
    answer:
      "Yes, we prioritize data security. We use industry-standard encryption for data at rest and in transit, and we are fully compliant with GDPR and SOC2 standards to ensure your information remains protected.",
  },
  {
    id: "item-2",
    question: "What kind of customer support do you offer?",
    answer:
      "We offer 24/7 customer support via email and live chat for all plans. Enterprise customers also get access to a dedicated account manager and priority phone support.",
  },
  {
    id: "item-3",
    question: "How does the pricing for your SaaS solution work?",
    answer:
      "Our pricing is tiered based on feature usage and seat count. We offer a free tier for startups, a Pro tier for growing teams, and custom Enterprise pricing. You can view our pricing page for more details.",
  },
  {
    id: "item-4",
    question: "Can I cancel my subscription at any time?",
    answer:
      "Absolutely. You can cancel your subscription directly from your account dashboard at any time. Your access will remain active until the end of your current billing cycle.",
  },
  {
    id: "item-5",
    question: "Can I upgrade or downgrade my subscription plan?",
    answer:
      "Yes, you can adjust your plan at any time. Upgrades take effect immediately with prorated billing, while downgrades are applied at the start of the next billing cycle.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 pb-20">
      {/* Injecting fonts and overrides here to ensure they work without Next.js config 
        This mimics the visual requirement of Inter and Playfair Display
      */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Playfair+Display:wght@400;600;700&display=swap');
        
        .font-sans { font-family: 'Inter', sans-serif !important; }
        .font-serif { font-family: 'Playfair Display', serif !important; }
      `}</style>

      {/* --------------------------------------------------
        1. Header / Navigation
        --------------------------------------------------
      */}
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

      <main className="max-w-7xl mx-auto px-6 space-y-24 pt-8">
        {/* --------------------------------------------------
          2. Hero Section
          --------------------------------------------------
        */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Content */}
          <div className="max-w-xl">
            {/* <StarRating /> */}

            <h1 className="font-serif text-5xl lg:text-[3.5rem] leading-[1.15] font-medium text-gray-900 mb-6">
              Discover our journey and what drives us
            </h1>

            <p className="text-gray-600 text-base lg:text-lg leading-relaxed mb-10 max-w-lg">
              At Mentorea, we believe that managing tasks should be simple,
              intuitive, and efficient. Our mission is to help individuals and
              teams stay organized, collaborate seamlessly, and achieve more
              with ease.
            </p>

            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-7 py-3.5 rounded-lg shadow-blue-200 shadow-lg transition-all hover:shadow-xl">
                Get Started
                <ArrowRight className="w-4 h-4" />
              </button>
              <button className="px-7 py-3.5 rounded-lg border border-gray-300 text-blue-600 font-medium hover:bg-blue-50 transition-colors">
                Free trial
              </button>
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

        <section className=" w-full ">
          {/* Header Row */}
          <div className="flex flex-col lg:flex-row justify-between items-start gap-6 lg:gap-12 mb-8">
            <h1 className="text-3xl md:text-4xl lg:text-[2.75rem] leading-[1.2] font-medium tracking-tight max-w-3xl">
              We are passionate about empowering individuals and businesses to
              take control of their finances and achieve their financial goals.
            </h1>
          </div>

          {/* Subtext */}
          <p className="text-gray-500 max-w-2xl text-base md:text-lg leading-relaxed mb-16">
            We are dedicated to revolutionizing the way individuals and
            businesses manage their finances. Our team is committed to providing
            intuitive and innovative solutions that empower our users to achieve
            financial success.
          </p>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            {stats.map((stat, index) => (
              <div key={index} className="flex flex-col gap-3">
                <span className="text-4xl md:text-5xl font-normal tracking-tight">
                  {stat.value}
                </span>
                <p className="text-gray-500 text-sm leading-snug">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* --- Bottom Panel: Features --- */}
        <section className=" w-full ">
          {/* Section Header */}
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-normal mb-4">
              Discover what sets us apart
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-base md:text-lg">
              Explore the unique features and advantages that distinguish us
              from the competition, delivering exceptional value and innovation
            </p>
          </div>

          <div className="w-full ">
            <div className="flex flex-wrap gap-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={cn(
                    "bg-[#efefed] rounded-2xl p-8 flex flex-col justify-start items-start gap-4 hover:bg-[#e8e8e6] transition-colors duration-200",
                    "grow basis-full md:basis-[calc((100%-1.5rem)/2)] lg:basis-[calc((100%-3rem)/3)]",
                  )}
                >
                  <div>
                    <div className="w-10 h-10 bg-[#1e2330] rounded-lg flex items-center justify-center mb-2 shadow-sm">
                      <FeatureIcon />
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900">
                      {feature.title}
                    </h3>

                    <p className="text-gray-600 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- Faq's --- */}
        <section className="bg-white  font-sans">
          <div className=" mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
            {/* Left Column: Content */}
            <div className="flex flex-col justify-start pt-4">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Any questions?
                <br />
                We got you.
              </h2>
              <p className="text-gray-500 text-base md:text-lg mb-8 leading-relaxed max-w-md">
                Yet bed any for assistance indulgence unpleasing. Not thoughts
                all exercise blessing. Indulgence way everything joy alteration
                boisterous the attachment.
              </p>
              <Link
                href="#"
                className="inline-flex items-center text-indigo-600 font-semibold hover:text-indigo-700 transition-colors group"
              >
                More FAQs
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            {/* Right Column: Accordion */}
            <div>
              <Accordion
                type="single"
                collapsible
                defaultValue="item-1"
                className="w-full"
              >
                {faqData.map((faq) => (
                  <AccordionItem
                    key={faq.id}
                    value={faq.id}
                    // Matches the thin gray divider in the design
                    className="border-b border-gray-200 last:border-none"
                  >
                    <AccordionTrigger className="text-gray-900 text-lg hover:no-underline py-5 text-left font-semibold">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-500 text-base pb-5 leading-relaxed">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        <section className=" bg-white text-gray-900  font-sans">
          <div className="max-w-3xl mx-auto flex flex-col items-center">
            {/* Header Badge */}
            <div className="inline-flex items-center justify-center px-3 py-1 mb-6 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-medium tracking-wide">
              <HelpCircle className="w-3 h-3 mr-1.5" />
              FAQ
            </div>

            {/* Title */}
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4 tracking-tight">
              Some of the things you
              <br />
              may want to know
            </h2>

            {/* Subtitle */}
            <p className="text-zinc-500 text-center mb-16 text-sm md:text-base font-normal">
              We answered questions so you don&apos;t have to ask them.
            </p>

            {/* Accordion List */}
            <Accordion type="single" collapsible className="w-full space-y-4">
              {faqData.map((faq) => (
                <AccordionItem
                  key={faq.id}
                  value={faq.id}
                  // Custom styles to match the 'card' look in the design
                  // bg-zinc-900/50 provides the subtle dark card background
                  // rounded-2xl matches the pill shape
                  className="border-none bg-zinc-900/50 rounded-2xl px-6 "
                >
                  <AccordionTrigger
                    // Hover:no-underline overrides default shadcn behavior
                    // text-zinc-200 for the off-white text color
                    className="hover:no-underline hover:text-white text-zinc-200 text-left py-5 text-sm md:text-base font-medium transition-colors data-[state=open]:text-white"
                  >
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-zinc-400 pb-5 text-sm leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

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
                  Subscribe to our newsletter and be the first to receive
                  insights, updates, and expert tips on optimizing your
                  financial management.
                </p>
              </div>

              {/* Right Column: Form Content */}
              <div className="w-full lg:w-auto flex flex-col gap-4 min-w-[320px] md:min-w-[440px]">
                <p className="text-zinc-400 text-sm mb-1 ml-1">
                  Stay up to date
                </p>

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
      </main>
    </div>
  );
}
