export interface Request {
    id: number;
    title: string;
    category: string;
    credits: number;
    description: string | null;
    image?: string;
    status: 'pending' | 'accepted' | 'closed';
    from?: string;
    to?: string;
}