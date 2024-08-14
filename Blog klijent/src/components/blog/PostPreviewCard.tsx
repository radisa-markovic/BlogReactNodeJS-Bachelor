import React, { FC } from "react";
import { Link } from "react-router-dom";

import { Post } from "../../models/Post-refactor";

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
        <article className="objava__pregled donja-margina-potomci">
            <div className="drzac-slike">
                <img 
                    src={"http://localhost:3002/" + coverImageUrl} 
                    alt="" 
                    width={245}
                    height={245}
                    loading="lazy"
                />
            </div>
            <header className="objava__header container">
                <h2 className="objava__naslov">
                    <Link 
                        to={`/objava/${id}`}
                        className="objava__procitaj-celu"
                    >
                        { title }
                    </Link>
                </h2>
                <time className="objava__datum-pisanja">
                    { createdAt }
                </time>
                <p className="objava__kratak-opis">
                    { description }
                </p>
                <h3 className="objava__autor">
                    <i>Napisao:</i> { user.username }
                </h3>
            </header>
            <Link 
                to={`/post/${id}`} 
                className="objava__procitaj-celu"
            >
                Pročitaj celu objavu
            </Link>
        </article>       
    );
}

export default PostPreviewCard;