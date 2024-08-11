export interface Post
{
    id: number;
    title: string;
    description: string;
    content: string;
    coverImageUrl: string;
    createdAt: string;
    updatedAt: string;
    user: {
        id: number;
        username: string
    }
}