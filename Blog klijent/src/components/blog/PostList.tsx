import { Post } from "../../models/Post";
import PostPreviewCard from "./PostPreviewCard";
import styles from './PostList.module.css';

interface Props
{
    posts: Post[]
}

const PostList: React.FC<Props> = ({ posts }) => {
    return (
        <main className="container">
            <div>
                <h1>Posts</h1> 
                <div>
                    <p style={{fontSize: '16px'}}>
                        Filter (soon):
                    </p>
                </div>
                <div className={styles.grid}>
                    {
                        posts.map((post) => 
                            <PostPreviewCard 
                                post={post}
                                key={"super-unique-post-list-key" + post.id}
                            />
                        )
                    }
                </div>
            </div>
        </main>
    );
}

export default PostList;