import { useState } from "react";
import { 
    Form, 
    LoaderFunctionArgs, 
    redirect, 
    useActionData 
} from "react-router-dom";

import styles from './PostForm.module.css';

import FormError from "../FormError";
import { Post } from "../../models/Post-refactor";
import { validatePost } from "../../validators/Post";
import { authProvider } from "../../api/auth";
import { postService } from "../../api/post.service";

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

export interface Post__InPlace
{
    coverImage: string, //maybe a file?
    title: string,
    description: string,
    content: string    
}

interface OptionalProp
{
    post?: Post__InPlace
}

const PostForm: React.FC<OptionalProp> = ({ post }) => {
    const actionData = useActionData() as PostErrors;
    const [coverImage, setCoverImage] = useState<File | null>(null);

    return (
        <main className="objava container donja-margina-potomci">
            <Form
                method="POST"
                encType="multipart/form-data"/**==> required for multer to work */
            >
                <div>
                    {
                        actionData?.coverImageError &&
                        <FormError errorText={actionData?.coverImageError} />
                    }
                    <img 
                        src={coverImage? URL.createObjectURL(coverImage) : '' } 
                        alt="" 
                    />
                    <label htmlFor="" className={styles.label}>
                        Naslovna fotografija
                    </label>
                    <input 
                        type="file" 
                        style={{fontSize: '16px', marginLeft: '10px'}}
                        name={COVER_IMAGE_FORM_KEY} 
                        id="coverImageInput" 
                        accept=".jpg, .jpeg, .png"
                        onChange={({target}) => setCoverImage(target.files && target.files[0])}
                        defaultValue={post && post.coverImage}
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
                    Napravi objavu
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



export default PostForm;