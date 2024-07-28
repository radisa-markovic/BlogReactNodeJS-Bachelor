import { Request, Response, NextFunction } from "express";
import { FieldValidationError, validationResult } from 'express-validator';

import User from '../models/user';

export const getUsers = async (request: Request, response: Response, next: NextFunction) => {
    
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
            await User.create({
                email: request.body.email,
                username: request.body.username,
                password: request.body.password
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