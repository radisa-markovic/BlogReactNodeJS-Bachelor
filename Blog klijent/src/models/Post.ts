import { Comment } from "./Comment";

export interface Post
{
    id: number;
    coverImageUrl: string;
    title: string;
    description: string;
    content: string;
    likeCount: number;
    dislikeCount: number;
    commentCount: number;
    createdAt: string;
    updatedAt: string;
    user: {
        id: number;
        username: string
    },
    comments: Comment[],
}