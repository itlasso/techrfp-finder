import { Search } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-black text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <Search className="text-brand-orange text-xl mr-2" />
              <span className="text-xl font-bold">TechRFP Finder</span>
            </div>
            <p className="text-gray-400">Connecting developers with technology opportunities worldwide.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Features</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-brand-orange transition-colors">Search RFPs</a></li>
              <li><a href="#" className="hover:text-brand-orange transition-colors">Set Alerts</a></li>
              <li><a href="#" className="hover:text-brand-orange transition-colors">Save Opportunities</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Technologies</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-brand-orange transition-colors">Drupal RFPs</a></li>
              <li><a href="#" className="hover:text-brand-orange transition-colors">WordPress RFPs</a></li>
              <li><a href="#" className="hover:text-brand-orange transition-colors">React RFPs</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-brand-orange transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-brand-orange transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-brand-orange transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 TechRFP Finder. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
