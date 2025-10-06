export interface Ad {
    id: string;
    title: string;
    description: string;
    category: 'electronics' | 'vehicles' | 'real-estate' | 'services';
    price: number;
    location: string;
    status: 'active' | 'pending';
    comments: Comment[];
    createdAt: Date;
}

export interface Comment {
    id: string;
    text: string;
    author: string;
    createdAt: Date;
}

export type Filter = {
    category?: string;
    location?: string;
    minPrice?: number;
    maxPrice?: number;
    status?: string;
    search?: string;
};