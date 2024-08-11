import { Request, Response, NextFunction } from "express";
import { ErrorFormatter, validationResult, ValidationError, FieldValidationError } from 'express-validator';

import Post from '../models/post';
import Comment from "../models/comment";
import User from "../models/user";
import Reaction from "../models/reaction";

export const getPosts = async (request: Request, response: Response, next: NextFunction) => {
    const errors = validationResult(request);

    if(errors.isEmpty())
    {
        try
        {
            const result = await Post.findAll({
                attributes: { 
                    exclude: ['userId'] 
                },
                include:
                {
                    model: User,
                    attributes: ['id', 'username']
                }
            });
            return response.status(200).json({
                posts: result
            });
        }
        catch(error: any)
        {
            if(!error.statusCode)
                error.statusCode = 500;
    
            next(error);
        }
    }
    else
    {
        const error = new Error("Validation failed");
        //@ts-ignore
        error.statusCode = 422;
        throw error;
    }


}

export const addPost = async (request: Request, response: Response, next: NextFunction) => {
    const errors = validationResult(request);

    if(errors.isEmpty())
    {
        const { 
            title, 
            description, 
            content,
            userId
         } = request.body as any;
        const coverImageUrl = request.file!.path; 
        console.group();
            console.log(title);
            console.log(description);
            console.log(content);
            console.log(userId);
            console.log(coverImageUrl);
        console.groupEnd();

        try
        {
            const user = await User.findByPk(userId);
            //@ts-ignore
            await user.createPost({
                title: title,
                description: description,
                content: content,
                coverImageUrl: coverImageUrl,
                userId: userId
            });   
            
            response.status(201).json({
                message: "Post successfully created",
            });
        }
        catch(error: any)
        {
            if(!error.statusCode)
            {
                error.statusCode = 500;
            }
            next(error);
        }
    }
    else
    {
        /**
         * errors: {
         *     title: 'The title is too short',
         *     imageUrl: 'Image is not URL',
         *     ...
         *     content: 'Content is missing'
         * }
         */
        // const formattedError = errors.formatWith((error) => {
        //     return {
        //         [(error as FieldValidationError).path]: (error as FieldValidationError).msg
        //     }
        // });
        response.status(422).json({
            message: "Validation failed",
            errors: errors.array()
        });
    }
}

export const getPost = async (request: Request, response: Response, next: NextFunction) => {
    const { postId } = request.params;
    try
    {
        // const result = await Post.findByPk(postId, { 
        //     include: [
        //         {
        //             model: Comment,
        //             required: true,
        //             include: [User]
        //         }
        //     ] 
        // });
        const result = await Post.findByPk(postId);
        console.log(result);

        if(!result)
        {
            return response.status(404).json({
                message: "No post found"
            });
        }

        response.status(201).json({
            message: "Post found",
            post: result,
            //@ts-ignore
            OP: await result.getUser()
        });
    }
    catch(error: any)
    {
        if(!error.statusCode)
            error.statusCode = 500;

        next(error);
    }
}

export const updatePost = async (request: Request, response: Response, next: NextFunction) => {
    const postId = parseInt(request.params.postId);
    if(Number.isNaN(postId))
    {
        return response.status(422).json({
            message: "Post with given ID not found"
        });
    }

    try
    {
        const errors = validationResult(request);
        if(errors.isEmpty())
        {
            /**
             * the entire post data is always being sent
             * so that I don't have to filter through x amount
             * of properties
             */
            const result = await Post.update({
                title: request.body.title,
                content: request.body.content,
                description: request.body.description,
                coverImageUrl: request.body.coverImageUrl
            }, {
                where: {
                    id: postId
                }
            });

            if(!result)
            {
                return response.status(422).json({
                    message: "Update request failed"
                });
            }

            response.status(201).json({
                message: `Post with id: ${postId} successfully updated.`
            });
        }
        else
        {
            const formattedError = errors.formatWith((error) => {
                return {
                    [(error as FieldValidationError).path]: (error as FieldValidationError).msg
                }
            });
            response.status(422).json({
                message: "Validation failed",
                errors: formattedError.array()
            });
        }
        
    }
    catch(error: any)
    {
        if(!error.statusCode)
            error.statusCode = 500;

        next(error);
    }
}

export const deletePost = async (request: Request, response: Response, next: NextFunction) => {
    const postId = parseInt(request.params.postId);
    if(Number.isNaN(postId))
    {
        return response.status(404).json({
            message: "No such post was found"
        });
    }

    try
    {
        const result = await Post.destroy({
            where: {
                id: postId
            }
        });

        if(!result)
        {
            return response.status(404).json({
                message: "No such post was found"
            });
        }

        console.log("Post with id: " + postId + " was successfully deleted.");
        response.status(201).json({
            message: "Post with id: " + postId + " was successfully deleted."
        });
    }
    catch(error: any)
    {
        if(!error.statusCode)
            error.statusCode = 500;

        response.status(error.statusCode).json({
            message: 'Deletion failed'
        });
    }
}

export const addComment = async (
    request: Request, 
    response: Response, 
    next: NextFunction
) => {
    /**
     * what I receive here from frontend:
     * {
     *  userId
     *  postId,
     *  content
     * }
     */
    const { userId, postId, content } = request.body;
    try
    {
        const post = await Post.findByPk(postId);
        //@ts-ignore
        const potentiallyNewCommentId = await post.createComment({
            content: content,
            userId: userId
        }, {
            where: {
                id: postId
            }
        });

        console.log(potentiallyNewCommentId.dataValues.id);

        response.status(201).json({
            message: "Comment successfully added"
        });
    }
    catch(error)
    {
        next(error);
    }
}

export const addReaction = async (
    request: Request, 
    response: Response, 
    next: NextFunction
) => {
    const { code, postId, userId } = request.body;
    try
    {
        const post = await Post.findByPk(postId);
        if(!post)
        {
            return response.status(404).json({
                message: "No such post found"
            });
        }

        //@ts-ignore
        const existingReaction = await post.getReactions({
            where: {
                userId: userId
            }
        });

        //if i index [0] in getReactions(), it won't work
        //probably due to async stuff, and indexing being sync
        // maybe [existingReaction] = await post.getReactions()?
        if(existingReaction.length === 0)
        {
            //@ts-ignore
            await post.createReaction({
                postId: postId,
                userId: userId,
                code: code
            });

            return response.status(201).json({
                message: "Reaction successfully set"
            });
        }

        if(existingReaction[0].code === code)
        {
            await Reaction.destroy({
                where: {
                    userId: userId,
                    postId: postId
                }
            })
            //@ts-ignore
            // await post.removeComment({
            //     where: {
            //         userId: userId,
            //         postId: postId
            //     }
            // });

            return response.status(200).json({
                message: "Reaction successfully removed"
            });
        }
       
        //@ts-ignore
        // await post.setReactions({
        //     code: code
        // }, {
        //     where: {
        //         postId: postId,
        //         userId: userId
        //     }
        // });

        await Reaction.update({
            code: code
        }, {
            where: {
                postId: postId,
                userId: userId
            }
        });

        return response.status(200).json({
            message: "Response successfully altered"
        });

    }
    catch(error: any)
    {
        if(!error.statusCode)
            error.statusCode = 500;

        next(error);
    }
}