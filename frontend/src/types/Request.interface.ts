export interface Request {
    id: number;
    title: string;
    category: string;
    credits: number;
    description: string | null;
    accepted_by: string | null;
    from?: string;
    to?: string;
    city: string;
    plz: number;
    prename?: string;
}