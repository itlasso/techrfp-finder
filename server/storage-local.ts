import { type User, type InsertUser, type Rfp, type InsertRfp } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getRfps(filters?: {
    search?: string;
    technologies?: string[];
    deadlineFilter?: string;
    budgetRange?: string;
    organizationTypes?: string[];
  }): Promise<Rfp[]>;
  getRfp(id: string): Promise<Rfp | undefined>;
  createRfp(rfp: InsertRfp): Promise<Rfp>;
}

export class MemStorage implements IStorage {
  private users = new Map<string, User>();
  private rfps = new Map<string, Rfp>();

  constructor() {
    this.initializeRfps();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    for (const user of Array.from(this.users.values())) {
      if (user.email === username) {
        return user;
      }
    }
    return undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = {
      id: randomUUID(),
      email: insertUser.email || null,
      firstName: insertUser.firstName || null,
      lastName: insertUser.lastName || null,
      profileImageUrl: insertUser.profileImageUrl || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(user.id, user);
    return user;
  }

  async getRfp(id: string): Promise<Rfp | undefined> {
    return this.rfps.get(id);
  }

  async createRfp(insertRfp: InsertRfp): Promise<Rfp> {
    const rfp: Rfp = {
      id: randomUUID(),
      postedDate: new Date(),
      ...insertRfp,
    };
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

    if (filters?.budgetRange) {
      const [min, max] = filters.budgetRange.split('-').map(Number);
      rfps = rfps.filter(rfp => {
        if (!rfp.budgetMin) return true;
        return rfp.budgetMin >= min && (max ? rfp.budgetMax && rfp.budgetMax <= max : true);
      });
    }

    if (filters?.deadlineFilter) {
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
    console.log('Loading professional RFP data for Intel iMac...');
    
    // Professional RFP data with working hyperlinks
    const professionalRfps: Rfp[] = [
      {
        id: "a7dbc4d2-d166-4a3a-9882-0c656b3cce7f",
        title: "University Research Platform Development",
        organization: "State University System",
        description: "Development of comprehensive research collaboration platform with grant management, publication tracking, and inter-institutional collaboration tools.",
        technology: "Drupal",
        budgetMin: 300000,
        budgetMax: 400000,
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
        budgetMin: 180000,
        budgetMax: 220000,
        deadline: new Date("2025-08-30"),
        postedDate: new Date(),
        location: "Texas",
        organizationType: "Government",
        contactEmail: "webdev@cityofinnovation.gov",
        organizationWebsite: "https://cityofinnovation.gov",
        documentUrl: "/api/rfps/municipal-portal/document",
        isDrupal: false,
        isActive: true
      },
      {
        id: "cf973054-4f89-48af-bcc3-f35acf9c8616",
        title: "Healthcare Data Management System",
        organization: "Regional Medical Center",
        description: "Implementation of comprehensive healthcare data management system with HIPAA compliance, patient portal integration, and real-time analytics dashboard for clinical decision support.",
        technology: "Drupal",
        budgetMin: 250000,
        budgetMax: 350000,
        deadline: new Date("2025-09-15"),
        postedDate: new Date(),
        location: "California",
        organizationType: "Healthcare",
        contactEmail: "procurement@regionalmed.org",
        organizationWebsite: "https://regionalmed.org",
        documentUrl: "/api/rfps/healthcare-data-mgmt/document",
        isDrupal: true,
        isActive: true
      }
    ];

    professionalRfps.forEach(rfp => {
      this.rfps.set(rfp.id, rfp);
    });

    console.log(`Loaded ${professionalRfps.length} professional RFP opportunities`);
  }
}

export const storage = new MemStorage();