import { Request, Response, NextFunction } from "express";
import { FieldValidationError, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import User from '../models/user';
import RefreshToken from "../models/refreshToken";

const REFRESH_TOKEN_KEY: string = "refreshToken";

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
        // const formattedError = errors.formatWith((error) => {
        //     return {
        //         [(error as FieldValidationError).path]: (error as FieldValidationError).msg
        //     }
        // });
        // console.log(formattedError.array());
        // response.status(422).json({
        //     message: "Validation failed",
        //     errors: formattedError.array()
        // }); 
        response.status(422).json({
            message: "Validation failed",
            errors: errors.array()
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
    console.log(errors);

    if(errors.isEmpty())
    {
        try
        {
            const user: any = await User.findOne({
                where: {
                    // email: email,
                    username: username
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
                username: user.username,
                id: user.id
            }, process.env.ACCESS_TOKEN_SECRET_SIGNATURE!, {
                expiresIn: '1h'
            });

            const refreshToken = jwt.sign({
                username: user.username,
                id: user.id
            }, process.env.REFRESH_TOKEN_SECRET_SIGNATURE!, {
                expiresIn: '1d'
            });

            const refreshTokenFromDB = await RefreshToken.create({
                value: refreshToken
            })
            await user.addRefreshToken(refreshTokenFromDB);            

            const ONE_DAY_IN_MILLISECONDS: number = 24 * 60 * 60 * 1000;
            
            response.cookie(
                REFRESH_TOKEN_KEY,
                // "refreshToken",
                refreshToken,
                {
                    httpOnly: true,
                    maxAge: ONE_DAY_IN_MILLISECONDS,
                    // sameSite: "none",
                    // secure: true,
                    path: "/"
                } 
            );    

            response.status(201).json({
                accessToken: accessToken,
                username: user.username,
                id: user.id
            });
        }
        catch(error: any)
        {
            console.log(error);
            if(!error.statusCode)
                error.statusCode = 500;
    
            next(error);
        }
    }
    else
    {
        // const formattedError = errors.formatWith((error) => {
        //     return {
        //         [(error as FieldValidationError).path]: (error as FieldValidationError).msg
        //     }
        // });
        // response.status(422).json({
        //     message: "Validation failed",
        //     errors: formattedError.array()
        // });
        response.status(422).json({
            message: "Validation failed",
            errors: errors.array()
        });
    }    
}

export const sendTokens = async (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    const receivedRefreshToken = request.cookies[REFRESH_TOKEN_KEY];
    if(!receivedRefreshToken)
    {
        return response.status(401).json({
            message: 'No refresh token, user should be logged out'
        });
    }
    //Reuse detection:
    //if refresh token found: remove associated token family, log user out
    //if not found, store token, send new pair of access and refresh token

    let decodedToken;
    let foundUser;
    try
    {
        //will throw an error if it's expired, or not a token at all
        decodedToken = jwt.verify(
            receivedRefreshToken,
            process.env.REFRESH_TOKEN_SECRET_SIGNATURE!
        );

        const foundToken = await RefreshToken.findOne({
            where: {
                value: receivedRefreshToken
            }
        });

        if(!foundToken)
        {
            return response.status(404).json({
                message: "No token found"
            });
        }

        //@ts-ignore
        if(foundToken.isUsed)
        {
            await RefreshToken.destroy({
                where: {
                    userId: foundToken.userId
                }
            });

            response.clearCookie(REFRESH_TOKEN_KEY);

            return response.status(307).json({
                message: 'You need to log in to access this feature'
            });
        }
        
        await foundToken.update({
            isUsed: true
        });

        foundUser = await User.findOne({
            include: {
                model: RefreshToken,
                required: true,
                where: {
                    value: receivedRefreshToken
                }
            },
            where: {
                id: decodedToken.id
            }
        });

        if(!foundUser)
        {
            return response.status(404).json({
                message: 'User not found'
            });
        }

        const newAccessToken = jwt.sign({
            //@ts-ignore
            username: decodedToken.username,
            //@ts-ignore
            id: decodedToken.id
        }, process.env.ACCESS_TOKEN_SECRET_SIGNATURE!, {
            expiresIn: '1h'
        });
    
        const newRefreshToken = jwt.sign({
            //@ts-ignore
            username: foundUser.username,
            //@ts-ignore
            id: foundUser.id
        }, process.env.REFRESH_TOKEN_SECRET_SIGNATURE!, {
            expiresIn: '1d'
        });
    
        const refreshTokenFromDB = await RefreshToken.create({
            value: newRefreshToken
        })
        //@ts-ignore
        await foundUser.addRefreshToken(refreshTokenFromDB);            
    
        const ONE_DAY_IN_MILLISECONDS: number = 24 * 60 * 60 * 1000;
        
        response.cookie(
            REFRESH_TOKEN_KEY,
            // "refreshToken",
            newRefreshToken,
            {
                httpOnly: true,
                maxAge: ONE_DAY_IN_MILLISECONDS,
                // sameSite: "none",
                // secure: true,
                path: "/"
            } 
        );    
    
        response.status(201).json({
            accessToken: newAccessToken,
            userData: {
                //@ts-ignore
                username: decodedToken.username,
                //@ts-ignore
                id: decodedToken.id
            }
        });
    }
    catch(error)
    {
        console.log(error);
        throw error;
    }
}

export const logout = async (
    request: Request, 
    response: Response, 
    next: NextFunction
) => {
    const receivedRefreshToken = request.cookies[REFRESH_TOKEN_KEY];
    if(!receivedRefreshToken)
    {
        return response.status(204).json({
            message: 'No refresh token found'
        });
    }

    const dbRefreshToken = await RefreshToken.findOne({
        where: {
            value: receivedRefreshToken
        }
    });

    if(!dbRefreshToken)
    {
        response.clearCookie(REFRESH_TOKEN_KEY);
        return response.status(204).json({
            message: 'No refresh token found'
        });
    }
    //@ts-ignore
    const refreshTokenOwner = await dbRefreshToken.getUser();
    if(!refreshTokenOwner)
    {
        response.clearCookie(REFRESH_TOKEN_KEY)
        return response.status(204).json({
            message: 'No user token found'
        });
    }

    await RefreshToken.destroy({
        where: {
            userId: refreshTokenOwner.id
        }
    });

    response.clearCookie(REFRESH_TOKEN_KEY)
    return response.status(204).json({
        message: 'Logout complete'
    });
}