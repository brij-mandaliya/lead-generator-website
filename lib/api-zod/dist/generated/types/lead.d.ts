import type { LeadUserStatus } from "./leadUserStatus";
export interface Lead {
    id: number;
    companyName: string;
    url?: string | null;
    leadDescription: string;
    personName?: string | null;
    website?: string | null;
    phoneNumber?: string | null;
    linkedinUrl?: string | null;
    userStatus?: LeadUserStatus;
    userNotes?: string | null;
    createdAt: Date;
    updatedAt: Date;
}
//# sourceMappingURL=lead.d.ts.map