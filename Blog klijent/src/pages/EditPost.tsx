import { json, LoaderFunctionArgs, useRouteLoaderData } from "react-router-dom";

import PostForm from "../components/blog/PostForm";
import { DEV_API_ROOT } from "../api/config";
import { Post } from "../models/Post";

export default function EditPostPage()
{
    const data = useRouteLoaderData('single-post') as { 
        message: string, 
        post: Post
    };

    return (
        <>
            <h1 className="text--center">
                Edit post page
            </h1>
            <PostForm post={data.post} method="PATCH"/>
        </>
    );
}

export async function loader({ params }: LoaderFunctionArgs)
{
    const postId = params.postId;
    const response = await fetch(`${DEV_API_ROOT}/posts/${postId}`);
    if(!response.ok)
    {
        throw json(response, { status: response.status });
    }
    else
    {
        return response;
    }
}