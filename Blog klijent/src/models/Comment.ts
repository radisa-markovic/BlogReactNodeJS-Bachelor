export interface Comment
{
    id: number,
    content: string,
    createdAt: string,
    updatedAt: string,
    user: {
        username: string
    }
}