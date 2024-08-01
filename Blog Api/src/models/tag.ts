import { DataTypes } from 'sequelize';
import sequelize from "../util/database";

const Tag = sequelize.define('tag', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    }
});

export default Tag;