import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { useLocation } from "react-router-dom";

import FormError from "../FormError";
import { Tag } from "../../models/Tag.refactor";
import { Post } from "../../models/Post-refactor";
import { validatePost } from "../../validators/Post";

export interface PasusMeta
{
    redniBroj: number,
    podnaslov: string,
    sadrzaj: string,
    vrstaPasusa: string
}

interface PostProps
{
    accessToken: string,
    userData: {
        username: string,
        id: number
    }
}

const NapisiObjavu: React.FC<PostProps> = ({
    accessToken,
    userData
}) => {
    const [title, setTitle] = useState<string>('');
    const [titleError, setTitleError] = useState<string>('');

    const [description, setDescription] = useState<string>('');
    const [descriptionError, setDescriptionError] = useState<string>('');

    const [content, setContent] = useState<string>('');
    const [contentError, setContentError] = useState<string>('');

    const [coverImage, setCoverImage] = useState<File | null>(null);
    const [coverImageError, setCoverImageError] = useState<string>('');

    const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);

    const [tags, setTags] = useState<Tag[]>([]);
    const [chosenTagIds, setChosenTagIds] = useState<number[]>([]);

    const history = useHistory();
    const { id } = useParams<{id: string}>();
    const { search } = useLocation();

    const isEditMode: boolean = new URLSearchParams(search).get("edit") === "true"? true: false;
    const isCreationMode: boolean = id? false : true; 

    useEffect(() => {
        if(id)
        {
            fetch("http://localhost:3002/posts/" + id)
                .then((response) => response.json())
                .then((jsonResponse: {message: string, post: Post, OP: any}) => {
                    setTitle(jsonResponse.post.title);
                    setDescription(jsonResponse.post.description);
                    setContent(jsonResponse.post.content);
                    setCoverImageUrl(jsonResponse.post.coverImageUrl);
                })
                .catch(error => console.log(error));
        }

        const tag_url: string = "http://localhost:3002/tags";
        fetch(tag_url, {
            headers: {
                'Authorization': "Bearer " + accessToken
            }
        })
            .then((response) => response.json())
            .then((jsonResponse) => {
                setTags(jsonResponse.tags)
            })
    }, []);

    const onTagCheck = (tagCheckbox: HTMLInputElement, tag: Tag) => {
        /**yes, you can pass 2nd argument in event handler */
        /**==> first it checks in/out, then handler does its job */
        if(tagCheckbox.checked)
        {
            setChosenTagIds([
                ...chosenTagIds,
                tag.id
            ]);
        }
        else
        {
            setChosenTagIds(chosenTagIds.filter((chosenTagIds) => chosenTagIds !== tag.id));
        }
        //possible bug, it shows the previous array
        console.log(chosenTagIds);
    }
    
    const createPost = async () => {
        const new_post_api = "http://localhost:3002/posts/create";
        setTitleError('');
        setDescriptionError('');
        setContentError('');
        setCoverImageError('');

        const validationErrors = validatePost({
            title,
            description,
            content,
            coverImage
        });

        if(validationErrors.errorsExist)
        {
            if(validationErrors.titleError && validationErrors.titleError !== '')
                setTitleError(validationErrors.titleError);
    
            if(validationErrors.descriptionError && validationErrors.descriptionError !== '')
                setDescriptionError(validationErrors.descriptionError);
    
            if(validationErrors.contentError && validationErrors.contentError !== '')
                setContentError(validationErrors.contentError)
    
            if(validationErrors.coverImageError && validationErrors.coverImageError !== '')
                setCoverImageError(validationErrors.coverImageError)
        }
        else
        {
            const formData = new FormData();
            formData.append("title", title);
            formData.append("description", description);
            formData.append("content", content);
            formData.append('userId', userData.id.toString());
            formData.append("coverImage", coverImage!);
            formData.append("tags", chosenTagIds.toString());
    
            const request: RequestInit = {
                headers: {
                    "Authorization": "Bearer " + accessToken
                },
                method: "POST",
                // mode: 'cors',
                body: formData
            };
            
            const response = await fetch(new_post_api, request);
            if(response.status === 401)
            {
                alert("Not authorized to post");
            }
            const jsonResponse = await response.json();
            history.push("/sveObjave");
        }        
    }

    return (
        <main className="objava container donja-margina-potomci">
            {
                isCreationMode
                ?
                <form>
                    <div>
                        {
                            coverImageError !== '' &&
                            <FormError errorText={coverImageError} />
                        }
                        <img 
                            src={coverImage? URL.createObjectURL(coverImage) : '' } 
                            alt="" 
                        />
                        <label htmlFor="" style={{fontSize: '16px'}}>
                            Naslovna fotografija
                        </label>
                        <input 
                            type="file" 
                            name="coverImageInput" 
                            id="coverImageInput" 
                            accept=".jpg, .jpeg, .png"
                            onChange={({target}) => setCoverImage(target.files && target.files[0])}
                        />
                    </div>
                    <div>
                        {
                            titleError !== '' &&
                            <FormError errorText={titleError} />
                        }
                        <label style={{fontSize: '16px'}}>
                            Naslov:
                        </label>
                        <input 
                            type="text"
                            className="kontrola" 
                            placeholder="Naslov"
                            name="naslov"
                            onChange={({target}) => setTitle(target.value)}
                            value={title}
                            required
                        />
                    </div>
                    <div>
                        {
                            descriptionError !== '' &&
                            <FormError errorText={descriptionError} />
                        }
                        <label htmlFor="" style={{fontSize: '16px'}}>
                            Kratak opis
                        </label>
                        <input 
                            type="text"
                            className="kontrola" 
                            placeholder="Kratak opis"
                            name="kratakOpis"
                            onChange={({target}) => setDescription(target.value)}
                            value={description}
                        /> 
                    </div>

                    <div>
                        <label 
                            htmlFor="tagsArea"
                            style={{fontSize: '16px'}}
                        >
                            Tagovi:
                        </label>
                        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr', gap: '15px'}}>
                            {
                                tags.length === 0 
                                ? 
                                <p style={{fontSize:'16px'}}>No tags</p>
                                :    
                                tags.map((tag) => (
                                    <div key={"tag--><><" + tag.name}>
                                        <input 
                                            type="checkbox" 
                                            name={"tagName" + tag.name} 
                                            id={"tag--" + tag.id} 
                                            onChange={({target}) => onTagCheck(target, tag)}
                                        />
                                        <label 
                                            htmlFor={"tag--" + tag.id}
                                            style={{fontSize: '16px'}}
                                        >
                                            { tag.name }
                                        </label>
                                    </div>
                                ))
                            }
                        </div>
                    </div>

                    <div>
                        <label style={{fontSize: '16px'}}>
                            Sadržaj:
                        </label>
                        <br/>
                        <textarea 
                            name="content" 
                            id="content"
                            style={{
                                fontSize: '16px'
                            }}
                            onChange={({target}) => setContent(target.value)}
                            value={content}
                        ></textarea>
                    </div>

                    <button 
                        type="button"
                        onClick={createPost}
                    >
                        Napravi objavu
                    </button>
                </form>
                :
                <article>
                    <div>
                        <img src={coverImageUrl? "http://localhost:3002/" + coverImageUrl : ''} alt="" />
                    </div>
                    <h1>
                        { title }
                    </h1>
                    <h2 className="objava__naslov">
                        { description }
                    </h2>
                    <div style={{fontSize: '16px'}}>
                        { content }
                    </div>
                </article>
            }
        </main>
    );
}

export default NapisiObjavu;