import { body, param, ValidationChain } from 'express-validator';

import User from '../models/user';

const MINIMUM_PASSWORD_LENGTH: number = 6;
const MINIMUM_USERNAME_LENGTH: number = 4

export const validateID = (): ValidationChain => {
    return param('userId')
        .trim()
        .notEmpty()
        .isNumeric();
}

export const validateUser = (): ValidationChain[] => {
    return [
        body('username')
            .trim()
            .isLength({min:MINIMUM_USERNAME_LENGTH})
            .withMessage("Username must be at least 4 characters long")
            .custom((username) => {
                return User.findOne({
                    where: {
                        username: username
                    }
                }).then((user) => {
                    if(user)
                        throw new Error("Provided username is taken")
                })
            }),
        body('email')
            .trim()
            .isEmail()
            .normalizeEmail()
            .withMessage("Impromer email.")
            .custom((email) => {
                return User.findOne({
                    where: {
                        email: email
                    }
                }).then((user) => {
                    if(user)
                        throw new Error("Email is already is in use")
                })
            }),
        body('password')
            .isLength({min:MINIMUM_PASSWORD_LENGTH})      
            .withMessage("Password needs to be at least 6 characters long")              
    ];
}

export const validateLoginData = (): ValidationChain[] => {
    return [
        body('email')
            .trim()
            .normalizeEmail()
            .isEmail()
            .withMessage("Email is not in correct form"),
        body('password')
            .isLength({min: MINIMUM_PASSWORD_LENGTH})
            .withMessage("Password should be at least 6 characters long")
    ];
}