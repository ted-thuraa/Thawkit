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

export const Faq1 = ({ section }: Props) => {
  return (
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
            Yet bed any for assistance indulgence unpleasing. Not thoughts all
            exercise blessing. Indulgence way everything joy alteration
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
  );
};
