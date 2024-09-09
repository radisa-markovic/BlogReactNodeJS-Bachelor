import PostForm from "../components/blog/PostForm";

export default function NewPostPage()
{
    return (
        <>
            <h1 className="text--center">
                New post page
            </h1>
            <PostForm method="POST"/>
        </>
    );
}