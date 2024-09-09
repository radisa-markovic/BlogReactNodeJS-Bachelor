import { json, LoaderFunctionArgs, useRouteLoaderData } from "react-router-dom";
import { postService } from "../api/post.service";
import PostForm, { Post__InPlace } from "../components/blog/PostForm";
import { DEV_API_ROOT } from "../api/config";

export default function EditPostPage()
{
    const data = useRouteLoaderData('single-post') as { op: any, message: string, post: any };
    console.log(data.post)

    return (
        <>
            <h1 style={{textAlign: 'center'}}>
                Edit post page
            </h1>
            <PostForm post={data.post}/>
        </>
    );
}

export async function loader({ request, params }: LoaderFunctionArgs)
{
    const postId = params.postId;
    const response = await fetch(DEV_API_ROOT + "/posts/" + postId);
    if(!response.ok)
    {
        throw json(response, { status: response.status });
    }
    else
    {
        return response;
    }
    // return json(loadedPost);
}