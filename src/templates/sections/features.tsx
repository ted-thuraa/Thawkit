import { cn } from "@/lib/utils";
import { PageSection } from "@/types/PageCMS/pageSchema";

type Props = {
  section: PageSection;
};

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

export const Features1 = ({ section }: Props) => {
  return (
    <section className=" w-full ">
      {/* Section Header */}
      <div className="text-center mb-12 md:mb-16">
        <h2 className="text-3xl md:text-4xl font-normal mb-4">
          Discover what sets us apart
        </h2>
        <p className="text-gray-500 max-w-2xl mx-auto text-base md:text-lg">
          Explore the unique features and advantages that distinguish us from
          the competition, delivering exceptional value and innovation
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
  );
};
