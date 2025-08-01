import { Search } from "lucide-react";

export function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Search className="text-brand-orange text-2xl mr-3" />
              <h1 className="text-2xl font-bold text-black">TechRFP Finder</h1>
            </div>
          </div>
          <nav className="flex space-x-8">
            <a href="#" className="text-brand-teal hover:text-brand-orange transition-colors font-medium">Browse RFPs</a>
            <a href="#" className="text-gray-600 hover:text-brand-orange transition-colors font-medium">Alerts</a>
            <a href="#" className="text-gray-600 hover:text-brand-orange transition-colors font-medium">Saved</a>
            <button className="bg-brand-orange text-white px-4 py-2 rounded-lg hover:bg-brand-orange transition-colors font-medium">
              Sign In
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}
