export interface Customer {
    id: string;
    organizationId: string;
    name: string;
    phone: string;
    status: "NEW" | "CONTACTED" | "QUALIFIED" | "CUSTOMER";
    tags: string[];
    notes: string;
    lastMessage: string;
    totalMessages: number;
    lastSeen?: {
        _seconds: number;
        _nanoseconds: number;
    };
}