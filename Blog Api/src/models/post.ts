import { DataTypes } from 'sequelize';
import sequelize from '../util/database';

const Post = sequelize.define('product', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    content: {
        type: DataTypes.STRING,
        allowNull: false
    },
    coverImageUrl: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

export interface PostInterface
{
    title: string,
    description: string,
    content: string
}

export default Post;