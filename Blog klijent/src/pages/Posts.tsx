import { useLoaderData } from "react-router-dom";
import { postService } from "../api/post.service";
import PostList from "../components/blog/PostList";
import { Post } from "../models/Post";

export default function PostsPage()
{
    const data = useLoaderData() as { posts: Post[] };

    return (
        <PostList posts={data.posts}/>
    );
}

export async function loader()
{
    const posts = await postService.getPosts();
    return posts;
}