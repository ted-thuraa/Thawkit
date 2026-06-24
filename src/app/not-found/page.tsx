import {
  ArrowRight,
  Star,
  LayoutGrid,
  Link as LinkIcon,
  Users,
  Lock,
  Hexagon,
} from "lucide-react";

// --- Constants & Data ---

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 pb-20">
      <div className="max-w-7xl mx-auto px-6 space-y-24 pt-8">
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="max-w-xl">
            <h1 className="font-serif text-5xl lg:text-[3.5rem] leading-[1.15] font-medium text-gray-900 mb-6">
              Not Found
            </h1>

            <p className="text-gray-600 text-base lg:text-lg leading-relaxed mb-10 max-w-lg">
              The page does not exist
            </p>

            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-7 py-3.5 rounded-lg shadow-blue-200 shadow-lg transition-all hover:shadow-xl">
                Go Back
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
