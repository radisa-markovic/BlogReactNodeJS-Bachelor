export interface Post
{
    id: number;
    coverImageUrl: string;
    title: string;
    description: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    user: {
        id: number;
        username: string
    }
}