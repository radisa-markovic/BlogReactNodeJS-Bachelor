import { json, redirect } from "react-router-dom";
import { authProvider } from "./auth";
import { DEV_API_ROOT } from "./config";

interface PostService
{
    getPosts(): any,
    getPost(postId: number): any;
    createPost(newPost: any): any;
    updatePost(id: number, formData: FormData): any;
};

export const postService: PostService = {
    async getPosts()
    {
        const response = await fetch(DEV_API_ROOT + "/posts/");
        if(!response.ok)
        {
            throw json(response, { status: response.status });
        }
        else
        {
            return response;
        }
    },
    async createPost(formData: any)
    {
        const request: RequestInit = {
            headers: {
                "Authorization": "Bearer " + authProvider.accessToken
            },
            method: "POST",
            // mode: 'cors',
            body: formData
        };
            
        const response = await fetch(DEV_API_ROOT + "/posts/create", request);
        if(response.status === 401)
        {
            alert("Not authorized to post");
        }
        const jsonResponse = await response.json();
        return jsonResponse;
        // return redirect("/posts");
    },
    async getPost(postId)
    {    
        const response = await fetch(DEV_API_ROOT + "/posts/" + postId);
        if(!response.ok)
        {
            throw json(response, { status: response.status });
        }
        else
        {
            return response;
        }
    },
    updatePost(id, formData) {
        console.log(id);
    },
};