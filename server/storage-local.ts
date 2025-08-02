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
    for (const user of this.users.values()) {
      if (user.email === username) {
        return user;
      }
    }
    return undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = {
      id: randomUUID(),
      email: insertUser.email,
      firstName: insertUser.firstName,
      lastName: insertUser.lastName,
      profileImageUrl: insertUser.profileImageUrl,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...insertUser,
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

  private initializeRfps() {
    console.log('Initializing professional RFP data for local development...');
    
    const sampleRfps: Rfp[] = [
      {
        id: randomUUID(),
        title: "Healthcare Data Management System",
        organization: "Regional Medical Center",
        description: "Comprehensive healthcare data management platform with patient records integration, HIPAA compliance, and real-time analytics. System must support 50,000+ patient records with secure access controls and audit trails.",
        technology: "Drupal",
        budgetMin: 400000,
        budgetMax: 500000,
        deadline: new Date('2025-08-24'),
        postedDate: new Date('2024-12-15'),
        location: "Boston, MA",
        organizationType: "Healthcare",
        contactEmail: "procurement@regionalmedical.org",
        organizationWebsite: "https://www.regionalmedical.org",
        documentUrl: "https://www.regionalmedical.org/procurement/healthcare-data-system-rfp.pdf",
        isDrupal: true,
        isActive: true
      },
      {
        id: randomUUID(),
        title: "University Content Management Platform",
        organization: "State University System",
        description: "Modern content management solution for 12 university campuses serving 180,000 students. Requires multilingual support, accessibility compliance, and integration with student information systems.",
        technology: "Drupal",
        budgetMin: 600000,
        budgetMax: 800000,
        deadline: new Date('2025-09-15'),
        postedDate: new Date('2024-12-20'),
        location: "Austin, TX",
        organizationType: "Education",
        contactEmail: "it-procurement@stateuniversity.edu",
        organizationWebsite: "https://www.stateuniversity.edu",
        documentUrl: "https://www.stateuniversity.edu/procurement/cms-platform-rfp.pdf",
        isDrupal: true,
        isActive: true
      },
      {
        id: randomUUID(),
        title: "Municipal Services Portal Development",
        organization: "City of Springfield",
        description: "Citizen-facing portal for municipal services including permit applications, bill payments, and service requests. Must integrate with existing legacy systems and provide mobile-responsive design.",
        technology: "WordPress",
        budgetMin: 150000,
        budgetMax: 250000,
        deadline: new Date('2025-07-30'),
        postedDate: new Date('2024-12-10'),
        location: "Springfield, IL",
        organizationType: "Government",
        contactEmail: "webmaster@springfield.gov",
        organizationWebsite: "https://www.springfield.gov",
        documentUrl: "https://www.springfield.gov/procurement/municipal-portal-rfp.pdf",
        isDrupal: false,
        isActive: true
      }
    ];

    sampleRfps.forEach(rfp => {
      this.rfps.set(rfp.id, rfp);
    });

    console.log(`✅ Loaded ${sampleRfps.length} professional RFP opportunities`);
    console.log('🎯 Drupal opportunities prioritized for local development');
  }
}

export const storage = new MemStorage();