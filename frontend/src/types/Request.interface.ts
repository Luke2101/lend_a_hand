export interface Request {
    id: number;
    title: string;
    category: string;
    credits: number;
    description: string | null;
    creator?: string;
    accepted_by: string | null;
    from?: string;
    to?: string;
    prename?: string;
}