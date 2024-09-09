import { json, LoaderFunctionArgs } from "react-router-dom";
import { postService } from "../api/post.service";
import PostForm, { CONTENT_FORM_KEY, COVER_IMAGE_FORM_KEY, DESCRIPTION_FORM_KEY, PostErrors, TITLE_FORM_KEY } from "../components/blog/PostForm";

import { authProvider } from "../api/auth";
import { DEV_API_ROOT } from "../api/config";

export default function NewPostPage()
{
    return (
        <>
            <h1 style={{textAlign: 'center'}}>
                New post page
            </h1>
            <PostForm/>
        </>
    );
}

export async function action({ request }: LoaderFunctionArgs)
{
    const formData = await request.formData();
    //basic validation
    const postErrors: PostErrors = {};
    const coverImage = formData.get(COVER_IMAGE_FORM_KEY);
    const title: string | undefined = formData.get(TITLE_FORM_KEY)?.toString();
    const description: string | undefined = formData.get(DESCRIPTION_FORM_KEY)?.toString();
    const content: string | undefined = formData.get(CONTENT_FORM_KEY)?.toString();
    
    if(!coverImage)
        postErrors.coverImageError = "Cover image must be present";
    if(!title || title?.trim().length < 4)
        postErrors.titleError = "Title must have at least 4 characters";
    if(!description || description.trim().length < 4)
        postErrors.descriptionError = "Description must have at least 4 characters";
    if(!content || content.trim().length < 4)
        postErrors.contentError = "Content must have at least 4 characters";

    if(Object.keys(postErrors).length > 0)
        return postErrors;

    //@ts-ignore
    formData.append("userId", authProvider.userData?.id);
    //otherwise do the api call
    try
    {
        // const data = await postService.createPost(newPost);
        const request: RequestInit = {
            headers: {
                "Authorization": "Bearer " + authProvider.accessToken,
            },
            method: "POST",
            //@ts-ignore
            body: formData,
        };
            
        const response = await fetch(DEV_API_ROOT + "/posts/create", request);
        if(!response.ok)
        {
            const jsonResponse = await response.json();
            console.log(jsonResponse);
            throw json({
                message: jsonResponse.message
            }, { 
                status: response.status 
            });
        }
        
        return json(response);
    }
    catch(error)
    {
        console.error(error);
        throw error;
    }
}