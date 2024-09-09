import { useState } from "react";
import { 
    Form, 
    json, 
    LoaderFunctionArgs, 
    redirect, 
    useActionData 
} from "react-router-dom";

import styles from './PostForm.module.css';

import FormError from "../FormError";
import { Post } from "../../models/Post";
import { authProvider } from "../../api/auth";
import { DEV_API_ROOT, PLACEHOLDER_COVER_IMAGE } from "../../api/config";

export const TITLE_FORM_KEY: string = 'title';
export const DESCRIPTION_FORM_KEY: string = 'description';
export const CONTENT_FORM_KEY: string = 'content';
export const COVER_IMAGE_FORM_KEY: string = 'coverImage';

export interface PostErrors
{
    titleError?: string;
    descriptionError?: string;
    contentError?: string;
    coverImageError?: string;
    otherError?: string;
};

interface OptionalProp
{
    post?: Post,
    method: "POST" | "PATCH"
}

const PostForm: React.FC<OptionalProp> = ({ post, method }) => {
    const actionData = useActionData() as PostErrors;
    const [coverImage, setCoverImage] = useState<File | null>(null);

    return (
        <main className="objava container donja-margina-potomci">
            <Form
                method={method}
                encType="multipart/form-data"/**==> required for multer to work */
            >
                <div>
                    {
                        actionData?.coverImageError &&
                        <FormError errorText={actionData?.coverImageError} />
                    }
                    <img 
                        src={
                            coverImage
                            ? URL.createObjectURL(coverImage) 
                            : DEV_API_ROOT + "/" + (post && post?.coverImageUrl || PLACEHOLDER_COVER_IMAGE) 
                        } 
                        alt="" 
                    />
                    <label htmlFor="coverImageInput" className={styles.label}>
                        Naslovna fotografija
                    </label>
                    <input 
                        type="file" 
                        style={{fontSize: '16px', marginLeft: '10px'}}
                        name={COVER_IMAGE_FORM_KEY} 
                        id="coverImageInput" 
                        accept=".jpg, .jpeg, .png"
                        onChange={({target}) => setCoverImage(target.files && target.files[0])}
                    />
                </div>
                <div>
                    {
                        actionData?.titleError &&
                        <FormError errorText={actionData.titleError} />
                    }
                    <label className={styles.label}>
                        Naslov:
                    </label>
                    <input 
                        type="text"
                        className={styles.kontrola} 
                        name={TITLE_FORM_KEY}
                        required
                        defaultValue={post && post.title}
                    />
                </div>
                <div>
                    {
                        actionData?.descriptionError &&
                        <FormError errorText={actionData.descriptionError} />
                    }
                    <label htmlFor="" className={styles.label}>
                        Kratak opis:
                    </label>
                    <input 
                        type="text"
                        className={styles.kontrola} 
                        name={DESCRIPTION_FORM_KEY}
                        defaultValue={post && post.description}
                    /> 
                </div>
                <div>
                    <label className={styles.label}>
                        Sadržaj:
                    </label>
                    {
                        actionData?.contentError &&
                        <FormError errorText={actionData.contentError} />
                    }
                    <br/>
                    <textarea 
                        name={CONTENT_FORM_KEY} 
                        id="content"
                        className={styles.textarea}
                        rows={9}
                        defaultValue={post && post.content}
                    ></textarea>
                </div>

                <button 
                    type="submit"
                    className={styles.submitButton}
                >
                    { method === "POST" ? "Napravi" : "Izmeni" } objavu
                </button>
            </Form>
        </main>
    );
}

export function newPostLoader()
{
    if(!authProvider.accessToken)
    {
        return redirect("/");
    }

    return null;
}

export async function action({ request, params }: LoaderFunctionArgs)
{
    const formData = await request.formData();
    const method = request.method;
    const postId = params.postId;
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
            method: method,
            //@ts-ignore
            body: formData,
        };
        
        let apiRequestUrl = DEV_API_ROOT + "/posts";
        if(method === "POST")
        {
            apiRequestUrl += "/create";
        }

        if(method === "PATCH")
        {
            apiRequestUrl += "/" + postId;
        }

        const response = await fetch(apiRequestUrl, request);
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

        if(method === "POST")
            alert("New post created");
        else
            alert("Post with id: " + postId + " updated");

        redirect("/posts");        
        return json(response);
    }
    catch(error)
    {
        throw error;
    }
}



export default PostForm;