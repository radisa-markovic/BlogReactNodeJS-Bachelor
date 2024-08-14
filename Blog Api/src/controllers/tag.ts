import { Request, Response, NextFunction } from "express";
import Tag from "../models/tag";

export const create = async (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    const { name } = request.body;
    try
    {
        await Tag.create({
            name: name
        });

        response.status(201).json({
            message: "New tag successfully created"
        });
    }
    catch(error: any)
    {
        next(error);
    }
}

export const remove = async (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    const { name } = request.body;

    try
    {
        const result = await Tag.destroy({
            where: {
                name: name
            }
        });

        if(!result)
        {
            return response.status(404).json({
                message: "Tag not found"
            });
        }

        return response.status(201).json({
            message: "Tag successfully removed"
        });
    }
    catch(error: any)
    {
        next(error);
    }
}

export const get = async (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    const { name } = request.body;

    try
    {
        const tag = await Tag.findOne({
            where: {
                name: name
            }
        });        

        if(!tag)
        {
            return response.status(404).json({
                message: "No such tag found"
            });
        }

        response.status(201).json({
            tag: tag
        });
    }
    catch(error: any)
    {
        next(error);
    }
}

export const getAll = async (
    request: Request, 
    response: Response, 
    next: NextFunction
) => {
    try
    {
        const tags = await Tag.findAll({
            order: [
                ['name', 'ASC']
            ]
        });
        if(!tags)
        {
            return response.status(404).json({
                message: "No tags found"
            });
        }

        return response.status(201).json({
            tags: tags
        });
    }
    catch(error: any)
    {
        next(error);
    }
}