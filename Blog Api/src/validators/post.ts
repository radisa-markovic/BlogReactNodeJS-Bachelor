import { param, body, ValidationChain } from 'express-validator';

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
            .isLength({min: 2})
            .withMessage("The title is too short, must be at least 2 characters long"),
        body('description')
            .trim()
            .exists()
            .isString()
            .isLength({min: 2})
            .withMessage("Description must be at least 2 characters long"),
        body('content')
            .trim()
            .exists()
            .isString()
            .isLength({min: 2})
            .withMessage("Content must be at least two characters long"),
        body('coverImageUrl')
            .isURL()
            .withMessage("Image link URL is malformed or not found")
    ];
}