import { Router } from "express";
import { checkJwt } from "../middleware/jwtAuth";
import Comment from "../models/comment";

const router = Router();

router.post(
    "/add", 
    // checkJwt,
    async (request, response, next) => {
        const postId = +request.body.postId;
        const userId = +request.body.userId;
        const content = request.body.content;

        try
        {
            await Comment.create({
                postId,
                userId,
                content
            });

            return response.status(201).json({
                message: "Comment successfully added"
            });
        }
        catch(error)
        {
            console.log(error);
            return response.status(500).json({
                message: "Could not add comment to that post"
            });
        }
    }
);

export default router;