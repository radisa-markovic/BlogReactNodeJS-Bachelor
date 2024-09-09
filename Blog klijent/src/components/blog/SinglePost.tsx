import { useRouteLoaderData } from 'react-router-dom';

import { Post } from '../../models/Post';

export function SinglePost()
{
    const data = useRouteLoaderData('single-post') as { 
        message: string, 
        post: Post
    };

    return (
        <main className="objava__holder container">
            <div>
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
                <section className="objava__odeljak-komentara">
                    <h2>Komentari</h2>
                    {/* <ul className="objava__komentari">
                        { objava.komentari? nacrtajKomentare(): <p>Nema komentara</p> }
                    </ul> */}
                </section>
            </div>
        </main>
    );
}

export default SinglePost;