import { param, body, ValidationChain, query } from 'express-validator';
import User from '../models/user';

const MINIMAL_TITLE_LENGTH: number = 2;
const MINIMAL_DESCRIPTION_LENGTH: number = 2;
const MINIMAL_CONTENT_LENGTH: number = 2;

export const validateGetPosts = (): ValidationChain => {
    return query('date')
        .optional()
        .not()
        .isArray()
}

export const validateId = (): ValidationChain => {
    return param('postId')
        .trim()
        .notEmpty()
        .isNumeric();
}

export const validatePost = (): ValidationChain[] => {
    return [
        body('title')
            .trim()
            .exists()
            .isString()
            .isLength({min: MINIMAL_TITLE_LENGTH})
            .withMessage("The title is too short, must be at least 2 characters long"),
        body('description')
            .trim()
            .exists()
            .isString()
            .isLength({min: MINIMAL_DESCRIPTION_LENGTH})
            .withMessage("Description must be at least 2 characters long"),
        body('content')
            .trim()
            .exists()
            .isString()
            .isLength({min: MINIMAL_CONTENT_LENGTH})
            .withMessage("Content must be at least two characters long"),
        body('userId')
            .trim()
            .exists()
            .withMessage("No user id provided")
            .custom(async (userId) => {
                const user = await User.findByPk(userId);
                if(!user)
                    throw new Error('User with given id not found')
            }),
        // body('coverImage')
        //     .exists()
        //     .withMessage("No image provided")
    ];
}