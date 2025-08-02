import { Rfp } from "@shared/schema";
interface IStorage {
  getRfps(filters?: {
    search?: string;
    technologies?: string[];
    deadlineFilter?: string;
    budgetRange?: string;
    organizationTypes?: string[];
  }): Promise<Rfp[]>;
  getRfp(id: string): Promise<Rfp | undefined>;
  createRfp(rfp: Rfp): Promise<Rfp>;
}
export class LocalStorage implements IStorage {
  private rfps: Map<string, Rfp> = new Map();
  constructor() {
    this.initializeRfps();
  }
  async getRfp(id: string): Promise<Rfp | undefined> {
    return this.rfps.get(id);
  }
  async createRfp(rfp: Rfp): Promise<Rfp> {
    this.rfps.set(rfp.id, rfp);
    return rfp;
  }
  async getRfps(filters?: {
    search?: string;
    technologies?: string[];
    deadlineFilter?: string;
    budgetRange?: string;
    organizationTypes?: string[];
  }): Promise<Rfp[]> {
    let rfps = Array.from(this.rfps.values());
    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      rfps = rfps.filter(rfp => 
        rfp.title.toLowerCase().includes(searchLower) ||
        rfp.description.toLowerCase().includes(searchLower) ||
        rfp.organization.toLowerCase().includes(searchLower)
      );
    }
    if (filters?.technologies?.length) {
      rfps = rfps.filter(rfp => filters.technologies!.includes(rfp.technology));
    }
    if (filters?.organizationTypes?.length) {
      rfps = rfps.filter(rfp => filters.organizationTypes!.includes(rfp.organizationType));
    }
    if (filters?.budgetRange && filters.budgetRange !== "any") {
      const [min, max] = filters.budgetRange.split('-').map(Number);
      rfps = rfps.filter(rfp => {
        if (!rfp.budgetMin) return true;
        return rfp.budgetMin >= min && (max ? rfp.budgetMax && rfp.budgetMax <= max : true);
      });
    }
    if (filters?.deadlineFilter && filters.deadlineFilter !== "all") {
      const now = new Date();
      const filterDays = parseInt(filters.deadlineFilter);
      const filterDate = new Date(now.getTime() + filterDays * 24 * 60 * 60 * 1000);
      
      rfps = rfps.filter(rfp => new Date(rfp.deadline) <= filterDate);
    }
    return rfps.sort((a, b) => {
      // Prioritize Drupal RFPs
      if (a.isDrupal && !b.isDrupal) return -1;
      if (!a.isDrupal && b.isDrupal) return 1;
      
      // Then sort by deadline
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
    });
  }
  private async initializeRfps() {
    console.log('Initializing professional RFP data for local development...');
    
    // Professional RFP data with working hyperlinks
    const professionalRfps: Rfp[] = [
      {
        id: "a7dbc4d2-d166-4a3a-9882-0c656b3cce7f",
        title: "University Research Platform Development",
        organization: "State University System",
        description: "Development of comprehensive research collaboration platform with grant management, publication tracking, and inter-institutional collaboration tools.",
        technology: "Drupal",
        budgetMin: 300000 as number | null,
        budgetMax: 400000 as number | null,
        deadline: new Date("2025-10-15"),
        postedDate: new Date(),
        location: "New York",
        organizationType: "Education",
        contactEmail: "research-it@stateuniv.edu",
        organizationWebsite: "https://stateuniv.edu",
        documentUrl: "/api/rfps/university-research/document",
        isDrupal: true,
        isActive: true
      },
      {
        id: "fcf0a793-9117-49ea-99fd-a39d9ad766e7",
        title: "Municipal Government Portal Modernization",
        organization: "City of Innovation",
        description: "Complete overhaul of city government website with citizen services portal, online permit applications, and integrated payment processing system.",
        technology: "WordPress",
        budgetMin: 180000 as number | null,
        budgetMax: 220000 as number | null,
        deadline: new Date("2025-08-30"),
        postedDate: new Date(),
        location: "Texas",
        organizationType: "Government",
        contactEmail: "webmaster@cityofinnovation.gov",
        organizationWebsite: "https://cityofinnovation.gov",
        documentUrl: "/api/rfps/municipal-portal/document",
        isDrupal: false,
        isActive: true
      },
      {
        id: "cf973054-4f89-48af-bcc3-f35acf9c8616",
        title: "Healthcare Data Management System",
        organization: "Regional Medical Alliance",
        description: "Implementation of secure, HIPAA-compliant data management platform for multi-facility healthcare network with patient portal and provider collaboration tools.",
        technology: "Drupal",
        budgetMin: 450000 as number | null,
        budgetMax: 580000 as number | null,
        deadline: new Date("2025-12-01"),
        postedDate: new Date(),
        location: "California",
        organizationType: "Non-profit",
        contactEmail: "procurement@medalliance.org",
        organizationWebsite: "https://regionalmedical.org",
        documentUrl: "/api/rfps/healthcare-data/document",
        isDrupal: true,
        isActive: true
      }
    ];
    for (const rfp of professionalRfps) {
      this.rfps.set(rfp.id, rfp);
    }
    console.log('Successfully loaded 3 professional RFP opportunities');
    console.log('RFP titles:', professionalRfps.map(rfp => rfp.title));
  }
  getTechnologyCounts(): Record<string, number> {
    const counts: Record<string, number> = {};
    for (const rfp of this.rfps.values()) {
      counts[rfp.technology] = (counts[rfp.technology] || 0) + 1;
    }
    return counts;
  }
}
export const storage = new LocalStorage();
