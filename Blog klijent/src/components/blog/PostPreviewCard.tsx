import { ActionFunctionArgs, json, Link, useFetcher } from "react-router-dom";

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
            <div className="drzac-slike">
                <img 
                    src={DEV_API_ROOT + "/" + coverImageUrl} 
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
                <time className={styles.creationDate}>
                    { createdAt }
                </time>
                <p className={styles.shortDescription}>
                    { description }
                </p>
                <h3 className={styles.postAuthor}>
                    <i>Napisao:</i> { user.username }
                </h3>
            </header>
            <div className="container">
                <Link 
                    to={`/post/${id}`} 
                    className={styles.objava__procitaj_celu}
                >
                    Pročitaj celu objavu
                </Link>
                <br/>
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
            </div>
            <ul className="container">
                <li>
                    Lajkovi: { likeCount }
                </li>
                <li>
                    Dislajkovi: { dislikeCount }
                </li>
                <li>
                    Komentari: { commentCount }
                </li>
            </ul>
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