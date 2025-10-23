export type SRequest = {
    id: number;
    title: string;
    category: string;
    credits: number;
    description?: string;
    from?: string;
    to?: string;
}