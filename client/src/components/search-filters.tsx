import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sliders } from "lucide-react";

interface SearchFiltersProps {
  onFiltersChange: (filters: {
    technologies: string[];
    deadlineFilter: string;
    budgetRange: string;
    organizationTypes: string[];
  }) => void;
}

export function SearchFilters({ onFiltersChange }: SearchFiltersProps) {
  const [selectedTechnologies, setSelectedTechnologies] = useState<string[]>([]);
  const [deadlineFilter, setDeadlineFilter] = useState<string>("");
  const [budgetRange, setBudgetRange] = useState<string>("");
  const [organizationTypes, setOrganizationTypes] = useState<string[]>([]);

  const { data: techCounts } = useQuery<Record<string, number>>({
    queryKey: ["/api/rfps/stats/technologies"],
  });

  useEffect(() => {
    onFiltersChange({
      technologies: selectedTechnologies,
      deadlineFilter,
      budgetRange,
      organizationTypes,
    });
  }, [selectedTechnologies, deadlineFilter, budgetRange, organizationTypes, onFiltersChange]);

  const handleTechnologyChange = (technology: string, checked: boolean) => {
    if (checked) {
      setSelectedTechnologies([...selectedTechnologies, technology]);
    } else {
      setSelectedTechnologies(selectedTechnologies.filter(t => t !== technology));
    }
  };

  const handleOrganizationTypeChange = (orgType: string, checked: boolean) => {
    if (checked) {
      setOrganizationTypes([...organizationTypes, orgType]);
    } else {
      setOrganizationTypes(organizationTypes.filter(t => t !== orgType));
    }
  };

  const technologies = [
    { name: "Drupal", count: techCounts?.["Drupal"] || 0 },
    { name: "WordPress", count: techCounts?.["WordPress"] || 0 },
    { name: "React", count: techCounts?.["React"] || 0 },
    { name: "Angular", count: techCounts?.["Angular"] || 0 },
    { name: "Node.js", count: techCounts?.["Node.js"] || 0 },
    { name: "Python", count: techCounts?.["Python"] || 0 },
  ];

  const orgTypes = ["Government", "Non-profit", "Education", "Private"];

  return (
    <aside className="lg:w-80 flex-shrink-0">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-4">
        <h3 className="text-lg font-semibold text-black mb-4 flex items-center">
          <Sliders className="text-brand-teal mr-2" />
          Filter RFPs
        </h3>
        
        {/* Technology Type Filter */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Technology Type</h4>
          <div className="space-y-2">
            {technologies.map((tech) => (
              <div key={tech.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={tech.name}
                    checked={selectedTechnologies.includes(tech.name)}
                    onCheckedChange={(checked) => 
                      handleTechnologyChange(tech.name, !!checked)
                    }
                  />
                  <label htmlFor={tech.name} className="text-sm text-gray-700 cursor-pointer">
                    {tech.name}
                  </label>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full text-white ${
                  tech.name === "Drupal" ? "bg-brand-orange" : "bg-gray-500"
                }`}>
                  {tech.count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Deadline Filter */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Deadline</h4>
          <Select value={deadlineFilter} onValueChange={setDeadlineFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All deadlines" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All deadlines</SelectItem>
              <SelectItem value="7">Next 7 days</SelectItem>
              <SelectItem value="30">Next 30 days</SelectItem>
              <SelectItem value="90">Next 3 months</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Budget Range */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Budget Range</h4>
          <Select value={budgetRange} onValueChange={setBudgetRange}>
            <SelectTrigger>
              <SelectValue placeholder="Any budget" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any budget</SelectItem>
              <SelectItem value="0-50000">Under $50K</SelectItem>
              <SelectItem value="50000-100000">$50K - $100K</SelectItem>
              <SelectItem value="100000-500000">$100K - $500K</SelectItem>
              <SelectItem value="500000+">$500K+</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Organization Type */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Organization Type</h4>
          <div className="space-y-2">
            {orgTypes.map((orgType) => (
              <div key={orgType} className="flex items-center space-x-2">
                <Checkbox
                  id={orgType}
                  checked={organizationTypes.includes(orgType)}
                  onCheckedChange={(checked) => 
                    handleOrganizationTypeChange(orgType, !!checked)
                  }
                />
                <label htmlFor={orgType} className="text-sm text-gray-700 cursor-pointer">
                  {orgType}
                </label>
              </div>
            ))}
          </div>
        </div>

        <button 
          onClick={() => {
            setSelectedTechnologies([]);
            setDeadlineFilter("all");
            setBudgetRange("any");
            setOrganizationTypes([]);
          }}
          className="w-full bg-brand-teal text-white py-2 px-4 rounded-lg hover:bg-brand-teal transition-colors font-medium"
        >
          Clear Filters
        </button>
      </div>
    </aside>
  );
}
