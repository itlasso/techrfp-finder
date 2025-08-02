import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { SearchFilters } from "@/components/search-filters";
import { RfpCard } from "@/components/rfp-card";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import type { Rfp } from "@shared/schema";

export default function RfpBrowser() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("deadline");
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    technologies: [] as string[],
    deadlineFilter: "",
    budgetRange: "",
    organizationTypes: [] as string[],
  });

  const ITEMS_PER_PAGE = 3;

  const queryParams = useMemo(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (filters.technologies.length > 0) {
      filters.technologies.forEach(tech => params.append("technologies", tech));
    }
    if (filters.deadlineFilter) params.set("deadlineFilter", filters.deadlineFilter);
    if (filters.budgetRange) params.set("budgetRange", filters.budgetRange);
    if (filters.organizationTypes.length > 0) {
      filters.organizationTypes.forEach(type => params.append("organizationTypes", type));
    }
    return params.toString();
  }, [searchQuery, filters]);

  const { data: rfps, isLoading, error } = useQuery<Rfp[]>({
    queryKey: ["/api/rfps", queryParams],
    queryFn: async () => {
      const url = queryParams ? `/api/rfps?${queryParams}` : '/api/rfps';
      console.log('Fetching RFPs from:', url);
      const response = await fetch(url);
      if (!response.ok) {
        console.error('RFP fetch failed:', response.status, response.statusText);
        throw new Error(`Failed to fetch RFPs: ${response.status}`);
      }
      const data = await response.json();
      console.log('RFPs received:', data.length, 'items');
      return data;
    },
  });

  const sortedRfps = useMemo(() => {
    console.log('Sorting RFPs. Raw data:', rfps);
    if (!rfps) {
      console.log('No RFPs data available');
      return [];
    }
    
    const sorted = [...rfps].sort((a, b) => {
      switch (sortBy) {
        case "budget":
          const aBudget = a.budgetMax || a.budgetMin || 0;
          const bBudget = b.budgetMax || b.budgetMin || 0;
          return bBudget - aBudget;
        case "posted":
          return new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime();
        case "deadline":
        default:
          return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      }
    });
    console.log('Sorted RFPs:', sorted.length, 'items');
    return sorted;
  }, [rfps, sortBy]);

  // Pagination logic
  const totalPages = Math.ceil(sortedRfps.length / ITEMS_PER_PAGE);
  const paginatedRfps = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginated = sortedRfps.slice(startIndex, endIndex);
    console.log('Paginated RFPs:', paginated.length, 'items for page', currentPage);
    console.log('First RFP:', paginated[0]?.title);
    return paginated;
  }, [sortedRfps, currentPage]);

  // Reset to page 1 when filters change
  useMemo(() => {
    setCurrentPage(1);
  }, [searchQuery, filters, sortBy]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading RFPs</h2>
            <p className="text-gray-600">Failed to load RFP data. Please try again later.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section */}
        <div className="mb-8">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-black mb-2">Find Open Technology RFPs</h2>
            <p className="text-gray-600 text-lg">Discover opportunities in Drupal, WordPress, and other technology projects</p>
          </div>
          
          {/* Search Bar */}
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="text-gray-400" />
              </div>
              <Input
                type="text"
                className="search-input block w-full pl-10 pr-12 py-4 text-lg border border-gray-300 rounded-xl focus:ring-brand-orange focus:border-brand-orange transition-all"
                placeholder="Search RFPs by keywords, organization, or technology..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="absolute inset-y-0 right-0 pr-3 flex items-center text-brand-orange hover:text-orange-600">
                <Filter className="text-xl" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <SearchFilters onFiltersChange={setFilters} />

          {/* RFP Results */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-semibold text-black">Search Results</h3>
                <p className="text-gray-600">
                  {isLoading ? "Loading..." : `Found ${sortedRfps.length} open RFPs${totalPages > 1 ? ` (Page ${currentPage} of ${totalPages})` : ''}`}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">Sort by:</span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="deadline">Deadline (Nearest first)</SelectItem>
                    <SelectItem value="budget">Budget (Highest first)</SelectItem>
                    <SelectItem value="posted">Posted Date</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="flex justify-center py-12">
                <div className="loading-spinner w-8 h-8 border-4 border-gray-200 border-t-brand-orange rounded-full"></div>
              </div>
            )}

            {/* Empty State */}
            {!isLoading && sortedRfps.length === 0 && (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900 mb-2">No RFPs Found</h3>
                <p className="text-gray-600">Try adjusting your search criteria or filters to find more opportunities.</p>
              </div>
            )}

            {/* Debug Info */}
            {!isLoading && (
              <div className="mb-4 p-4 bg-gray-100 rounded text-xs">
                <strong>Debug:</strong> Loading: {isLoading.toString()}, 
                Total RFPs: {sortedRfps.length}, 
                Paginated: {paginatedRfps.length}, 
                Page: {currentPage}/{totalPages}
              </div>
            )}

            {/* RFP Cards */}
            {!isLoading && paginatedRfps.length > 0 && (
              <div className="space-y-6">
                {paginatedRfps.map((rfp) => (
                  <RfpCard key={rfp.id} rfp={rfp} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {!isLoading && sortedRfps.length > 0 && totalPages > 1 && (
              <div className="flex justify-center mt-12">
                <nav className="flex items-center space-x-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-gray-500 hover:text-brand-orange"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  
                  {/* Page Numbers */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    // Show first page, last page, current page, and pages around current
                    const shouldShow = 
                      page === 1 || 
                      page === totalPages || 
                      Math.abs(page - currentPage) <= 1;
                    
                    if (!shouldShow) {
                      // Show ellipsis if there's a gap
                      if (page === 2 && currentPage > 4) {
                        return <span key={page} className="px-3 py-2 text-gray-500">...</span>;
                      }
                      if (page === totalPages - 1 && currentPage < totalPages - 3) {
                        return <span key={page} className="px-3 py-2 text-gray-500">...</span>;
                      }
                      return null;
                    }
                    
                    return (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "ghost"}
                        className={currentPage === page ? "bg-brand-orange text-white" : "text-gray-700 hover:text-brand-orange"}
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </Button>
                    );
                  })}
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-gray-500 hover:text-brand-orange"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </nav>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
