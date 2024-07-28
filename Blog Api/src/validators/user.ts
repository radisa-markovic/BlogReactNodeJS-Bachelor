import { body, param, ValidationChain } from 'express-validator';

import User from '../models/user';

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
            .isLength({min:4})
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
            .isLength({min:6})      
            .withMessage("Password needs to be at least 6 characters long")              
    ];
}