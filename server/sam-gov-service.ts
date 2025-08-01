import type { Rfp, InsertRfp } from "@shared/schema";

export interface SamGovOpportunity {
  noticeId: string;
  title: string;
  solicitationNumber: string;
  fullParentPathName: string;
  postedDate: string;
  type: string;
  responseDeadLine: string;
  naicsCode: string;
  description: string;
  active: string;
  data?: {
    pointOfContact?: Array<{
      email?: string;
      fullname?: string;
      title?: string;
      phone?: string;
    }>;
    placeOfPerformance?: {
      city?: { name?: string };
      state?: { name?: string };
    };
    officeAddress?: {
      city?: string;
      state?: string;
    };
  };
  uiLink?: string;
  resourceLinks?: string[];
}

export interface SamGovResponse {
  totalRecords: number;
  limit: number;
  offset: number;
  opportunitiesData: SamGovOpportunity[];
}

export class SamGovService {
  private readonly apiKey: string;
  private readonly baseUrl = 'https://api.sam.gov/opportunities/v2/search';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async searchOpportunities(params: {
    title?: string;
    postedFrom: string;
    postedTo: string;
    limit?: number;
    offset?: number;
    state?: string;
    ncode?: string; // NAICS code for technology filtering
    organizationName?: string;
  }): Promise<SamGovResponse> {
    const searchParams = new URLSearchParams({
      api_key: this.apiKey,
      postedFrom: params.postedFrom,
      postedTo: params.postedTo,
      limit: (params.limit || 50).toString(),
      offset: (params.offset || 0).toString(),
    });

    if (params.title) {
      searchParams.append('title', params.title);
    }
    if (params.state) {
      searchParams.append('state', params.state);
    }
    if (params.ncode) {
      searchParams.append('ncode', params.ncode);
    }
    if (params.organizationName) {
      searchParams.append('organizationName', params.organizationName);
    }

    const url = `${this.baseUrl}?${searchParams.toString()}`;
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`SAM.gov API error: ${response.status} ${response.statusText}`);
      }
      
      const data: SamGovResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching from SAM.gov API:', error);
      throw error;
    }
  }

  // Convert SAM.gov opportunity to our RFP format
  convertToRfp(opportunity: SamGovOpportunity): Omit<Rfp, 'id'> {
    // Extract technology from title and NAICS code
    const technology = this.extractTechnology(opportunity.title, opportunity.naicsCode);
    
    // Determine organization type from the parent path
    const organizationType = this.determineOrgType(opportunity.fullParentPathName);
    
    // Extract location from place of performance or office address
    const location = this.extractLocation(opportunity);
    
    // Extract contact email from point of contact
    const contactEmail = opportunity.data?.pointOfContact?.[0]?.email || '';
    
    // Create organization website from government domain
    const organizationWebsite = this.generateGovWebsite(opportunity.fullParentPathName);
    
    // Generate document URL from resource links or UI link
    const documentUrl = opportunity.resourceLinks?.[0] || opportunity.uiLink || 
      `https://sam.gov/opp/${opportunity.noticeId}`;

    return {
      title: opportunity.title,
      organization: this.extractOrganization(opportunity.fullParentPathName),
      description: `Federal procurement opportunity: ${opportunity.title}. Solicitation Number: ${opportunity.solicitationNumber}. Posted on ${opportunity.postedDate}. This is an active federal contracting opportunity. Please review the full solicitation documents for detailed requirements and submission instructions.`,
      technology,
      budgetMin: this.estimateBudget(opportunity.naicsCode, 'min'),
      budgetMax: this.estimateBudget(opportunity.naicsCode, 'max'),
      deadline: new Date(opportunity.responseDeadLine || this.addDays(new Date(), 30)),
      postedDate: new Date(opportunity.postedDate),
      location,
      organizationType,
      contactEmail: contactEmail || null,
      organizationWebsite: organizationWebsite || null,
      documentUrl: documentUrl || null,
      isDrupal: technology.toLowerCase().includes('drupal'),
      isActive: opportunity.active === 'Yes',
    };
  }

  private extractTechnology(title: string, naicsCode: string): string {
    const titleLower = title.toLowerCase();
    
    // Technology keyword mapping
    if (titleLower.includes('drupal')) return 'Drupal';
    if (titleLower.includes('wordpress')) return 'WordPress';
    if (titleLower.includes('react') || titleLower.includes('javascript') || titleLower.includes('web app')) return 'React';
    if (titleLower.includes('python') || titleLower.includes('django')) return 'Python';
    if (titleLower.includes('java') || titleLower.includes('spring')) return 'Java';
    if (titleLower.includes('php') || titleLower.includes('laravel')) return 'PHP';
    if (titleLower.includes('angular')) return 'Angular';
    if (titleLower.includes('vue')) return 'Vue.js';
    if (titleLower.includes('.net') || titleLower.includes('c#')) return '.NET';
    
    // NAICS code-based technology mapping
    if (naicsCode?.startsWith('541511')) return 'Software Development'; // Custom Computer Programming Services
    if (naicsCode?.startsWith('541512')) return 'System Design'; // Computer Systems Design Services
    if (naicsCode?.startsWith('518210')) return 'Web Services'; // Data Processing, Hosting, and Related Services
    
    // Default based on common web development terms
    if (titleLower.includes('website') || titleLower.includes('web') || titleLower.includes('portal')) {
      return 'Web Development';
    }
    
    return 'Technology Services';
  }

  private determineOrgType(fullParentPathName: string): string {
    const orgPath = fullParentPathName.toLowerCase();
    
    if (orgPath.includes('education') || orgPath.includes('university') || orgPath.includes('school')) {
      return 'Education';
    }
    if (orgPath.includes('health') || orgPath.includes('medical') || orgPath.includes('hospital')) {
      return 'Healthcare';
    }
    if (orgPath.includes('defense') || orgPath.includes('army') || orgPath.includes('navy') || orgPath.includes('air force')) {
      return 'Defense';
    }
    
    return 'Government';
  }

  private extractLocation(opportunity: SamGovOpportunity): string {
    const pop = opportunity.data?.placeOfPerformance;
    const office = opportunity.data?.officeAddress;
    
    if (pop?.city?.name && pop?.state?.name) {
      return `${pop.city.name}, ${pop.state.name}`;
    }
    if (office?.city && office?.state) {
      return `${office.city}, ${office.state}`;
    }
    
    return 'Washington, DC'; // Default for federal opportunities
  }

  private extractOrganization(fullParentPathName: string): string {
    // Extract the main department/agency name
    const parts = fullParentPathName.split('.');
    return parts[0]?.trim() || 'Federal Agency';
  }

  private generateGovWebsite(fullParentPathName: string): string {
    const orgName = this.extractOrganization(fullParentPathName).toLowerCase();
    
    // Common government website patterns
    if (orgName.includes('education')) return 'https://www.ed.gov';
    if (orgName.includes('health')) return 'https://www.hhs.gov';
    if (orgName.includes('defense')) return 'https://www.defense.gov';
    if (orgName.includes('homeland')) return 'https://www.dhs.gov';
    if (orgName.includes('commerce')) return 'https://www.commerce.gov';
    if (orgName.includes('agriculture')) return 'https://www.usda.gov';
    if (orgName.includes('interior')) return 'https://www.doi.gov';
    if (orgName.includes('justice')) return 'https://www.justice.gov';
    if (orgName.includes('labor')) return 'https://www.dol.gov';
    if (orgName.includes('state')) return 'https://www.state.gov';
    if (orgName.includes('treasury')) return 'https://www.treasury.gov';
    if (orgName.includes('veterans')) return 'https://www.va.gov';
    if (orgName.includes('transportation')) return 'https://www.transportation.gov';
    if (orgName.includes('energy')) return 'https://www.energy.gov';
    if (orgName.includes('housing')) return 'https://www.hud.gov';
    if (orgName.includes('gsa') || orgName.includes('general services')) return 'https://www.gsa.gov';
    
    return 'https://www.usa.gov'; // Default government website
  }

  private estimateBudget(naicsCode: string, type: 'min' | 'max'): number {
    // Budget estimation based on NAICS codes and typical government contract values
    const baseAmounts: Record<string, { min: number; max: number }> = {
      '541511': { min: 100000, max: 500000 }, // Custom Programming
      '541512': { min: 200000, max: 1000000 }, // Systems Design
      '518210': { min: 150000, max: 750000 }, // Web Services
      'default': { min: 75000, max: 300000 }
    };

    const amounts = baseAmounts[naicsCode] || baseAmounts['default'];
    return amounts[type];
  }

  private addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }
}