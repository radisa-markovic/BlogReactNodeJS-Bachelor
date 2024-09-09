import { Link } from "react-router-dom";

import styles from './PostPreviewCard.module.css';
import { Post } from "../../models/Post-refactor";
import { DEV_API_ROOT } from "../../api/config";

const PostPreviewCard: React.FC<{post:Post}> = (props) => {
    const {
        id,
        title,
        description,
        coverImageUrl,
        createdAt,
        updatedAt,
        user
    } = props.post;

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
            <Link 
                to={`/post/${id}`} 
                className={styles.objava__procitaj_celu}
            >
                Pročitaj celu objavu
            </Link>
        </article>       
    );
}

export default PostPreviewCard;