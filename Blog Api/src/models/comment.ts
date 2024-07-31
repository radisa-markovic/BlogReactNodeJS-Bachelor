import { DataTypes } from 'sequelize';

import sequelize from "../util/database";

const Comment = sequelize.define('comment', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    content: {
        type: DataTypes.STRING,
        allowNull: false,
    }
});

export default Comment;