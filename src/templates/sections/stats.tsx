import { PageSection } from "@/types/PageCMS/pageSchema";

type Props = {
  section: PageSection;
};

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

export const Stats1 = ({ section }: Props) => {
  return (
    <section className=" w-full ">
      {/* Header Row */}
      <div className="flex flex-col lg:flex-row justify-between items-start gap-6 lg:gap-12 mb-8">
        <h1 className="text-3xl md:text-4xl lg:text-[2.75rem] leading-[1.2] font-medium tracking-tight max-w-3xl">
          We are passionate about empowering individuals and businesses to take
          control of their finances and achieve their financial goals.
        </h1>
      </div>

      {/* Subtext */}
      <p className="text-gray-500 max-w-2xl text-base md:text-lg leading-relaxed mb-16">
        We are dedicated to revolutionizing the way individuals and businesses
        manage their finances. Our team is committed to providing intuitive and
        innovative solutions that empower our users to achieve financial
        success.
      </p>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
        {stats.map((stat, index) => (
          <div key={index} className="flex flex-col gap-3">
            <span className="text-4xl md:text-5xl font-normal tracking-tight">
              {stat.value}
            </span>
            <p className="text-gray-500 text-sm leading-snug">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
