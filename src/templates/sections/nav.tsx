import { PageSection } from "@/types/PageCMS/pageSchema";
import { Hexagon } from "lucide-react";

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
};

export const Navbar1 = ({ section }: Props) => {
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
