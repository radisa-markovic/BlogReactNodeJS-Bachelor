import { ActionFunctionArgs, json, Link, NavLink, useFetcher } from "react-router-dom";

import styles from './PostPreviewCard.module.css';
import { Post } from "../../models/Post";
import { DEV_API_ROOT } from "../../api/config";
import { authProvider } from "../../api/auth";

const PostPreviewCard: React.FC<{post:Post}> = (props) => {
    const {
        id,
        title,
        description,
        coverImageUrl,
        createdAt,
        user,
        commentCount,
        likeCount,
        dislikeCount
    } = props.post;
    const fetcher = useFetcher();

    return(
        <article className={styles.objava__pregled + " donja-margina-potomci"}>
            <NavLink to={`/posts/${id}`}>
                <div className="drzac-slike">
                    <img 
                        // src={DEV_API_ROOT + "/" + coverImageUrl} 
                        src={coverImageUrl} 
                        alt="" 
                        width={245}
                        height={245}
                        loading="lazy"
                    />
                </div>
                <header className="objava__header container">
                    <h2 className={styles.objava__naslov}>
                        <Link 
                            to={`/post/${id}`}
                            className={styles.objava__procitaj_celu}
                        >
                            { title }
                        </Link>
                    </h2>
                    
                    <p className={styles.shortDescription}>
                        { description }
                    </p>
                    <h3 className={styles.postAuthor}>
                        <i>Napisao:</i> { user.username }
                    </h3>
                </header>
                <div className="container">
                    {
                        authProvider.accessToken && (
                            <>
                                <Link 
                                    to={`/post/${id}/edit`}
                                    className={styles.objava__procitaj_celu}
                                >
                                    Izmeni
                                </Link>
                                <br/>
                                <fetcher.Form
                                    method="DELETE"
                                    action={`/post/${id}/delete`}
                                >
                                    <button 
                                        type="submit"
                                        style={{fontSize: '20px', backgroundColor: 'red', color: 'white'}}
                                    >
                                        Obrisi
                                    </button>
                                </fetcher.Form>
                            </>
                        )
                    }
                </div>
                <time className={styles.creationDate + " container"}>
                    { createdAt }
                </time>
                <ul 
                    className="container"
                    style={{
                        display: 'flex',
                        gap: '15px'
                    }}
                >
                    <li>
                        <i className="fa-solid fa-thumbs-up" aria-hidden="true"></i>: { likeCount }
                    </li>
                    <li>
                        <i className="fa-solid fa-thumbs-down"></i>: { dislikeCount }
                    </li>
                    <li>
                        <i className="fa-solid fa-comments"></i>: { commentCount }
                    </li>
                </ul>
            </NavLink>
        </article>       
    );
}

export async function action({ request, params}: ActionFunctionArgs)
{
    const postId = parseInt(params.id!);
    const apiRequest: RequestInit = {
        headers: {
            "Authorization": "Bearer " + authProvider.accessToken,
        },
        method: "DELETE",
    };

    const response = await fetch(`${DEV_API_ROOT}/posts/${postId}`, apiRequest);
    if(!response.ok)
    {
        throw json(response, {status: response.status});
    }

    alert('Successfully deleted post with id: ' + postId);
    return json(response);
}

export default PostPreviewCard;