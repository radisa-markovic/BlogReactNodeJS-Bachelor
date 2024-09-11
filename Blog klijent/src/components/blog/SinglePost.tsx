import { ActionFunctionArgs, json, useFetcher, useRouteLoaderData } from 'react-router-dom';

import styles from './SinglePost.module.css';
import { Post } from '../../models/Post';
import { authProvider } from '../../api/auth';
import { DEV_API_ROOT } from '../../api/config';

export function SinglePost()
{
    const data = useRouteLoaderData('single-post') as { 
        message: string, 
        post: Post
    };
    const fetcher = useFetcher();
    const { data : fetcherData } = fetcher;
    console.log(fetcherData);

    return (
        <main className="objava__holder container">
            <article className="objava__cela">
                <h1 className="objava__naslov">
                    { data.post.title }
                </h1>
                <div>
                    <img src={"http://localhost:3002/" + data.post.coverImageUrl} alt="" />
                </div>
                <h2>
                    { data.post.description }
                </h2>
                <div style={{fontSize: '20px'}}>
                    { data.post.content }
                </div>
            </article>

            <section>
                <h2>Reakcije</h2>
                <ul>
                    <li>
                        <fetcher.Form
                            method='POST'
                            action={`/post/${data.post.id}/like`}
                        >
                            <button type="submit" style={{backgroundColor: 'green', color: 'white'}}>
                                Lajkuj
                            </button>
                        </fetcher.Form>
                        <span>Lajkovi: { data.post.likeCount }</span>
                    </li>
                    <li>
                        <fetcher.Form
                            method='POST'
                            action={`/post/${data.post.id}/dislike`}
                        >
                            <button type="submit" style={{backgroundColor: 'red', color: 'white'}}>
                                Dislajkuj
                            </button>
                        </fetcher.Form>
                        <span>Dislajkovi: { data.post.dislikeCount }</span>
                    </li>
                </ul>
            </section>

            <section className="objava__odeljak-komentara">
                <h2>Komentari</h2>
                <fetcher.Form
                    method='POST'
                    action={`/comment/${data.post.id}/add`}
                >
                    <label 
                        htmlFor="add-comment"
                        className={styles['add-comment-label']}
                    >
                        Napiši komentar
                    </label>
                    <textarea 
                        name="content" 
                        className={styles['add-comment']} 
                        id="add-comment"
                    >
                    </textarea>
                    <button 
                        className="button--primary"
                        type='submit'
                    >
                        Potvrdi komentar
                    </button>
                </fetcher.Form>
                <ul className={styles.comments}>
                    {
                        data.post.comments.length > 0
                        ? data.post.comments.map((comment) => (
                            <li 
                                key={"comment-id" + comment.id}
                                className={styles.comment}
                            >
                                <p>{comment.content}</p>
                                <i>Authors' user id: {comment.user.username}</i>
                                <time>
                                    {comment.createdAt}
                                </time>
                            </li>
                        ))
                        : <p>This post has no comments</p>
                    }
                </ul>
            </section>
        </main>
    );
}
export default SinglePost;

export async function action({ request, params }: ActionFunctionArgs)
{
    const formData = await request.formData();
    const content = formData.get('content');    
    const commentErrors: Record<string, string> = {};

    if(!content || content.toString().length < 1)
        commentErrors.commentToShort = "Komentar mora biti dugačak bar 1 karakter.";

    if(Object.keys(commentErrors).length > 0)
        return commentErrors;

    const apiRequest: RequestInit = {
        headers: {
            'Authorization': 'Bearer ' + authProvider.accessToken,
            // "Content-Type": "application/json; utf-8"
            //for whatever reason it works in lower caps, but not in upper
            // "content-type": "application/json"
            //seemingly '; utf-8' kept breaking the api
            //though I seemingly remember it not working even without it...
            "Content-Type": "application/json"
        },
        method: "POST",
        credentials: "include",
        mode: 'cors',
        body: JSON.stringify({
            //@ts-ignore
            userId: authProvider.userData.id,
            postId: params.postId!,
            content: content
        })
    };
    try
    {
        const response = await fetch(DEV_API_ROOT + "/comments/add", apiRequest);

        if(!response.ok)
        {
            throw json(response, { status: response.status });
        }

        alert("Comment added");
        return null;
    }
    catch(error)
    {
        throw error;
    }
}

export async function likePost({ request, params}: ActionFunctionArgs)
{
    const postId = params.id;
    if(!postId) return;

    const apiRequest: RequestInit = {
        headers: {
            'Authorization': 'Bearer ' + authProvider.accessToken,
            'Content-type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify({
            code: 0,
            postId: postId,
            userId: authProvider.userData?.id
        })
    };

    try
    {
        const response = await fetch(`${DEV_API_ROOT}/posts/addReaction/${postId}`, apiRequest);
        if(!response.ok)
            throw json(response, { status: response.status });
        
        //ne znam da li ovde da neutralizujem, ili u nekom exceptionu
        return null;
    }
    catch(error: any)
    {
        console.error(error);
        throw json(error, { status: error.status })
    }
}

export async function dislikePost({ request, params}: ActionFunctionArgs)
{
    const postId = params.id;
    if(!postId) return;

    const apiRequest: RequestInit = {
        headers: {
            'Authorization': 'Bearer ' + authProvider.accessToken,
            'Content-type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify({
            code: 1,
            postId: postId,
            userId: authProvider.userData?.id
        })
    };

    try
    {
        const response = await fetch(`${DEV_API_ROOT}/posts/addReaction/${postId}`, apiRequest);
        if(!response.ok)
            throw json(response, { status: response.status });
        
        //ne znam da li ovde da neutralizujem, ili u nekom exceptionu
        return null;
    }
    catch(error: any)
    {
        console.error(error);
        throw json(error, { status: error.status })
    }
}