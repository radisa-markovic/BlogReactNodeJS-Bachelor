import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const checkJwt = (
    request: Request, 
    response: Response, 
    next: NextFunction
) => {
    //Header will contain "Bearer akfjsdhkzjncxvzbluiw"
    //the second part is the token
    const authHeader = request.get('Authorization');
    if(!authHeader)
    {
        return response.status(401).json({
            message: "Not authenticated."
        });
    }

    const token = authHeader.split(" ")[1];
    if(!token)
    {
        return response.status(401).json({
            message: "Not authenticated."
        }); 
    }

    let decodedToken;

    try
    {
        decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_SIGNATURE!)
    }
    catch(jwtError: any)
    {
        const error = new Error(jwtError.message);
        error.name = jwtError.name;
        //@ts-ignore
        error.statusCode = 401;
        throw error;
    }

    if(!decodedToken)
    {
        const error = new Error("Not authenticated.");
        //@ts-ignore
        error.statusCode = 401;
        throw error;
    }

    //@ts-ignore
    request.userId = decodedToken.id;
    next();
}