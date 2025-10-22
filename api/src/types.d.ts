export type SRequest = {
    id: number;
    title: string;
    category: string;
    credits: number;
    description: string | undefined;
    from?: string;
    to?: string;
}