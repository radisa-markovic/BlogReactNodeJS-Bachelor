import { param, body, ValidationChain } from 'express-validator';

const MINIMAL_TITLE_LENGTH: number = 2;
const MINIMAL_DESCRIPTION_LENGTH: number = 2;
const MINIMAL_CONTENT_LENGTH: number = 2;

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
        // body('coverImageUrl')
        //     .isURL()
        //     .withMessage("Image link URL is malformed or not found")
    ];
}