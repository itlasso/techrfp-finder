import { Calendar, Clock, MapPin, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import type { Rfp } from "@shared/schema";

interface RfpCardProps {
  rfp: Rfp;
}

export function RfpCard({ rfp }: RfpCardProps) {
  const [location, navigate] = useLocation();
  const formatBudget = (min?: number | null, max?: number | null) => {
    if (!min && !max) return "Budget not specified";
    if (min && max) {
      return `$${(min / 1000).toFixed(0)}K - $${(max / 1000).toFixed(0)}K`;
    }
    if (min) return `$${(min / 1000).toFixed(0)}K+`;
    return `Up to $${(max! / 1000).toFixed(0)}K`;
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  const getDaysUntilDeadline = (deadline: Date) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getTechnologyColor = (technology: string) => {
    switch (technology.toLowerCase()) {
      case "drupal": return "bg-brand-orange";
      case "wordpress": return "bg-blue-500";
      case "react": return "bg-cyan-500";
      case "angular": return "bg-red-500";
      case "python": return "bg-green-600";
      case "node.js": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  const getDeadlineColor = (daysUntil: number) => {
    if (daysUntil <= 7) return "bg-red-100 text-red-800";
    if (daysUntil <= 14) return "bg-yellow-100 text-yellow-800";
    return "bg-green-100 text-green-800";
  };

  const daysUntilDeadline = getDaysUntilDeadline(rfp.deadline);

  return (
    <div className={`rfp-card bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-all duration-200 ${
      rfp.isDrupal ? "drupal-highlight" : ""
    }`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <span className={`${getTechnologyColor(rfp.technology)} text-white text-xs font-semibold px-2 py-1 rounded-full mr-2`}>
              {rfp.technology.toUpperCase()}
            </span>
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${getDeadlineColor(daysUntilDeadline)}`}>
              Due in {daysUntilDeadline} days
            </span>
          </div>
          <h4 
            className="text-lg font-semibold text-black mb-2 hover:text-brand-orange cursor-pointer"
            onClick={() => navigate(`/rfp/${rfp.id}`)}
          >
            {rfp.title}
          </h4>
          <p className="text-gray-600 mb-2">{rfp.organization}</p>
          <p className="text-sm text-gray-500 line-clamp-2">
            {rfp.description}
          </p>
        </div>
        <div className="text-right ml-4">
          <p className="text-sm text-gray-500">Budget</p>
          <p className="text-lg font-semibold text-brand-teal">
            {formatBudget(rfp.budgetMin, rfp.budgetMax)}
          </p>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <span className="flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            Posted: {formatDate(rfp.postedDate)}
          </span>
          <span className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            Deadline: {formatDate(rfp.deadline)}
          </span>
          <span className="flex items-center">
            <MapPin className="w-4 h-4 mr-1" />
            {rfp.location}
          </span>
        </div>
        <div className="flex space-x-2">
          <Button variant="ghost" size="sm" className="text-brand-teal hover:text-brand-teal">
            <Bookmark className="w-4 h-4" />
          </Button>
          <Button 
            className="bg-brand-orange text-white hover:bg-brand-orange"
            onClick={() => navigate(`/rfp/${rfp.id}`)}
          >
            View Details
          </Button>
        </div>
      </div>
    </div>
  );
}
