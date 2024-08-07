import { Request, Response, NextFunction } from "express";
import { FieldValidationError, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import User from '../models/user';

// const ACCESS_TOKEN_SECRET_SIGNATURE: string = "aa711eb31bfe9f77d61ec4146bdd521a3c00cff92169d9b7085965a49f03c97daa42399fc622c1488c292c9244e92ac702b9a4b34dd9e8994b9012e61aae3284";

export const getUsers = async (
    request: Request, 
    response: Response, 
    next: NextFunction
) => {
    
    try
    {
        const users = await User.findAll();
        if(!users)
        {
            return response.status(404).json({
                message: "No users found"
            });
        }

        response.status(200).json({
            users: users
        });
    }
    catch(error)
    {
        response.status(500).json({
            message: "Server error"
        })
    }
}

export const getUser = async (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    const userId = parseInt(request.params.userId);
    if(Number.isNaN(userId))
    {
        return response.status(404).json({
            message: "User with the given id not found"
        });
    }

    try
    {
        const user = await User.findByPk(userId);
        if(!user)
        {
            return response.status(404).json({
                message: "User with the given id not found"
            });
        }

        return response.status(200).json({
            user: user
        });
    }
    catch(error: any)
    {
        if(!error.statusCode)
        {
            error.statusCode = 500;
        }

        response.status(error.statusCode).json({
            message: "There has been a server error"
        });
    }
}

export const createUser = async (request: Request, response: Response, next: NextFunction) => {
    const errors = validationResult(request);
    if(errors.isEmpty())
    {
        try
        {
            const hashedPassword = await bcrypt.hash(request.body.password, 12);
            await User.create({
                email: request.body.email,
                username: request.body.username,
                password: hashedPassword
            });

            response.status(201).json({
                message: 'User created'
            });
        }
        catch(error: any)
        {
            if(error.statusCode)
                error.statusCode = 500;

            console.error(error);

            next(error);
        }
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

/**
 * TODO: validation for the case when user updates only one element
 */

export const updateUser = async (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    const errors = validationResult(request);
    if(errors.isEmpty())
    {
        try
        {
            await User.update({
                username: request.body.username,
                email: request.body.email,
                password: request.body.password,
            }, {
                where: {
                    id: parseInt(request.params.userId)
                }
            });

            response.status(201).json({
                message: "User with id: " + request.params.userId + " successfully updated" 
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

export const deleteUser = async (
    request: Request, 
    response: Response, 
    next: NextFunction
) => {
    const userId = parseInt(request.params.userId);
    if(Number.isNaN(userId))
    {
        return response.status(404).json({
            message: 'User with the given ID does not exist'
        });
    }

    try
    {
        await User.destroy({
            where: {
                id: userId
            }
        });

        response.status(200).json({
            message: `User with id: ${userId} successfully deleted`
        });
    }
    catch(error: any)
    {
        if(!error.statusCode)
            error.statusCode = 500;

        response.status(error.statusCode).json({
            message: "THere has been a server error"
        });
    }
}

export const login = async (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    const errors = validationResult(request);
    const { email, password, username } = request.body;

    if(errors.isEmpty())
    {
        try
        {
            const user: any = await User.findOne({
                where: {
                    email: email,
                }
            })
    
            if(!user)
            {
                return response.status(404).json({
                    message: "User with given email not found"
                });
            }
    
            //@ts-ignore
            const passwordIsMatched = await bcrypt.compare(password, user.password);
            if(!passwordIsMatched)
            {
                return response.status(404).json({
                    message: "Password does not match"
                });
            }
    
            const accessToken = jwt.sign({
                email: user.email,
                id: user.id
            }, process.env.ACCESS_TOKEN_SECRET_SIGNATURE!, {
                expiresIn: '1h'
            });
    
            response.status(201).json({
                accessToken: accessToken
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