import path from "path";

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import Post from './models/post';
import User from './models/user';
import Comment from "./models/comment";
import Reaction from "./models/reaction";
import Tag from "./models/tag";

import postRoutes from './routes/post';
import userRoutes from './routes/user';
import tagRoutes from './routes/tag';

import sequelize from "./util/database";
import { multerUploadMiddleware } from "./util/multer";

dotenv.config();
const app = express();
app.use(express.json());
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(multerUploadMiddleware.single('coverImage'));
app.use(cors());

app.use("/posts", postRoutes);
app.use("/users", userRoutes);
app.use("/tags", tagRoutes);
app.use("**", (request, response, next) => {
    response.status(404).json({
        message: "No such route exists"
    })
});

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
// Post.hasMany(Tag);
// Tag.hasMany(Post);

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

const FORCE_SYNC: boolean = false;

sequelize
    .sync({ force: FORCE_SYNC })
    .then(() => {
        app.listen(process.env.PORT || 3002, () => {
            console.log("Server is up and running on port: " + process.env.PORT || 3002);
        });
    });