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

  private async initializeRfps() {
    console.log('Fetching live government RFP data from SAM.gov...');
    
    try {
      // Initialize SAM.gov service if API key is available
      const apiKey = process.env.SAM_GOV_API_KEY;
      if (!apiKey) {
        console.log('⚠️ SAM_GOV_API_KEY not provided - unable to fetch live data');
        return;
      }

      const { SamGovService } = await import("./sam-gov-service");
      const samGovService = new SamGovService(apiKey);
      
      const liveRfps = await samGovService.searchOpportunities({
        keywords: ['website', 'web development', 'CMS', 'content management', 'Drupal', 'WordPress', 'digital', 'portal'],
        limit: 50
      });

      if (liveRfps && liveRfps.length > 0) {
        liveRfps.forEach(rfp => {
          this.rfps.set(rfp.id, rfp);
        });
        
        const drupalCount = liveRfps.filter(rfp => rfp.isDrupal).length;
        console.log(`✅ Loaded ${liveRfps.length} live government RFP opportunities`);
        console.log(`🎯 Found ${drupalCount} Drupal-related opportunities prioritized`);
        console.log(`📊 Total budget range: $${Math.min(...liveRfps.map(r => r.budgetMin || 0)).toLocaleString()} - $${Math.max(...liveRfps.map(r => r.budgetMax || 0)).toLocaleString()}`);
      } else {
        console.log('⚠️ No live RFP opportunities found from SAM.gov');
      }

    } catch (error) {
      console.error('❌ Error fetching live RFP data:', error);
      console.log('Using fallback data while API issues are resolved...');
    }
  }
}

export const storage = new MemStorage();