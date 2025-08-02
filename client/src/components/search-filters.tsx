import { useQuery } from "@tanstack/react-query";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sliders } from "lucide-react";
interface SearchFiltersProps {
  filters: {
    technologies: string[];
    deadlineFilter: string;
    budgetRange: string;
    organizationTypes: string[];
  };
  onFiltersChange: (filters: {
    technologies: string[];
    deadlineFilter: string;
    budgetRange: string;
    organizationTypes: string[];
  }) => void;
}
function SearchFilters({ filters, onFiltersChange }: SearchFiltersProps) {
  const { data: techCounts } = useQuery<Record<string, number>>({
    queryKey: ["/api/rfps/stats/technologies"],
  });
  const handleTechnologyChange = (technology: string, checked: boolean) => {
    const newTechnologies = checked 
      ? [...filters.technologies, technology]
      : filters.technologies.filter(t => t !== technology);
    
    onFiltersChange({
      ...filters,
      technologies: newTechnologies,
    });
  };
  const handleOrganizationTypeChange = (orgType: string, checked: boolean) => {
    const newOrgTypes = checked 
      ? [...filters.organizationTypes, orgType]
      : filters.organizationTypes.filter(t => t !== orgType);
    
    onFiltersChange({
      ...filters,
      organizationTypes: newOrgTypes,
    });
  };
  const handleDeadlineChange = (value: string) => {
    onFiltersChange({
      ...filters,
      deadlineFilter: value,
    });
  };
  const handleBudgetChange = (value: string) => {
    onFiltersChange({
      ...filters,
      budgetRange: value,
    });
  };
  const clearAllFilters = () => {
    onFiltersChange({
      technologies: [],
      deadlineFilter: "all",
      budgetRange: "any",
      organizationTypes: [],
    });
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
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-4">
      <h3 className="text-lg font-semibold text-black mb-4 flex items-center">
        <Sliders className="text-brand-teal mr-2" />
        Filter RFPs
      </h3>
      
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Technology Type</h4>
        <div className="space-y-2">
          {technologies.map((tech) => (
            <div key={tech.name} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={tech.name}
                  checked={filters.technologies.includes(tech.name)}
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
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Deadline</h4>
        <Select value={filters.deadlineFilter} onValueChange={handleDeadlineChange}>
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
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Budget Range</h4>
        <Select value={filters.budgetRange} onValueChange={handleBudgetChange}>
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
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Organization Type</h4>
        <div className="space-y-2">
          {orgTypes.map((orgType) => (
            <div key={orgType} className="flex items-center space-x-2">
              <Checkbox
                id={orgType}
                checked={filters.organizationTypes.includes(orgType)}
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
        onClick={clearAllFilters}
        className="w-full bg-brand-teal text-white py-2 px-4 rounded-lg hover:bg-brand-teal transition-colors font-medium"
      >
        Clear Filters
      </button>
    </div>
  );
}
export { SearchFilters };
