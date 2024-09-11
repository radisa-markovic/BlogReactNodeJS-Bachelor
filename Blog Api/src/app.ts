import path from "path";

import express, { Request, Response, NextFunction, response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";

import Post from './models/post';
import User from './models/user';
import Comment from "./models/comment";
import Reaction from "./models/reaction";
import Tag from "./models/tag";
import RefreshToken from "./models/refreshToken";

import postRoutes from './routes/post';
import userRoutes from './routes/user';
import commentRoutes from './routes/comment';
import tagRoutes from './routes/tag';

import sequelize from "./util/database";

dotenv.config();
const app = express();
app.use(cookieParser());
app.set("trust proxy", 1);
app.use(express.json());
//false - x-www-form-urlencoded can be parsed (Postman), true - form data can be parsed
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: true,
    credentials: true,
    optionsSuccessStatus: 200
}));
/**==> check multer when changing this and vice versa */
app.use(
    '/images', 
    express.static(
        path.join(
            __dirname, 
            '..',
            'images'
        )
    )
);

app.use("/posts", postRoutes);
app.use("/users", userRoutes);
app.use("/comments", commentRoutes);
app.use("/tags", tagRoutes);
app.use("**", (request, response, next) => {
    response.status(404).json({
        message: "No such route exists"
    })
});

//Read the docs: it says that this universal error handler should be set last
app.use((
    error: any, 
    request: Request, 
    response: Response, 
    next: NextFunction
) => {
    const data = error.data;
    const status = error.statusCode || 500;
    const message = error.message || "Something went wrong";

    response.status(status).json({
        message: message,
        data: data
    });
});

/**==> should move up if the universal error handler doesn't work */
User.hasMany(Post);
Post.belongsTo(User, { 
    constraints: true, 
    onDelete: 'CASCADE'
});
Post.hasMany(Comment);
Comment.belongsTo(Post, {
    constraints: true,
    onDelete: "CASCADE"
});
User.hasMany(Comment);
Comment.belongsTo(User, {
    constraints: true,
    onDelete: "CASCADE"
});
Post.hasMany(Reaction);
Reaction.belongsTo(Post, {
    constraints: true,
    onDelete: "CASCADE"
});
User.hasMany(Reaction);
Reaction.belongsTo(User);
Post.belongsToMany(Tag, {
    through: "Post_Tags",
    constraints: true,
    onDelete: "CASCADE"
});
Tag.belongsToMany(Post, {
    through: "Post_Tags",
    constraints: true,
    onDelete: "CASCADE"
});

User.hasMany(RefreshToken);
RefreshToken.belongsTo(User, {
    constraints: true,
    onDelete: 'CASCADE'
});
//2024-08-12 16:38:59

const FORCE_SYNC: boolean = false;

sequelize
    .sync({ force: FORCE_SYNC })
    .then(() => {
        app.listen(3002, () => {
            console.log("Server is up and running on port: " + 3002);
        });
    });